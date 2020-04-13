import { verifyType, isPromise } from './tool'
import { getCurrentPage } from './common'

class MP_HIJACk {
  constructor() {
    this.rewriteApp()
    this.rewritePage()
  }
  // 劫持原小程序App方法
  rewriteApp() {
    const originApp = App
    App = (app) => {
      // 合并方法，插入记录脚本
      ['onLaunch', 'onShow', 'onHide', 'onError'].forEach((methodName) => {
        const userDefinedMethod = app[methodName]
        if (verifyType(userDefinedMethod, 'Object')) {
          return userDefinedMethod
        }
        app[methodName] = function(...args) {
          methodName === 'onError' && global.BJ_REPORT.error({ msg: args }) // 错误上报
          const m = userDefinedMethod && userDefinedMethod.apply(this, args)
          if (isPromise(m)) {
            m.catch(err => {
              let mes = ''
              Object.getOwnPropertyNames(err).forEach((key) => {
                if (key === 'stack') {
                  mes = err[key]
                }
              })
              global.BJ_REPORT.handleMsg(mes)
            })
          }
          return m
        }
      })
      return originApp(app)
    }
  }
  // 劫持原小程序Page方法
  rewritePage() {
    const self = this
    const originPage = Page
    Page = (page) => {
      Object.keys(page).forEach((methodName) => {
        const userDefinedMethod = page[methodName]
        if (verifyType(userDefinedMethod, 'Object')) {
          return userDefinedMethod
        }
        page[methodName] = function(...args) {
          const m = userDefinedMethod && userDefinedMethod.apply(this, args)
          if (isPromise(m)) {
            m.catch(err => {
              let mes = ''
              Object.getOwnPropertyNames(err).forEach((key) => {
                if (key === 'stack') {
                  mes = err[key]
                }
              })
              global.BJ_REPORT.handleMsg(mes)
            })
          }
          if (getCurrentPage()) {
            const { route, options } = getCurrentPage()
            if (methodName === 'onShow' || methodName === 'onHide') {
              if (methodName === 'onShow') {
                // 劫持onShow，监听页面级别事件，消费掉该页面的通知
                global.eventBus.$emit.call(this, route)()
                console.log('上报页面访问事件')
              } else {
                console.log('上报页面访问时长事件')
              }
            }
          }
          return m
        }
      })
      // 执行原Page对象
      return originPage(page)
    }
  }
}
export default MP_HIJACk
