export function wxLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        return resolve(res)
      },
      fail(res) {
        return reject(res)
      },
    })
  })
}

export function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success(res) {
        return resolve(res)
      },
      fail(res) {
        return reject(res)
      },
    })
  })
}

export function checkSession() {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success(res) {
        return resolve(res)
      },
      fail(res) {
        return reject(res)
      },
    })
  })
}

export function showToast(title, icon = 'none', duration = 2000) {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title,
      icon,
      duration,
      success(res) {
        return resolve(res)
      },
      fail(res) {
        return reject(res)
      },
    })
  })
}

export function showLoading(title, mask = true) {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title,
      mask,
      success(res) {
        return resolve(res)
      },
      fail(res) {
        return reject(res)
      },
    })
  })
}

export function hideLoading(title, mask = true) {
  return new Promise((resolve, reject) => {
    wx.hideLoading({
      success(res) {
        return resolve(res)
      },
      fail(res) {
        return reject(res)
      },
    })
  })
}

// 显示操作菜单

export function showActionSheet(itemList, itemColor = '#000000') {
  return new Promise((resolve, reject) => {
    wx.showActionSheet({
      itemList,
      itemColor,
      success(res) {
        return resolve(res.tapIndex)
      },
      fail(res) {
        return resolve(res.errMsg)
      },
    })
  })
}

export function showModal(title = '温馨提示', content, params) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title,
      content,
      confirmColor: '#B28B56',
      ...params,
      success(res) {
        return resolve(res)
      },
      fail(res) {
        return reject(res)
      },
    })
  })
}

export function previewImage(current, urls) {
  current = `${current}?x-oss-process=style/km1200`
  const images = urls.map(url => `${url}?x-oss-process=style/km1200`)
  return new Promise((resolve, reject) => {
    wx.previewImage({
      current,
      urls: images,
      success(res) {
        return resolve(res)
      },
      fail(res) {
        return reject(res)
      },
    })
  })
}

export function navigateBack(delta = 1) {
  return new Promise((resolve, reject) => {
    wx.navigateBack({
      delta,
      success(res) {
        resolve(true)
      },
      fail(res) {
        resolve(false)
        switchTab('/pages/main/home_page/main')
      },
    })
  })
}

export function navigateTo(url) {
  /* global getCurrentPages */
  /* eslint no-undef: "error" */
  const pagesLength = getCurrentPages()
  // 当前页面栈 大于8层时，下次跳转使用redirectTo
  return new Promise((resolve, reject) => {
    if (pagesLength && pagesLength.length > 8) {
      redirectTo(url)
    } else {
      wx.navigateTo({
        url,
        success(res) {
          return resolve(res)
        },
        fail(res) {
          switchTab(url)
        },
      })
    }
  })
}

export function redirectTo(url) {
  return new Promise((resolve, reject) => {
    wx.redirectTo({
      url,
      success(res) {
        return resolve(res)
      },
      fail(res) {
        return switchTab(url)
      },
    })
  })
}
// 跳转tab
export function switchTab(url) {
  return new Promise((resolve, reject) => {
    wx.switchTab({
      url,
      success(res) {
        return resolve(res)
      },
      fail(res) {
        return reject(res)
      },
    })
  })
}

export function reLaunch(url) {
  return new Promise((resolve, reject) => {
    wx.reLaunch({
      url,
      success(res) {
        return resolve(res)
      },
      fail(res) {
        return reject(res)
      },
    })
  })
}

export function getStorage(key) {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key,
      success(res) {
        return resolve(res)
      },
      fail(res) {
        return reject(res)
      },
    })
  })
}

export function setStorage(key, data) {
  return new Promise((resolve, reject) => {
    wx.setStorage({
      key,
      data,
      success(res) {
        return resolve(res)
      },
      fail(res) {
        return reject(res)
      },
    })
  })
}

export function setNavigationBarTitle(title) {
  return new Promise((resolve, reject) => {
    wx.setNavigationBarTitle({
      title,
      success(res) {
        return resolve(res)
      },
      fail(res) {
        return reject(res)
      },
    })
  })
}

export function createSelectorQuery() {
  return wx.createSelectorQuery()
}

export function getStorageSync(key) {
  return wx.getStorageSync(key)
}
export function setStorageSync(key, data) {
  return wx.setStorageSync(key, data)
}
export function removeStorage(key) {
  return new Promise((resolve, reject) => {
    wx.removeStorage({
      key,
      success(res) {
        return resolve(res)
      },
      fail(res) {
        return reject(res)
      },
    })
  })
}
export function removeStorageSync(key) {
  return wx.removeStorageSync(key)
}

export function pageScrollTo(scrollTop = 0, duration = 300) {
  return new Promise((resolve, reject) => {
    wx.pageScrollTo({
      scrollTop,
      duration,
      success(res) {
        return resolve(res)
      },
      fail(res) {
        return reject(res)
      },
    })
  })
}

// 获取设备信息
export function getSystemInfo() {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success(res) {
        return resolve(res)
      },
      fail(res) {
        return reject(res)
      },
    })
  })
}
// 获取设备信息
export function getSystemInfoSync() {
  return wx.getSystemInfoSync()
}

