import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { Popover } from '../../popover'
import ColorSpectrum from './base/ColorSpectrum'
import { IconButton } from '../../buttons'
import { TintIcon } from '../../icons'
import { Pane } from '../../layers'
import { Label } from '../../typography'
import { ColorPickerMode } from './base/Utils'
import { TextInput } from '../../text-input'
import ColorPlane from './base/ColorPlane'
import ColorSlider from './base/ColorSlider'

const ColorPicker = memo(function ColorPicker(props) {
  const { BASIC, ADVANCED } = ColorPickerMode
  const { onChange, details = true, mode = BASIC, value, ...rest } = props
  const [color, setColor] = useState({})
  const [plane, setPlane] = useState({})

  return (
    <Popover
      {...rest}
      content={
        <Pane padding={8}>
          <Label display={'block'} marginBottom={8}>
            Color Picker
          </Label>
          {mode === BASIC ? (
            <ColorSpectrum
              width={250}
              marginBottom={8}
              onChange={e => onChange && onChange(e)}
              value={value}
            />
          ) : (
            <>
              <ColorPlane
                width={250}
                marginBottom={16}
                color={color?.hex}
                onChange={e => setPlane(e)}
              />
              <ColorSlider
                size={250}
                marginBottom={8}
                onChange={e => setColor(e)}
              />
            </>
          )}
          {((mode === BASIC && details) || mode === ADVANCED) && (
            <Pane
              display={'flex'}
              justifyContent={'space-around'}
              alignItems={'center'}
              marginTop={16}
              marginBottom={4}
            >
              <Pane
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
              >
                <TextInput
                  value={mode === BASIC ? value?.rgb?.r : plane?.rgb?.r}
                  width={45}
                  textAlign={'center'}
                />
                <Label>R</Label>
              </Pane>
              <Pane
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
              >
                <TextInput
                  value={mode === BASIC ? value?.rgb?.g : plane?.rgb?.g}
                  width={45}
                  textAlign={'center'}
                />
                <Label>G</Label>
              </Pane>
              <Pane
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
              >
                <TextInput
                  value={mode === BASIC ? value?.rgb?.b : plane?.rgb?.b}
                  width={45}
                  textAlign={'center'}
                />
                <Label>B</Label>
              </Pane>
              <Pane
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                width={75}
              >
                <TextInput
                  value={mode === BASIC ? value?.hex : plane?.hex}
                  width={75}
                  textAlign={'center'}
                />
                <Label>HEX</Label>
              </Pane>
            </Pane>
          )}
          <Label display={'block'} marginBottom={4}>
            Preview
          </Label>
          <Pane
            border={'default'}
            borderRadius={4}
            marginBottom={8}
            background={mode === BASIC ? value?.hex : plane?.hex}
            height={25}
          />
        </Pane>
      }
    >
      <IconButton icon={<TintIcon />} border={'none'} />
    </Popover>
  )
})

// We do not need this one
const { children, content, ...popover } = Popover.propTypes

ColorPicker.propTypes = {
  /** ColorPicker is a wrapper around Popover so it extends its props */
  ...popover,
  /**
   * Set the component mode ('basic' or 'advanced').
   * Default is 'basic'.
   */
  mode: PropTypes.oneOf([ColorPickerMode.BASIC, ColorPickerMode.ADVANCED]),
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
  disabled: PropTypes.bool,
  /**
   * Show color details (valid only with Basic mode set).
   * (default is true)
   */
  details: PropTypes.bool
}

export default ColorPicker
