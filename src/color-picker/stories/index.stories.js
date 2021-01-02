import { storiesOf } from '@storybook/react'
import React, { useState } from 'react'
import { ColorPicker, ColorPlane, ColorSlider, ColorSpectrum } from '..'
import { Heading, Label, Text } from '../../typography'
import { Button } from '../../buttons'
import { Pane } from '../../layers'
import { ColorPickerMode, Orientation } from '../src/base/Utils'

storiesOf('color-picker', module).add('ColorPicker', () => {
  const [area, setArea] = useState()
  const [slider, setSlider] = useState()
  const [plane, setPlane] = useState()
  const [basic, setBasic] = useState()
  const [advanced, setAdvanced] = useState()

  const { HORIZONTAL, VERTICAL } = Orientation
  const { BASIC, ADVANCED } = ColorPickerMode
  const [orientation, setOrientation] = useState(HORIZONTAL)

  return (
    <Pane padding={40}>
      <Heading marginBottom={8}>Basic components</Heading>
      <Text is={'p'} marginTop={0}>
        Reusable component to build your custom color-picker
      </Text>
      <Label display={'block'} marginBottom={8}>
        Spectrum
      </Label>
      <ColorSpectrum onChange={e => setArea(e)} value={area} />
      <Pane marginTop={8}>
        <Label display={'block'}>Event</Label>
        <Text>{JSON.stringify(area)}</Text>
      </Pane>
      <Label display={'block'} marginBottom={8} marginTop={16}>
        Plane
      </Label>
      <ColorPlane color={'#0084ff'} width={250} onChange={e => setPlane(e)} />
      <Pane marginTop={8}>
        <Label display={'block'}>Event</Label>
        <Text>{JSON.stringify(plane)}</Text>
      </Pane>
      <Label display={'block'} marginBottom={8} marginTop={16}>
        Slider
      </Label>
      <ColorSlider
        value={slider}
        onChange={e => setSlider(e)}
        orientation={orientation}
      />
      <Pane marginTop={8}>
        <Label display={'block'}>Event</Label>
        <Text>{JSON.stringify(slider)}</Text>
      </Pane>
      <Label display={'block'} marginTop={8}>
        Orientation
      </Label>
      <Text is={'p'} marginTop={0} marginBottom={8}>
        The component can be displayed differently according to orientation
        parameter
      </Text>
      <Pane display={'flex'}>
        <Button marginRight={8} onClick={() => setOrientation(HORIZONTAL)}>
          Horizontal
        </Button>
        <Button onClick={() => setOrientation(VERTICAL)}>Vertical</Button>
      </Pane>
      <Heading marginTop={16} marginBottom={8}>
        Color Picker (Basic)
      </Heading>
      <Text is={'p'} marginTop={0}>
        The standard component provided to pick colors
      </Text>
      <ColorPicker onChange={e => setBasic(e)} value={basic} mode={BASIC} />
      <Heading marginTop={16} marginBottom={8}>
        Color Picker (Advanced)
      </Heading>
      <Text is={'p'} marginTop={0}>
        The standard component provided to pick colors
      </Text>
      <ColorPicker
        onChange={e => setAdvanced(e)}
        value={advanced}
        mode={ADVANCED}
      />
    </Pane>
  )
})
