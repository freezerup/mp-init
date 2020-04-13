import config from './config'
import { getVisitor } from './tool'
import { currentEnv } from './common'
import { showToast } from './wxTool'

const METHOD = 'GET'
const DATA_TYPE = 'json'
const RESPONSE_TYPE = 'text'
const HEADER = {
  'content-type': 'application/x-www-form-urlencoded',
}

// 是否提示异常信息
function errorHandle(obj) {
  if (obj && !obj.error) {
    setTimeout(() => {
      showToast(obj.error_message || '服务器繁忙，请稍后重试')
    }, 300)
  }
}

export default async function ajax(obj) {
  const env = currentEnv()
  return new Promise(function(resolve) {
    wx.request({
      url: `${config[env].baseUrl}${config.apiBase}${obj.url}`,
      header: Object.assign(obj.header || HEADER, {
        'X-BDBS-Device-ID': getVisitor(),
        'MP-NAME': config.name,
      }),
      method: obj.method || METHOD,
      data: obj.data || '',
      dataType: obj.dataType || DATA_TYPE,
      responseType: obj.responseType || RESPONSE_TYPE,
      success: async function(response) {
        const { data } = response
        if (response.statusCode >= 200 && response.statusCode < 300 && data.status === 'SUCCESS') {
          resolve(data)
        } else {
          if (data.status === 'TOKEN_ERROR') {
            // 清除本地/内存的登录信息
            // 当前接口不是登录接口，静默登录
          } else {
            errorHandle(Object.assign(obj, {
              error_message: data.error_message,
            }))
            resolve({
              error: data,
              errType: 'error',
            })
          }
        }
      },
      fail: function(error) {
        resolve({
          error: error,
          errType: 'fail',
        })
        errorHandle(Object.assign(obj, {
          error_message: '请求异常',
        }))
      },
      complete: function() {

      },
    })
  })
}
