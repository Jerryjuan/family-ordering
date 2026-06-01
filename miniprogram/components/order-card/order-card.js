// 订单卡片组件
const config = require('../../utils/config');

Component({
  properties: {
    // 订单数据
    order: {
      type: Object,
      value: {}
    }
  },

  data: {
    statusText: '',
    statusClass: '',
    itemsSummary: ''
  },

  observers: {
    'order': function (order) {
      if (!order || !order.id) return;

      // 状态映射
      const statusInfo = config.orderStatusMap[order.status] || { text: '未知', class: '' };
      this.setData({
        statusText: statusInfo.text,
        statusClass: statusInfo.class.replace('status-', '')
      });

      // 商品摘要
      if (order.items && order.items.length > 0) {
        const summary = order.items.map(item => `${item.dish_name} x${item.quantity}`).join('、');
        this.setData({ itemsSummary: summary });
      }
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', { order: this.properties.order });
    }
  }
});