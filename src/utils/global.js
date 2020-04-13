import { objCopy } from './tool'
const initGlobalData = {
  systemInfo: null,
  initMiniProgramQuery: null, // 参数信息
}

let wzjGlobalData = objCopy(initGlobalData)

const updateWzjGlobalData = {
  set: (key, value) => {
    if (!key || value === undefined) {
      console.log('缺少key或value值')
      return
    }
    wzjGlobalData[key] = value
  },
  get: (key) => {
    if (!key) {
      // eslint-disable-next-line no-unused-vars
      const { loginInfo, ...publicData } = objCopy(wzjGlobalData)
      return publicData
    }
    return wzjGlobalData[key]
  },
  remove: (key) => {
    if (!key) {
      console.log('缺少key值')
      return
    }
    wzjGlobalData[key] = initGlobalData[key]
  },
  clear: () => {
    wzjGlobalData = objCopy(initGlobalData)
  },
}

export default updateWzjGlobalData
