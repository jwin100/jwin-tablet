const {
	clearTokenInfo
} = require("@/common/const/cacheSync")

/**
 * 响应拦截
 * @param {Object} http 
 */
module.exports = (vm) => {
	uni.$u.http.interceptors.response.use((response) => {
		/* 对响应成功做点什么 可使用async await 做异步操作*/
		const res = response.data
		if (res.code != 200) {
			switch (res.code) {
				case 401:
				case 402:
					clearTokenInfo()
					uni.showToast({
						title: res.msg,
						icon: 'none',
						position: 'top',
						mask: true
					})
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/auth/login'
						})
					}, 1000)
					break
				case 403:
				case 404:
					uni.showToast({
						title: '请求信息不存在',
						icon: 'none'
					})
					break
				case 601:
				case 602:
				case 603:
					uni.showModal({
						title: '版本提示',
						content: '当前版本不能操作此功能，如需操作请前往升级版本',
						cancelText: '取消',
						confirmText: '前往升级版本',
						success(result) {
							if (result.confirm) {
								// 跳转到升级页面
							}
							if (result.cancel) {
								// 已取消
							}
						}
					})
					break
				default:
					uni.showModal({
						title: '错误提示',
						content: res.msg || '系统错误',
						showCancel: false,
						confirmText: '确定'
					})
			}
			return Promise.reject(new Error(res.msg || '系统错误'))
		}
		return res
	}, (response) => {
		/*  对响应错误做点什么 （statusCode !== 200）*/
		uni.showToast({
			title: '服务异常',
			icon: 'none'
		})
		return Promise.reject(new Error('服务异常'))
	})
}