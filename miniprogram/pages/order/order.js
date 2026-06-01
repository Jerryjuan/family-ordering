// 下单页
const api = require('../../utils/request');
const util = require('../../utils/util');
const app = getApp();

Page({
  data: {
    cartItems: [],
    totalPrice: '0.00',
    totalCount: 0,
    customerName: '',
    remark: '',
    submitting: false
  },

  onLoad() {
    const cart = app.globalData.cart;
    if (cart.length === 0) {
      wx.showModal({
        title: '提示',
        content: '购物车为空，请先去点餐',
        showCancel: false,
        success: () => {
          wx.switchTab({ url: '/pages/index/index' });
        }
      });
      return;
    }

    const { totalPrice, totalCount } = app.getCartSummary();
    this.setData({
      cartItems: cart,
      totalPrice: totalPrice.toFixed(2),
      totalCount
    });

    // 恢复上次输入的名字
    const savedName = wx.getStorageSync('customerName');
    if (savedName) {
      this.setData({ customerName: savedName });
    }
  },

  // 输入点餐人
  onNameInput(e) {
    this.setData({ customerName: e.detail.value });
  },

  // 输入备注
  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  // 提交订单
  async onSubmit() {
    if (this.data.submitting) return;

    const { customerName, remark, cartItems } = this.data;

    if (!customerName.trim()) {
      util.showToast('请输入你的名字');
      return;
    }

    if (cartItems.length === 0) {
      util.showToast('购物车为空');
      return;
    }

    // 保存名字
    wx.setStorageSync('customerName', customerName);

    this.setData({ submitting: true });
    util.showLoading('提交中...');

    try {
      const orderData = {
        customer_name: customerName.trim(),
        remark: remark.trim(),
        items: cartItems.map(item => ({
          dish_id: item.dish_id,
          dish_name: item.dish_name,
          price: item.price,
          quantity: item.quantity
        }))
      };

      const res = await api.post('/orders', orderData);
      util.hideLoading();

      // 清空购物车
      app.clearCart();

      // 提示成功
      wx.showModal({
        title: '🎉 下单成功！',
        content: `订单号: ${res.data.order_no}\n稍等片刻，马上就好~`,
        showCancel: false,
        confirmText: '查看订单',
        success: () => {
          wx.redirectTo({
            url: `/pages/order-detail/order-detail?id=${res.data.id}`
          });
        }
      });
    } catch (error) {
      util.hideLoading();
      this.setData({ submitting: false });
      console.error('下单失败:', error);
      util.showError('下单失败，请重试');
    }
  }
});