/* ==================================================== */
/* ===================== <COLORS> ===================== */
/* ==================================================== */

/**
 * Defines an array of primary colors suited for createLinearGradient() function.
 * @type {({offset: number, color: string})[]}
 */
export const PRIMARY_COLORS_LAYER = [
  { offset: 0, color: 'rgb(255,0,0)' },
  { offset: 0.15, color: 'rgb(255,255,0)' },
  { offset: 0.3, color: 'rgb(0,255,0)' },
  { offset: 0.45, color: 'rgb(0,255,255)' },
  { offset: 0.6, color: 'rgb(0,0,255)' },
  { offset: 0.75, color: 'rgb(255,0,255)' },
  { offset: 1, color: 'rgb(255,0,0)' }
]

/**
 * Defines an array of black and white colors suited for createLinearGradient() function.
 * @type {({offset: number, color: string})[]}
 */
export const BLACK_AND_WHITE_LAYER = [
  { offset: 0, color: 'rgba(255,255,255,1)' },
  { offset: 0.5, color: 'rgba(255,255,255,0)' },
  { offset: 0.5, color: 'rgba(0,0,0,0)' },
  { offset: 1, color: 'rgba(0,0,0,1)' }
]

/* ==================================================== */
/* =================== <COLOR SPACE> ================== */
/* ==================================================== */

/**
 * Transform a single number to hex representation
 * @param n {number} The given number
 * @returns {string} The hex representation
 */
const toHex = n => {
  const hex = n.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

/**
 * Convert a given rgb representation to an hex string
 * @param r {number} The red color value
 * @param g {number} The green color value
 * @param b {number} The blue color value
 * @returns {string} The hex representation
 */
export const fromRgbToHex = (r, g, b) => `#${toHex(r)}${toHex(g)}${toHex(b)}`

/**
 * Transform rgb value to hsv
 * @param r The red value
 * @param g The green value
 * @param b The blue value
 * @returns {{h: number, s: number, v: number}}
 */
export const rgb2hsv = (r, g, b) => {
  let rr, gg, bb, h, s

  let rabs = r / 255
  let gabs = g / 255
  let babs = b / 255

  let v = Math.max(rabs, gabs, babs)
  let diff = v - Math.min(rabs, gabs, babs)
  let diffc = c => (v - c) / 6 / diff + 1 / 2
  let percentRoundFn = num => Math.round(num * 100) / 100

  if (diff === 0) {
    h = s = 0
  } else {
    s = diff / v
    rr = diffc(rabs)
    gg = diffc(gabs)
    bb = diffc(babs)

    if (rabs === v) {
      h = bb - gg
    } else if (gabs === v) {
      h = 1 / 3 + rr - bb
    } else if (babs === v) {
      h = 2 / 3 + gg - rr
    }
    if (h < 0) {
      h += 1
    } else if (h > 1) {
      h -= 1
    }
  }
  return {
    h: Math.round(h * 360),
    s: percentRoundFn(s * 100),
    v: percentRoundFn(v * 100)
  }
}

/* ==================================================== */
/* =================== <MOUSE INPUT> ================== */
/* ==================================================== */

/**
 * Returns an object containing mouse coordinates relative to the component
 * @param e The main event
 * @param target The current DOM element
 * @returns {{x: number, y: number}} The mouse coordinate
 */
export const getRelativeCoordinates = (e, target) => {
  return {
    x: Math.max(e.clientX - target.getBoundingClientRect().left, 0),
    y: Math.max(e.clientY - target.getBoundingClientRect().top, 0)
  }
}

/**
 * An enum-like constant to compare orientation
 */
export const Orientation = Object.freeze({
  HORIZONTAL: 'HORIZONTAL',
  VERTICAL: 'VERTICAL'
})

/**
 * An enum-like constant to compare orientation
 */
export const ColorPickerMode = Object.freeze({
  BASIC: 'BASIC',
  ADVANCED: 'ADVANCED'
})

/* ==================================================== */
/* ================= <DRAW FUNCTIONS> ================= */
/* ==================================================== */

/**
 * The basic rounded pointer-style
 */
export const rndPointer = {
  color: 'white',
  stroke: '#ffffff',
  radius: 4
}

/**
 * Draw a simple selector on a 2D canvas
 * @param ctx The canvas context
 * @param pointer The pointer state getter
 * @param setPointer The pointer state setter
 */
export const drawSelector = (ctx, [pointer, setPointer]) => {
  ctx.beginPath()
  ctx.arc(pointer.x, pointer.y, rndPointer.radius, 0, Math.PI * 2)
  ctx.lineWidth = 2
  ctx.strokeStyle = rndPointer.stroke
  ctx.stroke()
  ctx.closePath()
  // Returning current selected color (1x1 for one pixel)
  const { data } = ctx.getImageData(pointer.x, pointer.y, 1, 1)
  // Updating state
  setPointer(prev => {
    return {
      ...prev,
      hex: fromRgbToHex(data[0], data[1], data[2]),
      rgb: {
        r: data[0],
        g: data[1],
        b: data[2]
      }
    }
  })
}

/**
 * The basic square pointer-style
 */
export const sqrPointer = {
  size: 4,
  color: 'white',
  stroke: '#dddddd',
  shadow: {
    color: '#707070',
    size: 1
  }
}

export const drawSlider = (
  ctx,
  [pointer, setPointer],
  orientation,
  referenceSize
) => {
  const { HORIZONTAL, VERTICAL } = Orientation
  // Shadow
  ctx.beginPath()
  if (orientation === HORIZONTAL)
    ctx.rect(
      pointer.pos + sqrPointer.shadow.size,
      0,
      sqrPointer.size,
      referenceSize
    )
  else if (orientation === VERTICAL)
    ctx.rect(
      0,
      pointer.pos + sqrPointer.shadow.size,
      referenceSize,
      sqrPointer.size
    )
  ctx.fillStyle = sqrPointer.shadow.color
  ctx.fill()
  ctx.closePath()
  // Selector
  ctx.beginPath()

  if (orientation === HORIZONTAL)
    ctx.rect(pointer.pos, 0, sqrPointer.size, referenceSize)
  else if (orientation === VERTICAL)
    ctx.rect(0, pointer.pos, referenceSize, sqrPointer.size)

  ctx.strokeStyle = sqrPointer.stroke
  ctx.fillStyle = sqrPointer.color
  ctx.fill()
  ctx.stroke()
  ctx.closePath()

  // Returning current selected color (1x1 for one pixel)
  let data
  if (orientation === HORIZONTAL)
    data = ctx.getImageData(
      pointer.pos + sqrPointer.size + sqrPointer.shadow.size,
      0,
      1,
      1
    ).data
  else if (orientation === VERTICAL)
    data = ctx.getImageData(
      0,
      pointer.pos + sqrPointer.size + sqrPointer.shadow.size,
      1,
      1
    ).data
  // Updating state
  setPointer(prev => {
    return {
      ...prev,
      hex: fromRgbToHex(data[0], data[1], data[2]),
      rgb: {
        r: data[0],
        g: data[1],
        b: data[2]
      }
    }
  })
}
