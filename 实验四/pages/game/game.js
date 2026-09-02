// game.js
var data = require('../../utils/data.js')

//地图图层数据
var map = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
]

//箱子图层数据
var box = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
]

//方块的宽度
var w = 40
//初始化游戏主角(小鸟)的行与列
var row = 0
var col = 0
//回退历史记录
var history = []

Page({
  /**
   * 页面的初始数据
   */
  data: {
    level: 1,
    steps: 0,
    completed: 0,
    total: 0,
    showWin: false,
    hasPrev: false,
    hasNext: true,
    alreadyWon: false
  },

  /**
   * 生命周期函数 -- 监听页面加载
   */
  onLoad: function(options) {
    //获取关卡
    let level = options.level
    //更新页面关卡标题
    this.setData({
      level: parseInt(level) + 1
    })
    //创建画布上下文
    this.ctx = wx.createCanvasContext('myCanvas')
    //清空历史记录
    history = []
    //初始化地图数据
    this.initMap(level)
    //统计箱子总数
    this.countTotal()
    //绘制画布内容
    this.drawCanvas()
    //更新统计显示
    this.updateStats()
  },

  /**
   * 自定义函数 -- 初始化地图数据
   */
  initMap: function(level) {
    //读取原始的游戏地图数据
    let mapData = data.maps[level]
    //使用双重 for 循环记录地图数据
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        box[i][j] = 0
        map[i][j] = mapData[i][j]

        if (mapData[i][j] == 4) {
          box[i][j] = 4
          map[i][j] = 2
        } else if (mapData[i][j] == 5) {
          map[i][j] = 2
          //记录小鸟的当前行和列
          row = i
          col = j
        }
      }
    }
  },

  /**
   * 统计箱子总数（地图中终点数量）
   */
  countTotal: function() {
    var total = 0
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        if (map[i][j] == 3) {
          total++
        }
      }
    }
    this.setData({ total: total })
  },

  /**
   * 更新统计信息显示
   */
  updateStats: function() {
    var completed = 0
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        if (box[i][j] == 4 && map[i][j] == 3) {
          completed++
        }
      }
    }
    this.setData({ completed: completed })
  },

  /**
   * 保存当前状态到历史记录
   */
  saveState: function() {
    //深拷贝 box 数组
    var boxCopy = []
    for (var i = 0; i < 8; i++) {
      boxCopy[i] = []
      for (var j = 0; j < 8; j++) {
        boxCopy[i][j] = box[i][j]
      }
    }
    history.push({
      row: row,
      col: col,
      box: boxCopy,
      steps: this.data.steps
    })
  },

  /**
   * 自定义函数 -- 回退上一步
   */
  undo: function() {
    if (history.length === 0) {
      wx.showToast({ title: '没有可回退的步骤', icon: 'none' })
      return
    }
    var prev = history.pop()
    row = prev.row
    col = prev.col
    //恢复 box 数组
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        box[i][j] = prev.box[i][j]
      }
    }
    //恢复步数
    this.setData({ steps: prev.steps })
    //重置通关标志，允许再次通关
    this.setData({ alreadyWon: false, showWin: false })
    //重新绘制
    this.drawCanvas()
    this.updateStats()
  },

  /**
   * 自定义函数 -- 绘制地图
   */
  drawCanvas: function() {
    let ctx = this.ctx
    //清空画布
    ctx.clearRect(0, 0, 320, 320)
    //使用双重 for 循环绘制 8x8 的地图
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        //默认是道路
        let img = 'ice'
        if (map[i][j] == 1) {
          img = 'stone'
        } else if (map[i][j] == 3) {
          img = 'pig'
        }

        //绘制地图
        ctx.drawImage('/images/icons/' + img + '.png', j * w, i * w, w, w)

        if (box[i][j] == 4) {
          //叠加绘制箱子
          ctx.drawImage('/images/icons/box.png', j * w, i * w, w, w)
        }
      }
    }

    //叠加绘制小鸟
    ctx.drawImage('/images/icons/bird.png', col * w, row * w, w, w)

    ctx.draw()
  },

  /**
   * 自定义函数 -- 方向键：上
   */
  up: function() {
    //不在最顶端才考虑上移
    if (row > 0) {
      //如果上方不是墙或箱子，可以移动小鸟
      if (map[row - 1][col] != 1 && box[row - 1][col] != 4) {
        //保存当前状态
        this.saveState()
        //更新当前小鸟的坐标
        row = row - 1
      }
      //如果上方是箱子
      else if (box[row - 1][col] == 4) {
        //箱子不在最顶端才能考虑推动
        if (row - 1 > 0) {
          //如果箱子上方不是墙或箱子
          if (map[row - 2][col] != 1 && box[row - 2][col] != 4) {
            //保存当前状态
            this.saveState()
            box[row - 2][col] = 4
            box[row - 1][col] = 0
            //更新当前小鸟的坐标
            row = row - 1
          }
        }
      }
    }
    //重新绘制地图
    this.drawCanvas()
    //更新步数
    this.setData({ steps: this.data.steps + 1 })
    //更新统计显示
    this.updateStats()
    //检查游戏是否成功
    this.checkWin()
  },

  /**
   * 自定义函数 -- 方向键：下
   */
  down: function() {
    //不在最底端才考虑下移
    if (row < 7) {
      //如果下方不是墙或箱子，可以移动小鸟
      if (map[row + 1][col] != 1 && box[row + 1][col] != 4) {
        //保存当前状态
        this.saveState()
        //更新当前小鸟的坐标
        row = row + 1
      }
      //如果下方是箱子
      else if (box[row + 1][col] == 4) {
        //箱子不在最底端才能考虑推动
        if (row + 1 < 7) {
          //如果箱子下方不是墙或箱子
          if (map[row + 2][col] != 1 && box[row + 2][col] != 4) {
            //保存当前状态
            this.saveState()
            box[row + 2][col] = 4
            box[row + 1][col] = 0
            //更新当前小鸟的坐标
            row = row + 1
          }
        }
      }
    }
    //重新绘制地图
    this.drawCanvas()
    //更新步数
    this.setData({ steps: this.data.steps + 1 })
    //更新统计显示
    this.updateStats()
    //检查游戏是否成功
    this.checkWin()
  },

  /**
   * 自定义函数 -- 方向键：左
   */
  left: function() {
    //不在最左侧才考虑左移
    if (col > 0) {
      //如果左侧不是墙或箱子，可以移动小鸟
      if (map[row][col - 1] != 1 && box[row][col - 1] != 4) {
        //保存当前状态
        this.saveState()
        //更新当前小鸟的坐标
        col = col - 1
      }
      //如果左侧是箱子
      else if (box[row][col - 1] == 4) {
        //箱子不在最左侧才能考虑推动
        if (col - 1 > 0) {
          //如果箱子左侧不是墙或箱子
          if (map[row][col - 2] != 1 && box[row][col - 2] != 4) {
            //保存当前状态
            this.saveState()
            box[row][col - 2] = 4
            box[row][col - 1] = 0
            //更新当前小鸟的坐标
            col = col - 1
          }
        }
      }
    }
    //重新绘制地图
    this.drawCanvas()
    //更新步数
    this.setData({ steps: this.data.steps + 1 })
    //更新统计显示
    this.updateStats()
    //检查游戏是否成功
    this.checkWin()
  },

  /**
   * 自定义函数 -- 方向键：右
   */
  right: function() {
    //不在最右侧才考虑右移
    if (col < 7) {
      //如果右侧不是墙或箱子，可以移动小鸟
      if (map[row][col + 1] != 1 && box[row][col + 1] != 4) {
        //保存当前状态
        this.saveState()
        //更新当前小鸟的坐标
        col = col + 1
      }
      //如果右侧是箱子
      else if (box[row][col + 1] == 4) {
        //箱子不在最右侧才能考虑推动
        if (col + 1 < 7) {
          //如果箱子右侧不是墙或箱子
          if (map[row][col + 2] != 1 && box[row][col + 2] != 4) {
            //保存当前状态
            this.saveState()
            box[row][col + 2] = 4
            box[row][col + 1] = 0
            //更新当前小鸟的坐标
            col = col + 1
          }
        }
      }
    }
    //重新绘制地图
    this.drawCanvas()
    //更新步数
    this.setData({ steps: this.data.steps + 1 })
    //更新统计显示
    this.updateStats()
    //检查游戏是否成功
    this.checkWin()
  },

  /**
   * 自定义函数 -- 判断游戏是否成功
   */
  isWin: function() {
    //使用双重 for 循环遍历整个数组
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        //如果有箱子没在终点
        if (box[i][j] == 4 && map[i][j] != 3) {
          //返回 false，表示游戏尚未成功
          return false
        }
      }
    }
    //返回 true，表示游戏成功
    return true
  },

  /**
   * 自定义函数 -- 游戏成功处理
   */
  checkWin: function() {
    if (!this.data.alreadyWon && this.isWin()) {
      //判断是否有上一关和下一关
      let hasPrev = this.data.level > 1
      let hasNext = this.data.level < 4
      this.setData({
        showWin: true,
        hasPrev: hasPrev,
        hasNext: hasNext,
        alreadyWon: true
      })
    }
  },

  /**
   * 自定义函数 -- 留在本关
   */
  stayLevel: function() {
    this.setData({ showWin: false })
  },

  /**
   * 自定义函数 -- 下一关
   */
  nextLevel: function() {
    if (this.data.level < 4) {
      let next = this.data.level
      wx.redirectTo({
        url: '../game/game?level=' + next
      })
    }
  },

  /**
   * 自定义函数 -- 上一关
   */
  prevLevel: function() {
    if (this.data.level > 1) {
      let prev = this.data.level - 2
      wx.redirectTo({
        url: '../game/game?level=' + prev
      })
    }
  },

  /**
   * 自定义函数 -- 重新开始游戏
   */
  restartGame: function() {
    //初始化地图数据
    this.initMap(this.data.level - 1)
    //清空历史记录，重置步数和通关标志
    history = []
    this.setData({ steps: 0, showWin: false, alreadyWon: false })
    //更新统计显示
    this.updateStats()
    //绘制画布内容
    this.drawCanvas()
  }
})
