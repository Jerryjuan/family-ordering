// 通用工具函数

/**
 * 格式化价格
 * @param {number} price - 价格
 * @returns {string} - 格式化后的价格字符串
 */
function formatPrice(price) {
  return price.toFixed(2);
}

/**
 * 格式化日期时间
 * @param {string|Date} datetime - 日期时间
 * @param {string} format - 格式类型 'date' | 'time' | 'full'
 * @returns {string} - 格式化后的日期字符串
 */
function formatDateTime(datetime, format = 'full') {
  const date = new Date(datetime);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');

  if (format === 'date') {
    return `${year}-${month}-${day}`;
  } else if (format === 'time') {
    return `${hour}:${minute}`;
  } else {
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }
}

/**
 * 显示加载提示
 * @param {string} title - 提示文字
 */
function showLoading(title = '加载中...') {
  wx.showLoading({
    title,
    mask: true
  });
}

/**
 * 隐藏加载提示
 */
function hideLoading() {
  wx.hideLoading();
}

/**
 * 显示成功提示
 * @param {string} title - 提示文字
 */
function showSuccess(title) {
  wx.showToast({
    title,
    icon: 'success',
    duration: 1500
  });
}

/**
 * 显示错误提示
 * @param {string} title - 提示文字
 */
function showError(title) {
  wx.showToast({
    title,
    icon: 'error',
    duration: 2000
  });
}

/**
 * 显示普通提示
 * @param {string} title - 提示文字
 */
function showToast(title) {
  wx.showToast({
    title,
    icon: 'none',
    duration: 2000
  });
}

/**
 * 防抖函数
 * @param {function} fn - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {function} - 防抖后的函数
 */
function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

module.exports = {
  formatPrice,
  formatDateTime,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  showToast,
  debounce
};