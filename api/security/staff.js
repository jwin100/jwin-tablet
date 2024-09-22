export default {
	accountCreate(data) {
		return uni.$u.http.post('/merchant/security/account', data)
	},
	accountEdit(id, data) {
		return uni.$u.http.put(`/merchant/security/account/${id}`, data)
	},
	accountEditStatus(id, status) {
		return uni.$u.http.put(`/merchant/security/account/${id}?status=${status}`)
	},
	accountDelete(id) {
		return uni.$u.http.delete(`/merchant/security/account/${id}`)
	},
	accountInfo(id) {
		return uni.$u.http.get(`/merchant/security/account/${id}`)
	},
	accountPage(params) {
		return uni.$u.http.get('/merchant/security/account/page', {params:params})
	},
	getAccountDetail() {
		return uni.$u.http.get('/merchant/gate/security/account/detail')
	},
	accountSearch(searchKey) {
		return uni.$u.http.get(`/merchant/gate/security/account/search/${searchKey}`)
	},
	accountList() {
		return uni.$u.http.get('/merchant/gate/security/account/list')
	},
	accountAllList() {
		return uni.$u.http.get('/merchant/gate/security/account/all-list')
	}
}