module.exports = {
	baseUrl: 'http://gateway.91pain.com',
	// baseUrl: 'http://127.0.0.1:12000',
	storageUserKey: 'painUser',
	storageMerchantKey: 'painMerchant',
	storageMerchantStoreKey: 'painMerchantStore',
	storageTokenKey: 'painToken',
	storageGridColKey: 'painGridCol',
	storageModalWidthKey: 'painModalWidth',
	platformCode: 2,
	noAuthPages: [
		'/pages/auth/login',
		'/pages/auth/register',
		'/pages/auth/forget'
	]
}