import React, { memo, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
  drawSlider,
  getRelativeCoordinates,
  Orientation,
  PRIMARY_COLORS_LAYER,
  sqrPointer
} from './Utils'
import { Pane } from '../../../layers'

const ColorSlider = memo(function ColorSlider(props) {
  const { VERTICAL, HORIZONTAL } = Orientation
  const {
    onChange,
    size = 150,
    orientation = HORIZONTAL,
    value,
    disabled,
    ...rest
  } = props

  const canvasRef = useRef()
  const referenceSize = 9

  const [isMouseDown, setMouseDown] = useState(false)
  const [pointer, setPointer] = useState(
    value || {
      pos: 0,
      hex: '#ffffff',
      rgb: {
        r: 255,
        g: 255,
        b: 255
      }
    }
  )

  const CURSOR_MAX_GAP =
    orientation === HORIZONTAL
      ? size - sqrPointer.size
      : size - referenceSize

  const drawRainbow = (ctx, size) => {
    let rainbow
    // Building a gradient component to paint our rainbow :D
    if (orientation === HORIZONTAL)
      rainbow = ctx.createLinearGradient(0, 0, size, 0)
    else if (orientation === VERTICAL)
      rainbow = ctx.createLinearGradient(0, 0, 0, size)
    PRIMARY_COLORS_LAYER.forEach(({ color, offset }) =>
      rainbow.addColorStop(offset, color)
    )
    // Applying on canvas
    ctx.fillStyle = rainbow
    if (orientation === HORIZONTAL) ctx.fillRect(0, 0, size, referenceSize)
    else if (orientation === VERTICAL) ctx.fillRect(0, 0, referenceSize, size)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    // noinspection JSUnresolvedFunction
    const ctxCanvas = canvas.getContext('2d')
    // Let's start creating the main gradient view
    drawRainbow(ctxCanvas, size)
    drawSlider(ctxCanvas, [pointer, setPointer], orientation, referenceSize)
    // Notify if there is an onChange handler
    onChange && onChange(pointer)
  }, [isMouseDown, orientation, pointer.pos])

  const width = orientation === HORIZONTAL ? size : referenceSize
  const height = orientation === HORIZONTAL ? referenceSize : size

  return (
    <Pane width={width} height={height} opacity={disabled && '0.5'} {...rest}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ display: 'block' }}
        onMouseMove={e => {
          e.persist()
          if (!disabled && isMouseDown) {
            setPointer(prev => {
              const obj = getRelativeCoordinates(e, e.target)
              const pos = orientation === HORIZONTAL ? obj.x : obj.y
              return {
                ...prev,
                pos: pos <= CURSOR_MAX_GAP - 1 ? pos : prev.pos
              }
            })
          }
        }}
        onMouseDown={e => {
          e.persist()
          if (!disabled) {
            setPointer(prev => {
              const obj = getRelativeCoordinates(e, e.target)
              const pos = orientation === HORIZONTAL ? obj.x : obj.y
              setMouseDown(true)
              return {
                ...prev,
                pos: pos <= CURSOR_MAX_GAP - 1 ? pos : prev.pos
              }
            })
          }
        }}
        onMouseUp={() => !disabled && setMouseDown(false)}
        onMouseLeave={() => !disabled && setMouseDown(false)}
      />
    </Pane>
  )
})

ColorSlider.propTypes = {
  /**
   * Implements <Pane /> prop-types.
   */
  ...Pane.propTypes,
  /**
   * The element size (one-dimensional)
   */
  size: PropTypes.number,
  /**
   * The ColorSliderValue object to init the component
   */
  value: PropTypes.object,
  /**
   * The element orientation
   * (value: 'HORIZONTAL' or 'VERTICAL')
   */
  orientation: PropTypes.oneOf(['HORIZONTAL', 'VERTICAL']),
  /**
   * Function called when value changes.
   * (value: ColorSliderValue) => void
   */
  onChange: PropTypes.func,
  /**
   * Makes the input element disabled.
   */
  disabled: PropTypes.bool
}

export default ColorSlider
