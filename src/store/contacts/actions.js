import request from '@/boot/axios'
import Team from '../team/model'
import Group from '../group/model'
export default {
  /**
   *左侧树数据更新，同步更新下拉选中、树菜单选中、人员数据
   * @param {*} { commit }
   * @param {*} data
   */
  updateTreed ({ commit }, payload) {
    // 更新左侧树数据状态
    commit('updateTreed', payload)
  },
  /**
   *给树节点的persons添加人员列表
   * @param {*} { commit }
   * @param {*} treed
   */
  setTreedPersons ({ commit }, payload) {
    commit('setTreedPersons', payload)
  },
  /**
   *获取组织机构，服务，团队群组下的数据项
   * @param {*} { commit }
   * @returns
   */
  GetContactItems ({ state, commit, rootState, rootGetters }) {
    return request.get('contacts/GetContactItems')
      .then((res) => {
        if (res.data) {
          let organizes = res.data.organizes
          let teams = Team.from(res.data.teams)
          let groups = Group.from(res.data.groups)
          let frequentContacts = res.data.frequentContacts

          let organize = rootGetters['organize/filterOrganizesByContactsAcl'](_.filter(_.map(organizes, org => rootState.organize.selectOrganizes[org]), o => !!o))
          let service = state.selects.filter(a => a.group === 'service').map(a => {
            const { id, name: type, label: title, icon, color } = a
            return { id, type, title, icon, color }
          })
          let teamGroup = [..._.map(teams, t => { t.type = 'team'; return t }), ..._.map(groups, g => { g.type = 'group'; return g })]
          let frequentContact = rootGetters['person/filterPersonsByContactsAcl'](_.map(frequentContacts, (fc) => rootState.person.selectPersons[fc.id]))
          
          commit('setMhome', {
            organize: organize.filter(o => !!o),
            service: service.filter(s => !!s),
            teamGroup: teamGroup.filter(tg => !!tg),
            frequentContact: frequentContact.filter(fc => !!fc)
          })
        }
      })
  }
}
