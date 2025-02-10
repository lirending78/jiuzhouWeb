import { currentConfig } from '@/config/config.js'

// 创建请求方法
export const service = (url, method, data, options = {}) => {
	const token = uni.getStorageSync('token')

	return new Promise((resolve, reject) => {
		uni.request({
			url: `${currentConfig.API_BASE_URL}${url}`,
			method: method,
			data: data,
			header: {
				'Authorization': token ? `Bearer ${token}` : '',
				// 允许跨域
				// 'Access-Control-Allow-Origin': '*',
				// 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
				// 'Access-Control-Allow-Headers': 'Content-Type, Authorization',
				...options.headers
			},
			success: (res) => {
				if (res.data && res.data.code === 0) {
					resolve(res);
				}
				if (res.data.code === 401) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				} else {
					resolve(res);
				}
			},
			fail(err) {
				uni.hideLoading({
					title: "加载中",
					mask: true
				});
				console.error('Request failed:', err); // 打印请求失败的错误信息
				reject(err);
			},
		});
		uni.hideLoading({
			title: "加载中",
			mask: true
		});
	})
}

// 文件上传方法
export const uploadFile = (filePath, type = 'image') => {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: `${currentConfig.API_BASE_URL}/api/common/upload-file`,
			filePath: filePath,
			name: 'file',
			formData: {
				type: type
			},
			header: {
				'Authorization': 'Bearer ' + uni.getStorageSync('token')
			},
			success: (res) => {
				try {
					const data = JSON.parse(res.data)
					if (data.code === 0) {
						resolve(data.data)
					} else {
						reject(new Error(data.message || '上传失败'))
					}
				} catch (error) {
					reject(error)
				}
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

module.exports = {
	service,
	uploadFile,
};
