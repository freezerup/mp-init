import { getImageInfo } from './wxTool'
import { objCopy } from './tool'

export default class PAINTER {
  constructor(options) {
    this.ctx = options.ctx
    this.data = options.data
  }
  paint(callback) {
    this.downloadImgs().then(res => {
      this.data.forEach((item, index) => {
        if (item.type === 'image' && res[index]) {
          this._draw(res[index])
        } else {
          this._draw(item)
        }
      })
      this.ctx.draw(true, () => {
        callback()
      })
    })
  }
  // 获取图片临时路径
  downloadImgs() {
    return new Promise((resolve, reject) => {
      const images = this.data.reduce((total, item) => {
        return item.type === 'image' ? total.concat(this.downloadImg(item)) : total.concat(null)
      }, [])
      Promise.all(images).then(res => {
        resolve(res)
      })
    })
  }
  downloadImg(image) {
    return new Promise((resolve, reject) => {
      getImageInfo(`${image.data.imageResource}?x-oss-process=style/w${image.data.widthStyle || 800}`).then(res => {
        const url = res.path
        const { path, height, width } = res
        const _image = {
          imageResource: path,
          imgRealH: height,
          imgRealW: width,
        }
        if (url) {
          const _imageData = objCopy(image)
          _imageData.data = Object.assign({}, image.data, _image)
          resolve(_imageData)
        } else {
          resolve(null)
        }
      })
    })
  }
  _draw(view) {
    switch (view.type) {
      case 'rect':
        this._drawRect(view.data)
        break
      case 'gradient':
        this._drawLinearGradient(view.data)
        break
      case 'text':
        this._drawText(view.data)
        break
      case 'image':
        this._drawImg(view.data)
        break
      case 'dash':
        this._drawDashLine(view.data)
        break
      case 'tag':
        this._drawTag(view.data)
        break
      case 'line':
        this._drawLine(view.data)
        break
    }
  }
  // 渐变色
  _drawLinearGradient({ sx, sy, dx, dy, sColor, dColor }) {
    this.ctx.save()
    const grd = this.ctx.createLinearGradient(sx, sy, dx, dy)
    grd.addColorStop(0, sColor)
    grd.addColorStop(1, dColor)
    this._drawRect({ color: grd, sx, sy, width: Math.abs(dx - sx), height: Math.abs(dy - sy) })
  }
  // 背景
  _drawRect({ color, sx, sy, width, height }) {
    this.ctx.save()
    this.ctx.fillStyle = color
    this.ctx.fillRect(sx, sy, width, height)
  }
  // 文字
  _drawText({ line, size, color, text, contentWidth, weight = 'normal', textAlign = 'left', sx, sy }) {
    if (!text) return
    const ctx = this.ctx
    ctx.save()
    let _text = text.replace(/\r|\n|\s/g, '')
    ctx.fillStyle = color
    ctx.font = `normal ${weight} ${size}px PingFangSC-Medium`
    // 如果有行数限制
    if (line) {
      const textWidth = ctx.measureText(_text).width
      if (textWidth > contentWidth * line) {
        const textItemWidth = textWidth / _text.length
        const maxTextLen = Math.floor(contentWidth / textItemWidth)
        _text = `${_text.slice(0, maxTextLen - 2)}...`
      }
    }
    ctx.textAlign = textAlign
    ctx.fillText(_text, sx, sy)
  }
  // 图片
  _drawImg({ imageResource, sx, sy, width, height, borderRadius, imgRealH, imgRealW, mode = 'scaleToFill' }) {
    this.ctx.save()
    if (borderRadius) {
      this._doClip({ width, height, borderRadius, sx, sy })
    }
    // 获得缩放到图片大小级别的裁减框
    let rWidth
    let rHeight
    let startX = 0
    let startY = 0
    if (width > height) {
      rHeight = Math.round((imgRealW / width) * height)
      rWidth = imgRealW
    } else {
      rWidth = Math.round((imgRealH / height) * width)
      rHeight = imgRealH
    }
    if (imgRealW > rWidth) {
      startX = Math.round((imgRealW - rWidth) / 2)
    }
    if (imgRealH > rHeight) {
      startY = Math.round((imgRealH - rHeight) / 2)
    }
    if (mode === 'scaleToFill') {
      this.ctx.drawImage(imageResource, sx, sy, width, height)
    } else {
      this.ctx.drawImage(imageResource, startX, startY, rWidth, rHeight, sx, sy, width, height)
    }
    this.ctx.restore()
  }
  // 虚线
  _drawDashLine({ sx, sy, dx, dy, color }) {
    const ctx = this.ctx
    ctx.save()
    ctx.setLineDash([5, 10], 2)
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(sx, sy)
    ctx.lineTo(dx, dy)
    ctx.stroke()
  }
  // 实线
  _drawLine({ color, sx, sy, width, height }) {
    this.ctx.save()
    this.ctx.strokeStyle = color
    this.ctx.strokeRect(sx, sy, width, height)
  }
  // 根据文字宽度，绘制矩形: 标签
  _drawTag({ size, text, bg, color, sx, sy, css, height }) {
    const ctx = this.ctx
    ctx.setFontSize(size)
    const { width } = ctx.measureText(text)
    const rectWidth = Math.ceil(width + css.paddingLeft + css.paddingRight)
    this._drawRect({ color: bg, sx, sy, width: rectWidth, height })
    this._drawText({ size, color, text, sx: sx + css.paddingLeft, sy: sy + css.paddingTop + size })
  }
  // borderRadius
  _doClip({ borderRadius, width, height, sx, sy }) {
    if (borderRadius && width && height) {
      let border = borderRadius.split(',').map(item => item - 0)
      if (border.length === 1) {
        border = [border[0], border[0], border[0], border[0]]
      }
      this.ctx.setGlobalAlpha(0)
      this.ctx.setFillStyle('white')
      this.ctx.beginPath()
      this.ctx.arc(sx + border[0], sy + border[0], border[0], 1 * Math.PI, 1.5 * Math.PI)
      this.ctx.lineTo(sx + width - border[1], sy)
      this.ctx.arc(sx + width - border[1], sy + border[1], border[1], 1.5 * Math.PI, 2 * Math.PI)
      this.ctx.lineTo(sx + width, sy + height - border[2])
      this.ctx.arc(sx + width - border[2], sy + height - border[2], border[2], 0, 0.5 * Math.PI)
      this.ctx.lineTo(sx + border[3], sy + height)
      this.ctx.arc(sx + border[3], sy + height - border[3], border[3], 0.5 * Math.PI, 1 * Math.PI)
      this.ctx.lineTo(sx, sy + border[0])
      this.ctx.closePath()
      this.ctx.fill()
      this.ctx.clip()
      this.ctx.setGlobalAlpha(1)
    }
  }
}
