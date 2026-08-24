// index.js
Page({
  data: {
    charName: 'Hello World',
    isSwitched: false
  },

  onToggle() {
    this.setData({
      isSwitched: !this.data.isSwitched,
      charName: this.data.isSwitched ? 'Hello World' : '你好 世界！'
    })
  }
})
