class EventBus {
  constructor() {
    this.events = {}
    this.verifyType = function(o, type) {
      return Object.prototype.toString.call(o) === `[object ${type}]`
    }
  }

  $on(eventName = '', cb) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(cb)
  }

  $emit(eventName = '') {
    const _self = this
    return function() {
      if (!event.verifyType(eventName, 'String')) {
        return false
      }
      if (!event.events[eventName]) {
        return false
      }
      // 目前不支持触发孙子组件事件
      const len = event.events[eventName].length
      for (let i = len - 1; i >= 0; i--) {
        const { comp, func, needLogin } = event.events[eventName][i]
        // 如果该事件需要登录，则判断是否登录
        if (needLogin && !global.wzjGlobalData.get('loginInfo')) return
        // 子组件
        if (comp) {
          const childComp = _self.selectComponent(`#${comp}`)
          if (childComp && childComp[func]) {
            childComp[func]()
          }
        } else if (!comp && func) { // 父组件
          _self[func]()
        }
        event.events[eventName].splice(i, 1)
      }
    }
  }

  $off(eventName = '') {
    if (!this.verifyType(eventName, 'String')) {
      return false
    }
    if (this.events[eventName]) {
      delete this.events[eventName]
    }
  }
}

const event = new EventBus()

export default event

