export default {
	saleHangRecord(data) {
		return uni.$u.http.post('/merchant/cashier/hang/record', data)
	},
	saleTakeHang(hangNo) {
		return uni.$u.http.post(`/merchant/cashier/hang/take/${hangNo}`)
	},
	saleDeleteHang(hangNo) {
		return uni.$u.http.delete(`/merchant/cashier/hang/${hangNo}`)
	},
	saleHangList() {
		return uni.$u.http.get('/merchant/cashier/hang/list')
	}
}