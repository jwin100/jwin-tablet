const http = uni.$u.http

export default {
  orderIgnoreEdit (type) {
    return http.put(`/merchant/cashier/ignore/${type}`)
  },
  orderIgnoreInfo () {
    return http.get('/merchant/gate/cashier/ignore')
  }
}
