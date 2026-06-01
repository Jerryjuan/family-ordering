// API 请求封装
const app = getApp();

/**
 * 封装请求方法
 * @param {string} url - 请求路径（不含基础地址）
 * @param {object} options - 请求选项
 * @returns {Promise} - 返回 Promise
 */
function request(url, options = {}) {
  const {
    method = 'GET',
    data = null,
    header = {}
  } = options;

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.apiBaseUrl}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.success) {
            resolve(res.data);
          } else {
            reject(res.data.error || '请求失败');
          }
        } else {
          reject(`HTTP错误: ${res.statusCode}`);
        }
      },
      fail: (err) => {
        console.error('请求失败:', err);
        reject('网络请求失败，请检查网络连接');
      }
    });
  });
}

// GET 请求
function get(url, params = {}) {
  const queryString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  return request(fullUrl, { method: 'GET' });
}

// POST 请求
function post(url, data = {}) {
  return request(url, { method: 'POST', data });
}

// PUT 请求
function put(url, data = {}) {
  return request(url, { method: 'PUT', data });
}

// DELETE 请求
function del(url) {
  return request(url, { method: 'DELETE' });
}

module.exports = {
  request,
  get,
  post,
  put,
  del
};