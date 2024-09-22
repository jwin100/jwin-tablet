const http = uni.$u.http

export default {
  getPayTypeList () {
    return http.get('/merchant/gate/payment/pay-type/list')
  },
  getCashierPayType () {
    return http.get('/merchant/gate/payment/pay-type/cashier')
  },
  getRefundPayType () {
    return http.get('/merchant/gate/payment/pay-type/refund')
  },
  getAssetPayType () {
    return http.get('/merchant/gate/payment/pay-type/asset')
  }
}
