import React, { memo, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { dimensions, layout, position, spacing, borders } from 'ui-box'
import { getRelativeCoordinates } from './Utils'
import { Pane } from '../../../layers'
import { drawSelector } from './Utils'

const ColorPlane = memo(function ColorPlane(props) {
  const {
    onChange,
    width = 150,
    height = 150,
    border = 'default',
    color = '#ffffff',
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
      x: width,
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

  const drawPlane = (ctx, width, height) => {
    // Applying on canvas
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)
    // Painting white and black at edges on our spectrum
    let plane = ctx.createLinearGradient(0, 0, width, 0)
    plane.addColorStop(0, 'rgba(255,255,255,1)')
    plane.addColorStop(1, 'rgba(255,255,255,0)')
    // Applying on canvas
    ctx.fillStyle = plane
    ctx.fillRect(0, 0, width, height)
    // Painting white and black at edges on our spectrum
    plane = ctx.createLinearGradient(0, 0, 0, height)
    plane.addColorStop(0, 'rgba(0,0,0,0)')
    plane.addColorStop(1, 'rgba(0,0,0,1)')
    // Applying on canvas
    ctx.fillStyle = plane
    ctx.fillRect(0, 0, width, height)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    // noinspection JSUnresolvedFunction
    const ctxCanvas = canvas.getContext('2d')
    // Let's start creating the main gradient view
    drawPlane(ctxCanvas, ctxCanvas.canvas.width, ctxCanvas.canvas.height)
    drawSelector(ctxCanvas, [pointer, setPointer])
    // Notify if there is an onChange handler
    onChange && onChange(pointer.value)
  }, [pointer.value.x, pointer.value.y, pointer.value.hex, color])

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

ColorPlane.propTypes = {
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
   * The main color expressed as rgb() or hex
   */
  color: PropTypes.string,
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

export default ColorPlane
