import Vue from '../../utils/vue'
import identity from '../../utils/identity'
import { concat } from '../../utils/array'
import { getComponentConfig } from '../../utils/config'
import { isString } from '../../utils/inspect'
import { toInteger } from '../../utils/number'
import { toString } from '../../utils/string'
import { mergeData } from 'vue-functional-data-merge'

// --- Constants --

const NAME = 'BImg'

// Blank image with fill template
const BLANK_TEMPLATE =
  '<svg width="%{w}" height="%{h}" ' +
  'xmlns="http://www.w3.org/2000/svg" ' +
  'viewBox="0 0 %{w} %{h}" preserveAspectRatio="none">' +
  '<rect width="100%" height="100%" style="fill:%{f};"></rect>' +
  '</svg>'

export const props = {
  src: {
    type: String
    // default: null
  },
  srcset: {
    type: [String, Array]
    // default: null
  },
  sizes: {
    type: [String, Array]
    // default: null
  },
  alt: {
    type: String,
    default: null
  },
  width: {
    type: [Number, String]
    // default: null
  },
  height: {
    type: [Number, String]
    // default: null
  },
  block: {
    type: Boolean,
    default: false
  },
  fluid: {
    type: Boolean,
    default: false
  },
  fluidGrow: {
    // Gives fluid images class `w-100` to make them grow to fit container
    type: Boolean,
    default: false
  },
  rounded: {
    // rounded can be:
    //   false: no rounding of corners
    //   true: slightly rounded corners
    //   'top': top corners rounded
    //   'right': right corners rounded
    //   'bottom': bottom corners rounded
    //   'left': left corners rounded
    //   'circle': circle/oval
    //   '0': force rounding off
    type: [Boolean, String],
    default: false
  },
  thumbnail: {
    type: Boolean,
    default: false
  },
  left: {
    type: Boolean,
    default: false
  },
  right: {
    type: Boolean,
    default: false
  },
  center: {
    type: Boolean,
    default: false
  },
  blank: {
    type: Boolean,
    default: false
  },
  blankColor: {
    type: String,
    default: () => getComponentConfig(NAME, 'blankColor')
  }
}

// --- Helper methods ---

const makeBlankImgSrc = (width, height, color) => {
  const src = encodeURIComponent(
    BLANK_TEMPLATE.replace('%{w}', toString(width))
      .replace('%{h}', toString(height))
      .replace('%{f}', color)
  )
  return `data:image/svg+xml;charset=UTF-8,${src}`
}

// @vue/component
export const BImg = /*#__PURE__*/ Vue.extend({
  name: NAME,
  functional: true,
  props,
  render(h, { props, data }) {
    let src = props.src
    let width = toInteger(props.width) || null
    let height = toInteger(props.height) || null
    let align = null
    let block = props.block
    let srcset = concat(props.srcset)
      .filter(identity)
      .join(',')
    let sizes = concat(props.sizes)
      .filter(identity)
      .join(',')
    if (props.blank) {
      if (!height && width) {
        height = width
      } else if (!width && height) {
        width = height
      }
      if (!width && !height) {
        width = 1
        height = 1
      }
      // Make a blank SVG image
      src = makeBlankImgSrc(width, height, props.blankColor || 'transparent')
      // Disable srcset and sizes
      srcset = null
      sizes = null
    }
    if (props.left) {
      align = 'float-left'
    } else if (props.right) {
      align = 'float-right'
    } else if (props.center) {
      align = 'mx-auto'
      block = true
    }
    return h(
      'img',
      mergeData(data, {
        attrs: {
          src: src,
          alt: props.alt,
          width: width ? toString(width) : null,
          height: height ? toString(height) : null,
          srcset: srcset || null,
          sizes: sizes || null
        },
        class: {
          'img-thumbnail': props.thumbnail,
          'img-fluid': props.fluid || props.fluidGrow,
          'w-100': props.fluidGrow,
          rounded: props.rounded === '' || props.rounded === true,
          [`rounded-${props.rounded}`]: isString(props.rounded) && props.rounded !== '',
          [align]: align,
          'd-block': block
        }
      })
    )
  }
})
