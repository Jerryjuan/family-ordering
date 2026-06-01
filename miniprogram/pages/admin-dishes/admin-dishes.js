// 菜品管理页
const api = require('../../utils/request');
const util = require('../../utils/util');

Page({
  data: {
    categories: [],
    dishes: [],
    currentCategory: 0,
    showModal: false,
    isEdit: false,
    editId: null,
    formData: {
      name: '',
      category_id: '',
      price: '',
      description: ''
    },
    categoryIndex: 0
  },

  onLoad() {
    this.loadCategories();
    this.loadDishes();
  },

  onShow() {
    this.loadDishes();
  },

  // 加载分类
  async loadCategories() {
    try {
      const res = await api.get('/categories');
      this.setData({ categories: res.data || [] });
    } catch (error) {
      console.error('加载分类失败:', error);
    }
  },

  // 加载菜品
  async loadDishes() {
    try {
      const params = {};
      if (this.data.currentCategory > 0) {
        params.category_id = this.data.currentCategory;
      }
      const res = await api.get('/dishes', params);
      this.setData({ dishes: res.data || [] });
    } catch (error) {
      console.error('加载菜品失败:', error);
    }
  },

  // 切换分类
  onCategoryChange(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    this.setData({ currentCategory: id });
    this.loadDishes();
  },

  // 切换上下架
  async onToggleStatus(e) {
    const { id, status } = e.currentTarget.dataset;
    const newStatus = status === 1 ? 0 : 1;
    try {
      await api.put(`/dishes/${id}/status`, { status: newStatus });
      util.showSuccess(newStatus === 1 ? '已上架' : '已下架');
      this.loadDishes();
    } catch (error) {
      util.showError('操作失败');
    }
  },

  // 点击编辑
  onEdit(e) {
    const item = e.currentTarget.dataset.item;
    const catIndex = this.data.categories.findIndex(c => c.id === item.category_id);
    this.setData({
      showModal: true,
      isEdit: true,
      editId: item.id,
      formData: {
        name: item.name,
        category_id: item.category_id,
        price: String(item.price),
        description: item.description || ''
      },
      categoryIndex: catIndex >= 0 ? catIndex : 0
    });
  },

  // 点击删除
  onDelete(e) {
    const { id, name } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: `确定删除「${name}」吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.del(`/dishes/${id}`);
            util.showSuccess('删除成功');
            this.loadDishes();
          } catch (error) {
            util.showError('删除失败');
          }
        }
      }
    });
  },

  // 点击添加
  onAdd() {
    this.setData({
      showModal: true,
      isEdit: false,
      editId: null,
      formData: { name: '', category_id: '', price: '', description: '' },
      categoryIndex: 0
    });
  },

  // 关闭弹窗
  onCloseModal() {
    this.setData({ showModal: false });
  },

  // 表单输入
  onFormName(e) {
    this.setData({ 'formData.name': e.detail.value });
  },
  onFormPrice(e) {
    this.setData({ 'formData.price': e.detail.value });
  },
  onFormDesc(e) {
    this.setData({ 'formData.description': e.detail.value });
  },
  onFormCategory(e) {
    const index = parseInt(e.detail.value);
    const category = this.data.categories[index];
    this.setData({
      categoryIndex: index,
      'formData.category_id': category ? category.id : ''
    });
  },

  // 保存
  async onSave() {
    const { name, price, category_id, description } = this.data.formData;
    if (!name.trim()) {
      util.showToast('请输入菜品名称');
      return;
    }
    if (!price || isNaN(parseFloat(price))) {
      util.showToast('请输入有效价格');
      return;
    }

    try {
      util.showLoading('保存中...');
      const data = {
        name: name.trim(),
        price: parseFloat(price),
        category_id: category_id || null,
        description: description.trim()
      };

      if (this.data.isEdit) {
        await api.put(`/dishes/${this.data.editId}`, data);
      } else {
        await api.post('/dishes', data);
      }

      util.hideLoading();
      util.showSuccess('保存成功');
      this.onCloseModal();
      this.loadDishes();
    } catch (error) {
      util.hideLoading();
      util.showError('保存失败');
    }
  }
});