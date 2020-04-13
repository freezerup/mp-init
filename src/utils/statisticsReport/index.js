import { EVENT_NAMES } from './config'

/**
 * 页面访问/访问时长：通过页面劫持onShow和onHide,所以需要上报的页面需添加这俩事件
 */

class MP_STATISTICS_REPORT {
  constructor(options) {
    // 配置
    this.config = {
      url: '',
    }
    // 统计基础信息
    this.commonParams = {
      user_id: '',
    }
    Object.assign(this.config, options)
  }
  setCommonParams(options) {
    Object.assign(this.commonParams, options)
  }
  report(event) {
    if (!event || event === 'undefined') return false
    const now = new Date().getTime()
    const params = {
      ...EVENT_NAMES[event.event_name],
      request_time: now,
      trigger_time: event.trigger_time || now,
    }
    if (event.event_params) {
      params.event_params = JSON.stringify(event.event_params)
    }
    this.reportAjax(params)
  }
  reportAjax(params) {
    const { basicToken = '' } = global.wzjGlobalData.get('loginInfo') || {}
    wx.request({
      url: this.config.url,
      method: 'POST',
      data: {
        ...this.commonParams,
        ...params,
      },
      success: function(res) {
        console.log('上报成功')
      },
    })
  }
}
export default MP_STATISTICS_REPORT
