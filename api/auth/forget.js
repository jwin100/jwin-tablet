const http = uni.$u.http

export default {
	// 获取图片验证码
	imgCaptcha(phone) {
		return http.get(`/merchant/oauth/edit-password/img-captcha/${phone}`)
	},
	// 获取短信验证码
	smsCaptcha(data) {
		return http.post('/merchant/oauth/edit-password/sms-captcha', data)
	},
	// 通过验证码重置
	smsCaptchaReset(data) {
		return http.post('/merchant/oauth/edit-password/sms-captcha-reset', data)
	},
	originalPasswordReset(data) {
		return http.post('/merchant/oauth/edit-password/original-password-reset', data)
	}
}