var common = require('../../utils/common.js')

Page({
  data: {
    article: {},
    isAdd: false,
    paragraphs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id

    // 检查当前新闻是否在收藏夹中
    var newarticle = wx.getStorageSync(id)

    // 已存在收藏夹中
    if (newarticle != '') {
      this.setData({
        isAdd: true,
        article: newarticle,
        paragraphs: this.splitContent(newarticle.content)
      })
    }
    // 不存在，从模拟数据获取
    else {
      let result = common.getNewsDetail(id)
      // 获取新闻内容
      if (result.code == '200') {
        this.setData({
          article: result.news,
          isAdd: false,
          paragraphs: this.splitContent(result.news.content)
        })
      }
    }

    // 未登录时统一显示为未收藏
    const app = getApp()
    if (!app.globalData.isLogin) {
      this.setData({ isAdd: false })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 每次显示时检查登录状态，未登录统一显示未收藏
    const app = getApp()
    if (!app.globalData.isLogin) {
      this.setData({ isAdd: false })
    }
  },

  /**
   * 将正文内容按段落分割
   */
  splitContent: function(content) {
    if (!content) return []
    
    // 按 \n\n 分割段落
    let paragraphs = content.split('\n\n')
    
    // 过滤空段落并去除首尾空白
    return paragraphs.filter(p => p.trim()).map(p => p.trim())
  },

  /**
   * 添加收藏
   */
  addFavorites: function () {
    // 检查是否登录
    const app = getApp()
    if (!app.globalData.isLogin) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再收藏',
        confirmText: '去登录',
        confirmColor: '#1a5f9e',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({
              url: '../my/my'
            })
          }
        }
      })
      return
    }

    let article = this.data.article
    wx.setStorageSync(article.id, article)
    this.setData({
      isAdd: true
    })
    wx.showToast({ title: '收藏成功', icon: 'success' })
  },

  /**
   * 取消收藏
   */
  cancelFavorites: function () {
    let article = this.data.article
    wx.removeStorageSync(article.id)
    this.setData({
      isAdd: false
    })
  }
})
