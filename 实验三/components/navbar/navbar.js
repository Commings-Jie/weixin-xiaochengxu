Component({
  properties: {
    title: {
      type: String,
      value: '海大新闻网'
    },
    showBack: {
      type: Boolean,
      value: false
    },
    showHome: {
      type: Boolean,
      value: false
    }
  },
  data: {
    statusBarHeight: 0,
    navBarHeight: 44
  },
  lifetimes: {
    attached() {
      const systemInfo = wx.getSystemInfoSync()
      this.setData({
        statusBarHeight: systemInfo.statusBarHeight
      })
    }
  },
  methods: {
    goBack() {
      wx.navigateBack({
        delta: 1
      })
    },
    goHome() {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  }
})
