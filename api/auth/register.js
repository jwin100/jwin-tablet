const http = uni.$u.http

export default {
	// 获取图片验证码
	imgCaptcha(phone) {
		return http.get(`/merchant/oauth/register/img-captcha/${phone}`)
	},
	// 获取短信验证码
	smsCaptcha(data) {
		return http.post('/merchant/oauth/register/sms-captcha', data)
	},
	// 注册
	register(data) {
		return http.post('/merchant/oauth/register', data)
	}
}