const http = uni.$u.http

export default {
  memberCreate (data) {
    return http.post('/merchant/member', data)
  },
  memberImport (data) {
    return http.post('/merchant/member/import', data)
  },
  memberEdit (id, data) {
    return http.put(`/merchant/member/${id}`, data)
  },
  memberDelete (id) {
    return http.delete(`/merchant/member/${id}`)
  },
  memberInfo (id) {
    return http.get(`/merchant/member/${id}`)
  },
  memberPage (params) {
    return http.get('/merchant/member/page', {params: params})
  },
  memberList () {
    return http.get('/merchant/gate/member/list')
  },
  memberSearch (searchKey) {
    return http.get(`/merchant/gate/member/search?searchKey=${searchKey}`)
  },
  dashMemberTotal () {
    return http.get('/merchant/gate/member/total-dash')
  }
}