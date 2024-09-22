const http = uni.$u.http

export default {
	memberTimeCardConfirm(data) {
		return http.post('/merchant/member/time-card-order/confirm', data)
	},
	memberTimeCardPay(data) {
		return http.post('/merchant/member/time-card-order/pay', data)
	},
	memberTimeCardRefund(data) {
		return http.post('/merchant/member/time-card-order/refund', data)
	},
	memberTimeCardBySpuIdList(memberId, spuId) {
		return http.get(`/merchant/gate/member/time-card/list/spu-no/${memberId}?spuId=${spuId}`)
	},
	memberTimeCardList(memberId) {
		return http.get(`/merchant/gate/member/time-card/list/${memberId}`)
	},
	memberTimeCardOrderPage(params) {
		return http.get('/merchant/gate/member/time-card-order/page', {params: params})
	}
}