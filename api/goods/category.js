const http = uni.$u.http

export default {
	categoryList() {
		return http.get('/merchant/gate/goods/category/list')
	}
}