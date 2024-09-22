import {
	getAccessToken
} from "../../common/const/cacheSync.js"

export default {
	// 获取图片验证码
	imgCaptcha(phone) {
		return uni.$u.http.get(`/merchant/oauth/login/img-captcha/${phone}`)
	},
	// 登录
	login(data) {
		return uni.$u.http.post('/merchant/oauth/login', data)
	},
	smsCaptcha(data) {
		return uni.$u.http.post('/merchant/oauth/login/send-sms-code', data)
	},
	logout() {
		return uni.$u.http.post(`/merchant/oauth/logout/${getAccessToken()}`)
	}
}