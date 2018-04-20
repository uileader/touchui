import fixIosOverflowScrolling from './fixIosOverflowScrolling.js'
import { auto } from 'html-webpack-plugin/lib/chunksorter'
export default {
  prevent: true,
  i: 0,
  refresh: false,
  interval: null,
  setPrevent (val) {
    this.prevent = val
  },
  isRefresh (val) {
    this.refresh = val
  },
  created (that, imageHeight) {
    that.imageHeight = imageHeight
  },
  data: {
    imageHeight: 0,
    originalImageHeight: 0,
    windowWidth: window.innerWidth,
    isMoving: false,
    startY: 0,
    offsetY: 0
  },
  init (domId, that, imageHeight) {
    that.imageHeight = imageHeight
    that.originalImageHeight = imageHeight
    let dom = document.querySelector(domId)
    dom.addEventListener('touchstart', (e) => {
      that.startY = e.touches[0].clientY
      that.isMoving = true
    })
    dom.addEventListener('touchmove', (e) => {
      that.offsetY = e.touches[0].clientY - that.startY
      if (that.offsetY < 0) {
        that.offsetY = 0
      }
      if (this.prevent) { // scrollTop === 0
        if (e.touches[0].clientY > that.startY) { // 向下滑
          e.preventDefault()
          that.imageHeight = that.offsetY / 4 + that.originalImageHeight
        } else {
        }
      } else {

      }
    })
    dom.addEventListener('touchend', (e) => {
      e.preventDefault()
      fixIosOverflowScrolling('touch')
      // if (this.isRefresh) {
      //   that.imageHeight = that.originalImageHeight + 50
      // }
      if (!this.refresh) {
        that.imageHeight = that.originalImageHeight
      }
      that.isMoving = false
      this.i = 0
    })
  },
  imgObj (that) {
    let obj = {}
    // obj.width = '100%'
    obj.height = that.imageHeight + 'px'
    obj['transform-origin'] = 'center top'
    obj['will-change'] = 'transform'
    obj['overflow'] = 'hidden'
    obj.transform = `scale(${that.imageHeight / that.originalImageHeight})`
    if (this.refresh) {
      obj.transition = that.isMoving ? '' : 'all .3s'
    } else {
      obj.transition = that.isMoving ? '' : 'all .2s'
    }
    obj.width = '100%'
    obj.position = 'absolute'
    return obj
  },
  underObj (that) {
    let obj = {}
    obj['will-change'] = 'transform'
    obj.transform = `translate3d(0, ${that.imageHeight - that.originalImageHeight}px,0 )`
    obj.transition = that.isMoving ? '' : 'all .2s'
    return obj
  },
  placeObj (that) {
    let obj = {}
    obj.height = that.originalImageHeight + 'px'
    // obj.height = that.windowWidth * 527 / 982 + 'px'
    return obj
  }
}