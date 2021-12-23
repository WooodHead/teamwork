import { listToTree } from '@/utils/list-to-tree'
export default {
  dept: (_state, getters) => id => {
    return _.find(getters.depts, { id }) || {}
  },
  depts: (_state, getters) => {
    return getters.deptsFiltered
  },
  deptsTree: (_state, getters) => deptId => {
    let depts = _.filter(getters.depts, d => d.id === +deptId || d.parentid === +deptId)
    _.forEach(depts, d => {
      d.users = _.filter(getters.users, u => u.department.includes(d.id))
    })
    return listToTree(_.clone(depts), 'id', 'parentid')
  },
  user: (_state, getters) => id => {
    return _.find(getters.users, { id }) || {}
  },
  users: (_state, getters) => {
    return getters.usersFiltered
  },
  deptsFiltered: state => {
    let depts = state.depts
    return depts
  },
  usersFiltered: state => {
    let users = state.users
    return users
  },
  searchUser: state => {
    return state.searchUser
  },
  searchDept: state => {
    return state.searchDept
  }
}
