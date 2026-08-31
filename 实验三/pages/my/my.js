Page({
  data: {
    isLogin: false,
    src: '',
    nickName: '',
    loginType: '',
    number: 0,
    newsList: [],
    // 微信登录信息填写
    showWxProfile: false,
    tempAvatar: '',
    tempNickName: ''
  },

  // ==================== 微信账号登录 ====================

  /**
   * 点击微信登录 → 进入信息填写页
   */
  goWxLogin() {
    this.setData({
      showWxProfile: true,
      tempAvatar: '',
      tempNickName: ''
    })
  },

  /**
   * 用户选择头像回调（open-type="chooseAvatar"）
   */
  onChooseAvatar(e) {
    this.setData({
      tempAvatar: e.detail.avatarUrl
    })
  },

  /**
   * 用户输入昵称回调（type="nickname"）
   */
  onNicknameInput(e) {
    this.setData({
      tempNickName: e.detail.value
    })
  },

  /**
   * 取消填写
   */
  cancelWxProfile() {
    this.setData({
      showWxProfile: false
    })
  },

  /**
   * 确认登录
   */
  confirmWxProfile() {
    let avatar = this.data.tempAvatar
    let nickname = this.data.tempNickName

    if (!avatar) {
      wx.showToast({ title: '请选择头像', icon: 'none' })
      return
    }
    if (!nickname) {
      wx.showToast({ title: '请输入昵称', icon: 'none' })
      return
    }

    this.setData({
      isLogin: true,
      src: avatar,
      nickName: nickname,
      loginType: '微信',
      showWxProfile: false
    })

    // 更新全局登录状态
    const app = getApp()
    app.globalData.isLogin = true

    wx.showToast({ title: '登录成功', icon: 'success' })
    this.getMyFavorites()
  },

  // ==================== 退出登录 ====================

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      confirmColor: '#1a5f9e',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            isLogin: false,
            src: '',
            nickName: '',
            loginType: '',
            number: 0,
            newsList: []
          })
          // 更新全局登录状态
          const app = getApp()
          app.globalData.isLogin = false
          wx.showToast({ title: '已退出登录', icon: 'success' })
        }
      }
    })
  },

  // ==================== 收藏功能 ====================

  getMyFavorites: function () {
    let info = wx.getStorageInfoSync()
    let keys = info.keys

    let myList = []
    for (var i = 0; i < keys.length; i++) {
      let obj = wx.getStorageSync(keys[i])
      if (obj && obj.id && obj.title) {
        myList.push(obj)
      }
    }

    this.setData({
      newsList: myList,
      number: myList.length
    })
  },

  goToDetail: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detail/detail?id=' + id,
    })
  },

  onShow: function () {
    if (this.data.isLogin) {
      this.getMyFavorites()
    }
  }
})
