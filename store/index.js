import Vue from 'vue'
import Vuex from 'vuex'
import staff from '../api/security/staff'
import login from '../api/auth/login'
import { clearMerchantInfo, clearMerchantStoreInfo, clearTokenInfo, clearUserInfo, getMerchantInfo, getMerchantStoreInfo, getTokenInfo, getUserInfo, setMerchantInfo, setMerchantStoreInfo, setTokenInfo, setUserInfo } from '../common/const/cacheSync'

Vue.use(Vuex) // vue的插件机制

// Vuex.Store 构造器选项
const store = new Vuex.Store({
	// 为了不和页面或组件的data中的造成混淆，state中的变量前面建议加上$符号
	state: {
		// 用户信息
		$tokenInfo: {},
		$userInfo: {},
		$merchantInfo: {},
		$merchantStoreInfo: {}
	},
	mutations: {
		editTokenInfo(state, tokenInfo) {
			state.$tokenInfo = tokenInfo
		},
		editUserInfo(state, userInfo) {
			state.$userInfo = userInfo
		},
		editMerchantInfo(state, merchantInfo) {
			state.$merchantInfo = merchantInfo
		},
		editMerchantStoreInfo(state, merchantStoreInfo) {
			state.$merchantStoreInfo = merchantStoreInfo
		},
	},
	actions: {
		actionInit({commit}){
			return new Promise((resolve, reject) => {
				const userInfo = getUserInfo()
				if(userInfo) {
					const tokenInfo = getTokenInfo()
					commit('editTokenInfo', tokenInfo)
					commit('editUserInfo', userInfo)
					commit('editMerchantInfo', getMerchantInfo())
					commit('editMerchantStoreInfo', getMerchantStoreInfo())
					resolve(tokenInfo)
				}
			})
		},
		actionTokenInfo({commit}, form) {
			return new Promise((resolve, reject) => {
				login.login(form).then(res => {
					commit('editTokenInfo', res.data)
					setTokenInfo(res.data)
					resolve()
				}).catch(err => {
					reject(err)
				})
			})
		},
		actionUserInfo({commit}) {
			return new Promise((resolve, reject) => {
				staff.getAccountDetail().then(res => {
					const { userVo, storeVo, merchantVo } = res.data
					commit('editUserInfo', userVo)
					commit('editMerchantStoreInfo', storeVo)
					commit('editMerchantInfo', merchantVo)
					setUserInfo(userVo)
					setMerchantStoreInfo(storeVo)
					setMerchantInfo(merchantVo)
					resolve()
				}).catch(err => {
					reject(err)
				})
			})
		},
		actionLogout({commit}) {
			return new Promise((resolve, reject) => {
				login.logout().then(() => {
					commit('editTokenInfo', {})
					commit('editUserInfo', {})
					commit('editMerchantInfo', {})
					commit('editMerchantStoreInfo', {})
					clearTokenInfo()
					clearUserInfo()
					clearMerchantInfo()
					clearMerchantStoreInfo()
					resolve()
				})
			})
		}
	},
	getters: {
		getUserInfo: state => {
			return state.$userInfo
		}
	}
})

export default store