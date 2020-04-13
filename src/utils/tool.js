import { getWzjVisitor, setWzjVisitor } from './storage'
import { getSystemInfoLocal } from './common'

const TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

export const SILENCE_LOGIN = 'SILENCE_LOGIN' // 静默登录
export const AUTH_LOGIN = 'AUTH_LOGIN' // 授权登录
export const NORMAL_LOGIN = 'NORMAL_LOGIN' // 正常登录

/**
 * 创建游客唯一标示:wzj_visitor
 * 1: 优先获取本地缓存
 * 2: 如果本地没有缓存，则创建新标示，并缓存本地
 * 3: 设置到请求头X-BDBS-Device-ID
 * @returns {String}
 */
export function getVisitor() {
  let visitorId = getWzjVisitor()
  if (!visitorId) {
    visitorId = uuid()
    setWzjVisitor(visitorId)
  }
  return visitorId
}
// 生成随机设备号
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// 静默登录

/**
 * base64 encode
 * @param input
 * @returns {string}
 */
export function encode64(input) {
  input = String(input)
  if (/[^\0-\xFF]/.test(input)) {
    // Note: no need to special-case astral symbols here, as surrogates are
    // matched, and the input is supposed to only contain ASCII anyway.
    console.error(
      'The string to be encoded contains characters outside of the ' +
      'Latin1 range.'
    )
  }
  var padding = input.length % 3
  var output = ''
  var position = -1
  var a
  var b
  var c
  var buffer
  // Make sure any padding is handled outside of the loop.
  var length = input.length - padding

  while (++position < length) {
    // Read three bytes, i.e. 24 bits.
    a = input.charCodeAt(position) << 16
    b = input.charCodeAt(++position) << 8
    c = input.charCodeAt(++position)
    buffer = a + b + c
    // Turn the 24 bits into four chunks of 6 bits each, and append the
    // matching character for each of them to the output.
    output += (
      TABLE.charAt(buffer >> 18 & 0x3F) +
      TABLE.charAt(buffer >> 12 & 0x3F) +
      TABLE.charAt(buffer >> 6 & 0x3F) +
      TABLE.charAt(buffer & 0x3F)
    )
  }

  if (padding === 2) {
    a = input.charCodeAt(position) << 8
    b = input.charCodeAt(++position)
    buffer = a + b
    output += (
      TABLE.charAt(buffer >> 10) +
      TABLE.charAt((buffer >> 4) & 0x3F) +
      TABLE.charAt((buffer << 2) & 0x3F) +
      '='
    )
  } else if (padding === 1) {
    buffer = input.charCodeAt(position)
    output += (
      TABLE.charAt(buffer >> 2) +
      TABLE.charAt((buffer << 4) & 0x3F) +
      '=='
    )
  }
  return output
}

export function getQueryString(name, locationHref) {
  if (!locationHref) {
    return
  }
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const r = locationHref.split('?')[1] ? locationHref.split('?')[1].match(reg) : ''
  if (r !== null && r !== '') {
    return decodeURI(r[2])
  }
  return null
}
export function parseUrl(url) {
  if (!url) return null
  const pattern = /(\w+)=(\w+)/ig
  const params = {}
  url.replace(pattern, (a, b, c) => {
    params[b] = c
  })
  return params
}
// 时间格式化
export function prefixInteger(num, length) {
  return (Array(length).join('0') + num).slice(-length)
}

