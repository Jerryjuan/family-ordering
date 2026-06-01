// 菜品卡片组件
const app = getApp();

Component({
  properties: {
    // 菜品数据
    dish: {
      type: Object,
      value: {}
    },
    // 是否显示购物车按钮
    showCartBtn: {
      type: Boolean,
      value: true
    },
    // 是否显示管理按钮
    showAdminBtn: {
      type: Boolean,
      value: false
    },
    // 是否显示分类标签
    showCategory: {
      type: Boolean,
      value: false
    }
  },

  data: {
    quantity: 0
  },

  observers: {
    'dish.id': function (dishId) {
      // 根据购物车数据更新数量
      const cart = app.globalData.cart;
      const item = cart.find(i => i.dish_id === dishId);
      this.setData({
        quantity: item ? item.quantity : 0
      });
    }
  },

  methods: {
    // 点击菜品
    onTap() {
      this.triggerEvent('tap', { dish: this.properties.dish });
    },

    // 添加到购物车
    onAdd() {
      const cart = app.addToCart(this.properties.dish);
      const item = cart.find(i => i.dish_id === this.properties.dish.id);
      this.setData({ quantity: item ? item.quantity : 0 });
      this.triggerEvent('cartchange', { cart });
    },

    // 从购物车减少
    onReduce() {
      const cart = app.reduceFromCart(this.properties.dish.id);
      const item = cart.find(i => i.dish_id === this.properties.dish.id);
      this.setData({ quantity: item ? item.quantity : 0 });
      this.triggerEvent('cartchange', { cart });
    },

    // 切换上下架状态
    onToggleStatus() {
      const newStatus = this.properties.dish.status === 1 ? 0 : 1;
      this.triggerEvent('togglestatus', {
        dish: this.properties.dish,
        status: newStatus
      });
    }
  }
});