import React, { memo, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { dimensions, layout, position, spacing, borders } from 'ui-box'
import {
  getRelativeCoordinates,
  BLACK_AND_WHITE_LAYER,
  PRIMARY_COLORS_LAYER
} from './Utils'
import { Pane } from '../../../layers'
import { drawSelector } from './Utils'

const ColorSpectrum = memo(function ColorSpectrum(props) {
  const {
    onChange,
    width = 150,
    height = 150,
    border = 'default',
    value,
    disabled,
    ...rest
  } = props

  const canvasRef = useRef()

  const [pointer, setPointer] = useState({
    style: {
      color: 'white',
      stroke: '#dddddd',
      radius: 4,
      shadow: {
        color: '#707070',
        size: 1
      }
    },
    value: value || {
      x: 0,
      y: 0,
      hex: '#ffffff',
      rgb: {
        r: 255,
        g: 255,
        b: 255
      }
    },
    isMouseDown: false
  })

  const drawRainbow = (ctx, width, height) => {
    // Building a gradient component to paint our rainbow :D
    let rainbow = ctx.createLinearGradient(0, 0, width, 0)
    PRIMARY_COLORS_LAYER.forEach(({ color, offset }) =>
      rainbow.addColorStop(offset, color)
    )
    // Applying on canvas
    ctx.fillStyle = rainbow
    ctx.fillRect(0, 0, width, height)
    // Painting white and black at edges on our spectrum
    rainbow = ctx.createLinearGradient(0, 0, 0, height)
    BLACK_AND_WHITE_LAYER.forEach(({ color, offset }) =>
      rainbow.addColorStop(offset, color)
    )
    // Applying on canvas
    ctx.fillStyle = rainbow
    ctx.fillRect(0, 0, width, height)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    // noinspection JSUnresolvedFunction
    const ctxCanvas = canvas.getContext('2d')
    // Let's start creating the main gradient view
    drawRainbow(ctxCanvas, ctxCanvas.canvas.width, ctxCanvas.canvas.height)
    drawSelector(ctxCanvas, [pointer, setPointer])
    // Notify if there is an onChange handler
    onChange && onChange(pointer.value)
  }, [pointer.isMouseDown, pointer.value.x, pointer.value.y])

  return (
    <Pane
      width={width}
      height={height}
      border={border}
      opacity={disabled && '0.5'}
      {...rest}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ display: 'block' }}
        onMouseMove={e => {
          e.persist()
          if (!disabled && pointer.isMouseDown) {
            setPointer(prev => {
              return {
                ...prev,
                value: {
                  ...prev.value,
                  x: getRelativeCoordinates(e, e.target).x,
                  y: getRelativeCoordinates(e, e.target).y
                }
              }
            })
          }
        }}
        onMouseDown={e => {
          e.persist()
          if (!disabled) {
            setPointer(prev => {
              return {
                ...prev,
                value: {
                  ...prev.value,
                  x: getRelativeCoordinates(e, e.target).x,
                  y: getRelativeCoordinates(e, e.target).y
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

ColorSpectrum.propTypes = {
  /**
   * Implements some APIs from ui-box.
   */
  ...dimensions.propTypes,
  ...spacing.propTypes,
  ...position.propTypes,
  ...layout.propTypes,
  ...borders.propTypes,
  /**
   * The ColorPickerValue object to init the component
   */
  value: PropTypes.object,
  /**
   * Function called when value changes.
   * (value: ColorSpectrumValue) => void
   */
  onChange: PropTypes.func,
  /**
   * Makes the input element disabled.
   */
  disabled: PropTypes.bool
}

export default ColorSpectrum
