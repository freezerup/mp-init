import config from './utils/config'
import { getMenuButtonBoundingClientRectLocal, getSystemInfoLocal } from './utils/common'
import eventBus from './utils/event.js'
global.eventBus = eventBus
import updateWzjGlobalData from './utils/global'

// 初始化global
global.wzjGlobalData = updateWzjGlobalData

// 错误上报
import MP_BJ_REPORT from './utils/errorReport.js'
global.BJ_REPORT = new MP_BJ_REPORT({
  id: 1, // 1 上报 0 不上报
  url: '',
  group: '', // 对应钉钉告警群
  name: config.name,
})
// 统计上报
import MP_STATISTICS_REPORT from './utils/statisticsReport/index.js'
global.STATISTICS_REPORT = new MP_STATISTICS_REPORT({
  url: '',
})
// 页面劫持
import MP_HIJACk from './utils/hijack.js'
new MP_HIJACk()

import { switchTab, getUpdateManager } from './utils/wxTool'

App({
  onLaunch: function(options) {
    // 设备系统信息
    getSystemInfoLocal()
    getMenuButtonBoundingClientRectLocal()
  },
  onShow: async function(options) {
    // 如果是通过识别小程序二维码进入的，把options.scene 的参数转译为可读的（由于scene,最大32个可见字符，所以使用简写
    const { scene } = options.query
    if (scene && typeof scene === 'string') {
      options.query = mapScene(scene)
    }

    // 参数信息
    global.wzjGlobalData.set('initMiniProgramQuery', options)

    // 是否强制升级
    getUpdateManager()
  },
  globalData: {

  },
  onPageNotFound(res) {
    switchTab('/pages/main/home_page/main')
  },
})
