/*
* slot说明：
* support/notSupport： 支持与不支持自定义导航栏, 插槽的展示内容不同
* common: 支持与不支持自定义导航栏, 插槽的展示内容相同
* other: 其他，可以把tab列表放在此处
* nav的高度已使用view占位撑起；other的高度需要在各页面处理
*/
import { getMenuButtonBoundingClientRectLocal, isSupportNavigation, getSystemInfoLocal, isIphoneX } from '../../../utils/common'
import { navigateBack, switchTab } from '../../../utils/wxTool'
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true,
  },
  properties: {
    leftIcon: {
      type: String,
      value: 'icon-arrow-left',
    },
    background: {
      type: String,
      value: '#fff',
    },
    back: {
      type: Boolean,
      value: false,
    },
    interceptBack: {
      type: Boolean,
      value: false,
    },
    title: String,
  },
  lifetimes: {
    attached() {
      this.initData()
    },
  },
  attached: function() {
    this.initData()
  },

  /**
   * 组件的初始数据
   */
  data: {
    capsulePaddingBottom: 6, // 胶囊的上下padding距离
    isSupportNavigation: isSupportNavigation(),
    statusBarHeight: isIphoneX() ? 44 : 20,
    capsuleHeight: 32,
    capsuleWidth: 87,
    navHeight: 82,
  },
  methods: {
    initData() {
      // 最低微信版本7.0.0支持自定义标题栏
      const isSupport = isSupportNavigation()
      if (isSupport) {
        const { statusBarHeight = 0, windowWidth } = getSystemInfoLocal()
        // 特殊场景获取不到statusBarHeight的值
        const statusBarMinHeight = isIphoneX() ? 44 : 20
        const { width = 87, height = 32, right = 365, bottom = 82, paddingBottom = 6 } = getMenuButtonBoundingClientRectLocal()
        const navHeight = bottom + paddingBottom
        this.setData({
          statusBarHeight: statusBarHeight || statusBarMinHeight,
          capsuleHeight: height,
          capsuleWidth: width > 100 ? 100 : width, // 临时解决部分机型微信getMenuButtonBoundingClientRect获取数据错误问题
          capsulePaddingRight: windowWidth - right,
          navHeight,
        })
        this.triggerEvent('navHeight', navHeight)
      }
    },
    handleBack() {
      if (this.properties.interceptBack) {
        this.triggerEvent('interceptBack', true)
        return
      }
      navigateBack()
    },
    handleHome() {
      switchTab('/pages/main/home_page/main')
    },
  },
})
