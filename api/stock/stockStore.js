const http = uni.$u.http

export default {
	stockStoreInfo(id) {
		return http.get(`/merchant/stock/store/${id}`)
	},
	stockStorePage(params) {
		return http.get('/merchant/stock/store/page', { params: params })
	},
	stockSpuSearchByIds(spuIds) {
		return http.get(`/merchant/gate/stock/store/spu-search-ids?spuIds=${spuIds}`)
	},
	stockSpuSearchByKeyword(params) {
		return http.get('/merchant/gate/stock/store/spu-search-keyword', { params: params })
	},
	stockSkuSearch(spuId) {
		return http.get(`/merchant/gate/stock/store/sku-search?spuId=${spuId}`)
	},
	stockSkuSearchByKeyword(keyword) {
		return http.get(`/merchant/gate/stock/store/sku-search-keyword?keyword=${keyword}`)
	}
}