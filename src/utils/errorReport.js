import { verifyType } from './tool'
import { getCurrentPage } from './common'

class MP_BJ_REPORT {
  constructor(options) {
    // 配置
    this.config = {
      id: 1,
      url: '', // 上报地址
      name: '', // 小程序标示
      combo: 0, // combo是否合并上报，0关闭，1启动（默认）
      group: '', // 钉钉报错群组
      except: [
        /^webviewScriptError\nExpected updated data but get first rendering/,
        /^webviewScriptError\nExpect END descriptor with depth 0 but get another/,
        /^webviewScriptError\nFramework inner error/,
        /^appServiceSDKScriptError\nundefined is not an object/,
        /^thirdScriptError\ngetMenuButtonBoundingClientRect:fail/,
      ], // 忽略某个错误
      repeat: 1, // 重复上报次数(对于同一个错误超过多少次不上报)
    }
    this.init(options)
  }
  init(options) {
    this.config = Object.assign(this.config, options)
    // 错误队列
    this.errorQueue = []
    // 记录重复异常数据
    this.repeatList = {}

    // js错误上报日志内容
    this.errorLogParams = {}
  }
  setErrorLogParams(options) {
    console.log('动态设置上报参数')
  }
  // 手动报错
  error(msg) {
    this.handleMsg(msg)
  }

  // 重复出现的错误，只上报config.repeat次
  isRepeat(error) {
    const repeatName = error.msg
    this.repeatList[repeatName] = this.repeatList[repeatName]
      ? this.repeatList[repeatName] + 1
      : 1
    return this.repeatList[repeatName] > this.config.repeat
  }
  // 忽略错误
  isExcept(error) {
    const oExcept = this.config.except
    let result = false
    if (verifyType(oExcept, 'Array')) {
      result = oExcept.find(e => (verifyType(e, 'RegExp') && e.test(error.msg)))
    }
    // 忽略爬虫scene = 1129
    if (this.errorLogParams.ext.scene === 1129) {
      result = true
    }

    return !!result
  }

  // push错误到pool
  catchError(error) {
    if (this.isRepeat(error)) {
      return false
    }
    if (this.isExcept(error)) {
      return false
    }
    this.errorQueue.push(error)
    return this.errorQueue
  }

  // 手动上报
  handleMsg(msg) {
    if (!msg) {
      return false
    }
    const errorMsg = verifyType(msg, 'Object') ? msg : { msg }
    if (this.catchError(errorMsg)) {
      this.report()
    }
    return errorMsg
  }

  // 上报
  report() {
    const { mergeReport, url, id } = this.config
    if (!id) return
    if (this.errorQueue.length === 0) return

    const curQueue = mergeReport ? this.errorQueue : [this.errorQueue.shift()]
    if (mergeReport) this.errorQueue = []

    const curQueueString = JSON.stringify(curQueue)
    const { route, params: param } = getCurrentPage() || {}
    const params = Object.assign({}, this.errorLogParams, {
      msg: curQueueString,
      from: `${route}?${param}`,
    })
    wx.request({
      url,
      method: 'GET',
      data: params,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function(res) {

      },
    })
  }
  now() {
    return new Date().getTime()
  }
}
export default MP_BJ_REPORT
