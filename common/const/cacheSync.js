import config from "@/common/config.js";

export const getTokenInfo = () => {
	return uni.getStorageSync(config.storageTokenKey)
}

export const setTokenInfo = (tokenInfo) => {
	uni.setStorageSync(config.storageTokenKey, tokenInfo)
}

export const clearTokenInfo = () => {
	uni.removeStorageSync(config.storageTokenKey)
}

export const getAccessToken = () => {
	return getTokenInfo()?.accessToken || ''
}

export const getRefreshToken = () => {
	return getTokenInfo()?.refreshToekn || ''
}

export const getBearerToken = () => {
	const token = getAccessToken()
	if (token) {
		return 'Bearer ' + token
	}
	return null
}

export const getUserInfo = () => {
	return uni.getStorageSync(config.storageUserKey) || {}
}

export const setUserInfo = (userInfo) => {
	uni.setStorageSync(config.storageUserKey, userInfo)
}

export const clearUserInfo = () => {
	uni.removeStorageSync(config.storageUserKey)
}

export const getMerchantInfo = () => {
	return uni.getStorageSync(config.storageMerchantKey) || {}
}

export const setMerchantInfo = (userInfo) => {
	uni.setStorageSync(config.storageMerchantKey, userInfo)
}

export const clearMerchantInfo = () => {
	uni.removeStorageSync(config.storageMerchantKey)
}

export const getMerchantStoreInfo = () => {
	return uni.getStorageSync(config.storageMerchantStoreKey) || {}
}

export const setMerchantStoreInfo = (userInfo) => {
	uni.setStorageSync(config.storageMerchantStoreKey, userInfo)
}

export const clearMerchantStoreInfo = () => {
	uni.removeStorageSync(config.storageMerchantStoreKey)
}