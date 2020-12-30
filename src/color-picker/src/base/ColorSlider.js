import React, { memo, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { borders, layout, position, spacing } from 'ui-box'
import {
  drawSlider,
  getRelativeCoordinates,
  Orientation,
  PRIMARY_COLORS_LAYER
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

  const [pointer, setPointer] = useState({
    style: {
      size: 4,
      color: 'white',
      stroke: '#dddddd',
      shadow: {
        color: '#707070',
        size: 1
      }
    },
    value: value || {
      pos: 1,
      hex: '#ffffff',
      rgb: {
        r: 255,
        g: 255,
        b: 255
      }
    },
    isMouseDown: false
  })

  const CURSOR_MAX_GAP =
    position === HORIZONTAL ? size - pointer.style.size : size - referenceSize

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
    onChange && onChange(pointer.value)
  }, [pointer.isMouseDown, orientation, pointer.value.pos])

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
          if (!disabled && pointer.isMouseDown) {
            setPointer(prev => {
              const obj = getRelativeCoordinates(e, e.target)
              const pos = orientation === HORIZONTAL ? obj.x : obj.y
              return {
                ...prev,
                value: {
                  ...prev.value,
                  pos: pos <= CURSOR_MAX_GAP ? pos : prev.value.pos
                }
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
              return {
                ...prev,
                value: {
                  ...prev.value,
                  pos: pos <= CURSOR_MAX_GAP ? pos : prev.value.pos
                },
                isMouseDown: true
              }
            })
          }
        }}
        onMouseUp={() => {
          if (!disabled) {
            setPointer(prev => {
              return {
                ...prev,
                isMouseDown: false
              }
            })
          }
        }}
        onMouseLeave={() => {
          if (!disabled) {
            setPointer(prev => {
              return {
                ...prev,
                isMouseDown: false
              }
            })
          }
        }}
      />
    </Pane>
  )
})

ColorSlider.propTypes = {
  /**
   * Implements some APIs from ui-box.
   */
  ...spacing.propTypes,
  ...position.propTypes,
  ...layout.propTypes,
  ...borders.propTypes,
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
