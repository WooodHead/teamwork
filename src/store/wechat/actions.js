import request from '@/boot/axios'
const url = {
  getWechatDeptlist: 'wechat/getwechatdeptlist',
  getWechatDeptUserlist: 'wechat/getwechatdeptuserlist'
}
export default {
  getWechatDeptlist ({ state, dispatch, commit }, { departmentId = 1 } = {}) {
    if (state.depts.length) {
      return state.depts
    }
    return request.get(url.getWechatDeptlist, { departmentId })
      .then(async res => {
        commit('addDepts', res.data.department)
        await dispatch('getWechatDeptUserlist')
        return res.data.department
      })
  },
  getWechatDeptUserlist ({ state, commit }, { departmentId = 1, fetchChild = 1 } = {}) {
    return request.get(url.getWechatDeptUserlist, { departmentId, fetchChild })
      .then((res) => {
        let activatedUsers = _.filter(res.data.userlist, u => u.status === 1)
        commit('addUsers', activatedUsers)
        return activatedUsers
      })
  }
}
