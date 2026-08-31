var common = require('../../utils/common.js')

Page({
  data: {
    swiperList: [],
    categories: [],
    currentCategory: '全部',
    newsList: [],
    allNewsList: [], // 保存所有新闻用于搜索
    searchKeyword: '',
    isSearching: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取分类列表
    let categories = common.getCategories()
    // 获取全部新闻（按时间排序）
    let newsList = common.getNewsList()

    this.setData({
      categories: categories,
      newsList: newsList,
      allNewsList: newsList
    })
    
    // 随机获取轮播图
    this.refreshSwiper()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 页面显示时的逻辑（如需刷新可在此添加）
  },

  /**
   * 随机刷新轮播图
   */
  refreshSwiper: function() {
    let swiperList = common.getSwiperNews()
    this.setData({
      swiperList: swiperList
    })
  },

  /**
   * 搜索输入事件
   */
  onSearchInput: function(e) {
    let keyword = e.detail.value
    this.setData({
      searchKeyword: keyword
    })
    
    // 实时搜索（使用 trim 后的关键词）
    let trimmedKeyword = keyword.trim()
    if (trimmedKeyword) {
      this.searchNews(trimmedKeyword)
    } else {
      this.clearSearch()
    }
  },

  /**
   * 搜索确认事件
   */
  onSearch: function(e) {
    let keyword = e.detail.value.trim()
    if (keyword) {
      this.searchNews(keyword)
    }
  },

  /**
   * 搜索新闻
   */
  searchNews: function(keyword) {
    let filtered = this.data.allNewsList.filter(item => {
      return item.title.indexOf(keyword) !== -1
    })
    
    this.setData({
      newsList: filtered,
      isSearching: true
    })
  },

  /**
   * 清除搜索
   */
  clearSearch: function() {
    let newsList = common.getNewsList(this.data.currentCategory)
    this.setData({
      searchKeyword: '',
      isSearching: false,
      newsList: newsList
    })
  },

  /**
   * 点击轮播图跳转到详情
   */
  goToSwiperDetail: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detail/detail?id=' + id,
    })
  },

  /**
   * 切换分类
   */
  switchCategory: function(e) {
    let category = e.currentTarget.dataset.category
    let newsList = common.getNewsList(category)
    this.setData({
      currentCategory: category,
      newsList: newsList,
      allNewsList: newsList,
      searchKeyword: '',
      isSearching: false
    })
  },

  /**
   * 点击新闻跳转到详情页
   */
  goToDetail: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detail/detail?id=' + id,
    })
  }
})