export function timeFormat(time, type = 'DD-hh-mm-ss') {
  const types = type.split('-')
  const timeFormat = {}
  if (types[0] === 'DD') {
    timeFormat.day = Math.floor(time / 86400)
  }
  if (types[1] === 'hh') {
    timeFormat.hour = prefixInteger(Math.floor((time / 3600) % 24), 2)
  }
  if (types[2] === 'mm') {
    timeFormat.minute = prefixInteger(Math.floor((time / 60) % 60), 2)
  }
  if (types[3] === 'ss') {
    timeFormat.second = prefixInteger(Math.floor(time % 60), 2)
  }
  if (types[4] === 'tt') { // 秒后一位
    timeFormat.third = prefixInteger(('' + time).split('.')[1], 1)
  }
  return timeFormat
}
// 日期格式化
export function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
 *
 * @param {*} d new Date() | 秒
 * @param {Object} opts 格式 YYYY-MM-DD hh:mm:ss 区分大小写
 * @example
 * dateFormat(d) => 2018.07.16
 * dateFormat(d, 'YYYY-MM-DD hh:mm:ss') => 2018-07-16 17:18:33
 */
export function dateFormat(d, opts, isMs) {
  const date = typeof d !== 'object' ? new Date(d * (isMs ? 1 : 1000)) : d
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  let r = [year, month, day].map(formatNumber).join('.') // 默认值
  if (opts) {
    r = opts.replace(/YYYY|MM|DD|hh|mm|ss/g, match => {
      switch (match) {
        case 'YYYY':
          return year
        case 'MM':
          return formatNumber(month)
        case 'DD':
          return formatNumber(day)
        case 'hh':
          return formatNumber(hour)
        case 'mm':
          return formatNumber(minute)
        case 'ss':
          return formatNumber(second)
        default:
          return match
      }
    }
    )
  }
  return r
}

export function getCountdown(time) {
  const day = Math.floor(time / 86400)
  const hour = prefixInteger(Math.floor((time / 3600) % 24), 2)
  const minute = prefixInteger(Math.floor((time / 60) % 60), 2)
  const second = prefixInteger(Math.floor(time % 60), 2)
  let countdow = ''
  if (day > 0) {
    countdow = `${day}天${hour}:${minute}:${second}`
  } else {
    countdow = `${hour}:${minute}:${second}秒`
  }
  return countdow
}
// 数组交换元素
export function exchangeArray(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0]
  return arr
}
// 奇淫巧技,深拷贝对象，弊端 对象的函数属性会被过滤掉
export function objCopy(a) {
  try {
    return JSON.parse(JSON.stringify(a))
  } catch (e) {
    return null
  }
}

// 节流
export function throttle(fn, gapTime = 1000) {
  let _lastTime = null
  return function() {
    const _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)
      _lastTime = _nowTime
    }
  }
}

// url param encode
export function encodeUrlParam(params) {
  if (!params) return ''
  return (`${params}&`).replace(/\=(.*?)&/g, v => `=${encodeURIComponent(v.substr(1, v.length - 2))}&`)
}

// 设备 rpx换算px
export function computedPxWidth(num, windowWidth = getSystemInfoLocal('windowWidth')) {
  return parseInt(windowWidth / 750 * num)
}

// 对象数组去重(维持原有顺序)
export function objArrayUnique(list = [], key = 'id') {
  const pool = {}
  return list.reduce((accumulator, v) => {
    if (!pool[v[key]]) {
      pool[v[key]] = v
      accumulator.push(v)
    }
    return accumulator
  }, [])
}

export function rpxToPx(windowWidth, x) {
  return windowWidth / 750 * x
}

export function findLastIndex(array, predicate, context) {
  var length = array.length
  for (var i = length - 1; i >= 0; i--) {
    if (predicate.call(context, array[i], i, array)) return i
  }
  return -1
}

// 腾讯地图经纬度转百度地图
export function wechatMapToaiduMap(x, y) {
  const x_pi = 3.14159265358979324 * 3000.0 / 180.0
  const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi)
  const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi)
  const longitude = z * Math.cos(theta) + 0.0065
  const latitude = z * Math.sin(theta) + 0.006
  return {
    longitude,
    latitude,
  }
}

export function verifyType(o, type) {
  return Object.prototype.toString.call(o) === `[object ${type}]`
}

export function isPromise(func) {
  return func && Object.prototype.toString.call(func) === '[object Promise]'
}
