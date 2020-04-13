import { dateFormat } from '../../../utils/tool'

Component({
  properties: {
    type: {
      type: String,
      value: 'date', // time时 设置format
    },
    format: {
      type: String,
      value: 'YYYY-MM-DD hh:mm:ss',
    },
    isMs: {
      type: Boolean,
      value: false, // 是否毫秒
    },
    value: {
      type: String,
      observer(val) {
        const { type, format, isMs } = this.properties
        let time = ''
        if (typeof val === 'string') {
          const newType = type === 'time' ? format : ''
          time = dateFormat(val, newType, isMs)
        }
        this.setData({
          time,
        })
      },
    },
  },
  data: {
    time: '',
  },
})

