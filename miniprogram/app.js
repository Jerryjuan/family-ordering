// 小程序入口
App({
  // 全局数据
  globalData: {
    // 用户信息
    userInfo: null,
    // 购物车数据
    cart: [],
    // API 基础地址
    apiBaseUrl: 'http://localhost:3000/api'
  },

  // 生命周期 - 小程序初始化
  onLaunch() {
    console.log('🚀 家常菜点餐小程序启动');

    // 从本地存储恢复购物车
    const cart = wx.getStorageSync('cart');
    if (cart) {
      this.globalData.cart = cart;
    }

    // 检查更新
    this.checkUpdate();
  },

  // 检查小程序更新
  checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本已准备好，是否重启应用？',
              success: (res) => {
                if (res.confirm) {
                  updateManager.applyUpdate();
                }
              }
            });
          });
        }
      });
    }
  },

  // 添加到购物车
  addToCart(dish) {
    const cart = this.globalData.cart;
    const existIndex = cart.findIndex(item => item.dish_id === dish.id);

    if (existIndex >= 0) {
      cart[existIndex].quantity += 1;
    } else {
      cart.push({
        dish_id: dish.id,
        dish_name: dish.name,
        price: dish.price,
        image: dish.image,
        quantity: 1
      });
    }

    this.saveCart();
    return cart;
  },

  // 从购物车减少
  reduceFromCart(dishId) {
    const cart = this.globalData.cart;
    const existIndex = cart.findIndex(item => item.dish_id === dishId);

    if (existIndex >= 0) {
      if (cart[existIndex].quantity > 1) {
        cart[existIndex].quantity -= 1;
      } else {
        cart.splice(existIndex, 1);
      }
      this.saveCart();
    }
    return cart;
  },

  // 清空购物车
  clearCart() {
    this.globalData.cart = [];
    this.saveCart();
  },

  // 保存购物车到本地存储
  saveCart() {
    wx.setStorageSync('cart', this.globalData.cart);
  },

  // 获取购物车总价和数量
  getCartSummary() {
    const cart = this.globalData.cart;
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    return { totalPrice, totalCount };
  }
});