const http = uni.$u.http

export default {
  orderDiscountEdit (data) {
    return http.put('/merchant/cashier/discount', data)
  },
  orderDiscountDelete (id) {
    return http.delete(`/merchant/cashier/discount/${id}`)
  },
  orderDiscountList () {
    return http.get('/merchant/gate/cashier/discount/list')
  }
}
