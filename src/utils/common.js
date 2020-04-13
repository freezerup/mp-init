import { getSystemInfoSync } from './wxTool'

// 胶囊信息
export function getMenuButtonBoundingClientRectLocal(opt) {
  const defaultMenuButton = { width: 87, height: 32, right: 365, bottom: 82, paddingBottom: 6 }
  let menuButtonBoundingClientRect = global.wzjGlobalData.get('menuButtonBounding')
  if (!menuButtonBoundingClientRect && wx.getMenuButtonBoundingClientRect) {
    menuButtonBoundingClientRect = wx.getMenuButtonBoundingClientRect() || {}
    if (menuButtonBoundingClientRect.width && menuButtonBoundingClientRect.height) {
      global.wzjGlobalData.set('menuButtonBounding', Object.assign(menuButtonBoundingClientRect, { paddingBottom: 6 }))
    } else {
      menuButtonBoundingClientRect = null
    }
  }
  if (opt) {
    return menuButtonBoundingClientRect ? menuButtonBoundingClientRect[opt] : defaultMenuButton[opt]
  }
  return menuButtonBoundingClientRect || defaultMenuButton
}

export function currentEnv() {
  const { env = 'prod' } = global.wzjGlobalData.get('extConfig') || {}
  return env
}

// 设备信息
export function getSystemInfoLocal(opt) {
  const defaultSystemInfo = { windowWidth: 375, screenHeight: 667, screenWidth: 375, statusBarHeight: 20 }
  let systemInfo = global.wzjGlobalData.get('systemInfo')
  if (!systemInfo) {
    systemInfo = getSystemInfoSync()
    if (systemInfo) {
      const { model, system, version, SDKVersion } = systemInfo
      global.wzjGlobalData.set('systemInfo', systemInfo)
      global.BJ_REPORT.setErrorLogParams({
        sourceTarget: JSON.stringify({ model, system, version, SDKVersion }),
      })
    }
  }
  if (opt) {
    return systemInfo ? systemInfo[opt] : defaultSystemInfo[opt]
  }
  return systemInfo || defaultSystemInfo
}

// 最低微信版本7.0.0支持自定义标题栏
export function isSupportNavigation() {
  return checkWXVersion('7.0.0', '>=')
}

// 由于低版本视频一直加载中，隐藏视频播放,最低基础库2.5.2
export function isSupportVideo() {
  return checkSDKVersion('2.5.1', '>')
}

export function checkSDKVersion(v, operator = '=') {
  const { SDKVersion: version = '' } = getSystemInfoLocal()
  // eslint-disable-next-line no-return-assign
  return checkVersion(v, operator, version)
}

export function checkWXVersion(v, operator = '=') {
  const { version = '' } = getSystemInfoLocal()
  // eslint-disable-next-line no-return-assign
  return checkVersion(v, operator, version)
}

export function checkVersion(tv = '', operator = '=', lv = '') {
  const targetVersion = ~~tv.replace(/\./g, '')
  const localVersion = ~~lv.replace(/\./g, '')
  switch (operator) {
    case '>':
      return localVersion > targetVersion
    case '>=':
      return localVersion >= targetVersion
    case '=':
      return localVersion === targetVersion
    case '<=':
      return localVersion <= targetVersion
    case '<':
      return localVersion < targetVersion
    default:
      return localVersion - targetVersion
  }
}

// iphone x
export function isIphoneX() {
  const model = getSystemInfoLocal('model')
  return model.search('iPhone X') !== -1
}

// 当前页面route
export function getCurrentPage(type = 'current') {
  let page
  if (type === 'current') {
    page = getCurrentPages().pop()
  } else if (type === 'pre') {
    page = getCurrentPages().slice(-2, -1)[0]
  }
  if (!page) return
  const { route, options = {}} = page
  const params = Object.keys(options).map(key => `${key}=${options[key]}`).join('&')
  return {
    route,
    params,
    options,
  }
}
