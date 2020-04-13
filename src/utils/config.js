const base = {
  apiBase: '/',
  name: '', // header 信息
  miniName: '', // webview携带参数
}

const CONFIG = {
  ...base,
  dev: { // 本地开发
    baseUrl: '',
    webUrl: '',
    traceUrl: '',
  },
}

export default CONFIG
