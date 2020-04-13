import { getSystemInfoLocal } from '../../../utils/common'

Component({
  properties: {
    tabs: Array,
    currentIndex: {
      type: Number,
      value: 0,
      observer(val) {
        this.setData({
          scrollId: val - 2 > 0 ? val - 2 : 0,
        })
      },
    },
    canScroll: {
      type: Boolean,
      observer(val) {
        this.setData({
          scroll: val,
        })
      },
    },
    tabItemClass: {
      type: String,
      value: '',
    },
    tabBox: {
      type: String,
      value: '',
    },
    tabFontColor: {
      type: Boolean,
      value: false,
    },
    tabActivateFontColor: {
      type: String,
      value: '#FFFFFF',
    },
    tabInactivateFontColor: {
      type: String,
      value: '#FFFFFF',
    },
  },

  ready() {
    const { tabs, canScroll } = this.properties
    if (tabs.length < 4 || canScroll) return
    let parentWidth = getSystemInfoLocal('windowWidth')// 父容器宽度
    let childrenWidth = 0 // 子元素宽度和
    const query = this.createSelectorQuery()
    const promises = []
    promises.push(this.getItemWidth(query, '.tab-content'))
    tabs.forEach((item, index) => {
      promises.push(this.getItemWidth(query, `#index${index}`))
    })
    Promise.all(promises).then(res => {
      const parentData = res.splice(0, 1)
      parentWidth = parentData[0].width
      childrenWidth = res.reduce((total, item) => {
        return total + item.width
      }, 0)
      this.setData({
        scroll: childrenWidth - parentWidth > 0,
      })
    })
  },

  data: {
    scroll: false,
    animation: false, // 初始化禁止使用动画，优化交互体验
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleChangeTab(event) {
      const { index, item } = event.currentTarget.dataset
      if (!this.data.animation) {
        this.setData({ animation: true })
      }
      this.triggerEvent('changeTab', { item, index })
    },
    getItemWidth(query, element) {
      return new Promise(reslove => {
        query.select(`${element}`).boundingClientRect(res => {
          reslove(res || { width: 0 })
        }).exec()
      })
    },
  },
})