// 微信支付
export function wxpayment(obj) {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      ...obj,
      success: function(res) {
        return resolve(res)
      },
      fail: function(res) {
        return resolve(res)
      },
    })
  })
}

export function getLocation(obj) {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      ...obj,
      success: function(res) {
        return resolve(res)
      },
      fail: function(res) {
        return resolve(res)
      },
    })
  })
}
// 导航栏展示加载动画
export function showNavigationBarLoading() {
  return new Promise((resolve, reject) => {
    wx.showNavigationBarLoading({
      success: function(res) {
        return resolve(res)
      },
      fail: function(res) {
        return reject(res)
      },
    })
  })
}
// 导航栏隐藏加载动画
export function hideNavigationBarLoading() {
  return new Promise((resolve, reject) => {
    wx.hideNavigationBarLoading({
      success: function(res) {
        return resolve(res)
      },
      fail: function(res) {
        return reject(res)
      },
    })
  })
}
// 打开设置
export function openSetting() {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: function(res) {
        return resolve(res)
      },
      fail: function(res) {
        return reject(res)
      },
    })
  })
}
// 获取用户当前设置
export function getSetting() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: function(res) {
        return resolve(res)
      },
      fail: function(res) {
        return reject(res)
      },
    })
  })
}
// 小程序跳转
export function navigateToMiniProgram(opts) {
  return new Promise((resolve, reject) => {
    wx.navigateToMiniProgram({
      appId: opts.appId,
      path: opts.path,
      extraData: opts.extraData,
      envVersion: opts.envVersion || 'trial', // develop 开发版; trial 体验版; release 正式版
      success: function(res) {
        return resolve(res)
      },
      fail: function(res) {
        return reject(res)
      },
    })
  })
}

// 小程序跳转=>返回
export function navigateBackMiniProgram(extraData) {
  return new Promise((resolve, reject) => {
    wx.navigateBackMiniProgram({
      extraData,
      success: function(res) {
        return resolve(res)
      },
      fail: function(res) {
        return reject(res)
      },
    })
  })
}

// 选取图片
export function chooseImage(count = 1, params) {
  return new Promise((resolve) => {
    wx.chooseImage({
      count,
      ...params,
      success(res) {
        return resolve(res)
      },
      fail(res) {
        return resolve(res)
      },
    })
  })
}

// 获取图片信息
export function getImageInfo(src) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src,
      success(res) {
        return resolve(res)
      },
      fail(res) {
        return resolve(res)
      },
    })
  })
}

export function uploadFile(url, header, filePath, name, formData) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url,
      header,
      filePath,
      name,
      formData,
      success(res) {
        return resolve(res)
      },
      fail(res) {
        return reject(res)
      },
    })
  })
}

export function downloadFile(url, header) {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url,
      header,
      success(res) {
        if (res.statusCode === 200) {
          return resolve(res)
        }
        return resolve(false)
      },
      fail(res) {
        return resolve(false)
      },
    })
  })
}

export function createCanvasContext(canvasId) {
  return wx.createCanvasContext(canvasId)
}

export function canvasToTempFilePath(x, y, width, height, destWidth, destHeight, canvasId, fileType = 'jpg', quality = 1) {
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath({
      x,
      y,
      width,
      height,
      destWidth,
      destHeight,
      canvasId,
      fileType,
      quality,
      success(res) {
        return resolve(res)
      },
      fail(res) {
        return reject(res)
      },
    })
  })
}

// 保存图片
export function saveImageToPhotosAlbum(filePath) {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      filePath,
      success(res) {
        showToast('图片保存成功')
        return resolve(res)
      },
      fail(res) {
        showToast('图片保存失败')
        return resolve(res)
      },
    })
  })
}

// 地图导航
export function openLocation(params) {
  return new Promise((resolve, reject) => {
    wx.openLocation({
      latitude: Number(params.latitude),
      longitude: Number(params.longitude),
      name: params.name,
      scale: params.scale || 14,
      success(res) {
        return resolve(res)
      },
      fail(res) {
        return reject(res)
      },
    })
  })
}
export function getNetworkType() {
  return new Promise((resolve, reject) => {
    wx.getNetworkType({
      success(res) {
        return resolve(res)
      },
      fail(res) {
        return reject(res)
      },
    })
  })
}
// 强制升级
export function getUpdateManager() {
  if (wx.getUpdateManager) {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(res => {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(() => {
          updateManager.applyUpdate()
        })
      }
    })
  }
}

export default {
  wxLogin,
  getUserInfo,
  checkSession,
  showToast,
  showModal,
  showLoading,
  hideLoading,
  previewImage,
  navigateBack,
  navigateTo,
  redirectTo,
  switchTab,
  reLaunch,
  getStorage,
  setStorage,
  setNavigationBarTitle,
  createSelectorQuery,
  getStorageSync,
  setStorageSync,
  removeStorage,
  removeStorageSync,
  pageScrollTo,
  getSystemInfo,
  wxpayment,
  getLocation,
  showNavigationBarLoading,
  hideNavigationBarLoading,
  openSetting,
  navigateToMiniProgram,
  navigateBackMiniProgram,
  chooseImage,
  getImageInfo,
  uploadFile,
  createCanvasContext,
  canvasToTempFilePath,
  openLocation,
  getNetworkType,
  getUpdateManager,
}
