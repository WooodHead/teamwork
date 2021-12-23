import { LocalStorage } from 'quasar'
export default {
  // ----------------------------- persons：人员对象相关数据获取方法 start------------
  // 获取一个用户对象
  person: state => id => {
    return state.persons[id]
  },
  // 获取根据search匹配的数据
  getMatchList: state => search => {
    let allPersons = state.selectPersons
    return _.filter(allPersons, (value, key) => {
      return (value.name && value.name.includes(search)) ||
        (value.pinyin && _.indexOf(_.split(value.pinyin.toLowerCase(), ','), search.toLowerCase()) >= 0)
    })
  },
  // 获取用户列表
  persons: (_state, getters) => {
    return getters.personsSorted
  },
  // 获取一个机构下的人员
  personsOfOrganize: (state, getters, rootState) => (organizeId = state.organizeId, includesChildOrganize = true) => {
    if (includesChildOrganize) {
      return _.filter(getters.personsSorted, p => {
        return _.some(p.listOrganizeDuty, lod => {
          var org = _.find(_.values(rootState.organize.selectOrganizes), org => org.id === lod.organizeId)
          return org ? _.map(org.path.split(','), Number).includes(organizeId) : false
        })
      })
    } else {
      return _.filter(getters.personsSorted, p => _.some(p.listOrganizeDuty, lod => {
        return lod.organizeId === organizeId
      }))
    }
  },
  // 获取一个团队下的人员
  personsOfTeam: (state, getters, rootState) => (teamId = state.teamId) => {
    let currTeam = _.find(rootState.team.allTeams, t => t.id === teamId)
    const members = currTeam ? currTeam.members : []
    return _.filter(getters.personsSorted, p => _.map(members, Number).includes(p.id))
  },
  // 获取一个职位下的人员
  personsOfDuty: (state, getters) => (dutyId = state.dutyId) => {
    return _.filter(getters.personsSorted, p => _.some(p.listOrganizeDuty, lod => {
      return lod.dutyId === dutyId
    }))
  },
  // 获取一个角色下的人员
  personsOfRole: (state, getters) => (roleId = state.roleId) => {
    return _.filter(getters.personsSorted, p => {
      const roleIds = p.roleIds ? p.roleIds.split(',') : []
      return _.map(roleIds, Number).includes((roleId))
    })
  },
  // 获取一个角色下的人员
  personsOfRoleCode: (_state, getters) => (roleCode) => {
    return _.filter(getters.personsSorted, p => {
      const roleCodes = p.roleCodes ? p.roleCodes.split(',') : []
      return roleCodes.includes(roleCode)
    })
  },
  // 获取一个群组下的人员
  personsOfGroup: (state, getters, rootState) => (groupId = state.groupId) => {
    let currGroup = _.find(rootState.group.groups, g => g.id === Number(groupId))
    const members = currGroup ? currGroup.members : []
    return _.filter(getters.personsSorted, p => _.map(members, Number).includes(p.id))
  },
  // 获取一个咨询机构下的人员
  personsOfConsult: (state, getters, _rootState, rootGetters) => (consultOrganizeId) => {
    let currOrgPsons = _.filter(rootGetters[`consult/transactors`], g => g.id === Number(consultOrganizeId))
    return _.filter(getters.personsSorted, p => _.find(currOrgPsons, q => q.psonID === p.id))
  },
  // 前端筛选模式
  personsFiltered: (state) => {
    // 前端search过滤
    let search = state.search
    if (_.isObject(search)) {
      const organizeIds = search.organizeIds
      const roleIds = search.roleIds
      const dutyIds = search.dutyIds
      const personIds = search.personIds
      search = search.search
      return _.filter(_.values(state.persons), person =>
        (person.name && person.name.toLowerCase().includes(search.toLowerCase())) ||
        (person.pinyin && person.pinyin.toLowerCase().includes(search.toLowerCase())) ||
        (person.email && person.email.toLowerCase().includes(search.toLowerCase())) ||
        (person.phone && person.phone.includes(search)) ||
        (person.jobNumber && person.jobNumber.includes(search)) ||
        (organizeIds && _.some(person.listOrganizeDuty, lod => organizeIds.includes(lod.organizeId))) ||
        (roleIds && _.some(person.roleIds, roleId => roleIds.includes(roleId))) ||
        (dutyIds && _.some(person.listOrganizeDuty, lod => dutyIds.includes(lod.dutyId))) ||
        (personIds && personIds.includes(person.id))
      )
    } else {
      if (search) {
        return _.filter(_.values(state.persons), person =>
          (person.name && person.name.toLowerCase().includes(search.toLowerCase())) ||
          (person.pinyin && person.pinyin.toLowerCase().includes(search.toLowerCase())) ||
          (person.email && person.email.toLowerCase().includes(search.toLowerCase())) ||
          (person.phone && person.phone.includes(search)) ||
          (person.jobNumber && person.jobNumber.includes(search))
        )
      } else {
        return _.values(state.persons)
      }
    }
  },
  // 在职/离职
  personsIsInService: (state, getters) => {
    return _.filter(getters.personsFiltered, person => person.isInService === state.isInService)
  },
  // 前端排序
  personsSorted: (state, getters) => {
    return _.orderBy(getters.personsIsInService, ['dutyLevel', 'activated', state.sort], ['asc', 'desc', 'asc'])
  },
  // ----------------------------- persons：人员对象相关数据获取方法 end------------

  // ------------------------ selectPersons：下拉人员对象相关数据获取方法 start------------
  // 选择人员列表过滤
  selectPersonsFiltered: (state, _getters) => {
    return _.values(state.selectPersons)
  },
  selectPersonsSorted: (_state, getters) => {
    // 按照名字排序
    return getters.selectPersonsFiltered.sort((a, b) => {
      return String(a.name).localeCompare(String(b.name))
    })
  },
  // 获取一个角色下的人员
  selectPersonsOfRole: (state, getters) => (roleId) => {
    return _.filter(getters.selectPersonsSorted, p => {
      const roleIds = p.roleIds ? p.roleIds.split(',') : []
      return roleIds.includes(String(roleId))
    })
  },
  // 获取一个机构下的人员（本机构及子机构的人员列表）
  selectPersonsOfOrganize: (state, _getters, rootState) => (organizeId = state.organizeId, includesChildOrganize = true) => {
    let selectPersons = _.values(state.selectPersons)
    const org = rootState.organize.selectOrganizes[organizeId] || {}
    if (includesChildOrganize) {
      let arrOrgIds = org.childPath ? org.childPath.split(',') : [organizeId + '']
      return _.filter(selectPersons, p => arrOrgIds.includes(p.organizeId + ''))
    } else {
      return _.filter(selectPersons, p => p.organizeId === organizeId)
    }
  },
  // 获取一个角色下的人员
  selectPersonsOfRoleCode: (_state, getters) => (roleCode) => {
    return _.filter(getters.selectPersonsSorted, p => {
      const roleCodes = p.roleCodes ? p.roleCodes.split(',') : []
      return roleCodes.includes(roleCode)
    })
  },
  selectPersonsOfConsult: (_state, getters, _rootState, rootGetters) => (consultOrganizeId) => {
    let currOrgPsons = _.filter(rootGetters[`consult/transactors`], g => g.id === Number(consultOrganizeId))
    return _.filter(getters.selectPersonsFiltered, p => _.find(currOrgPsons, q => q.psonID === p.id))
  },
  selectPersonsOfAllConsult: (_state, getters, _rootState, rootGetters) => {
    let currOrgPsons = rootGetters[`consult/transactors`]
    return _.filter(getters.selectPersonsFiltered, p => _.find(currOrgPsons, q => q.psonID === p.id))
  },
  // ------------------------ selectPersons：下拉人员对象相关数据获取方法 end------------

  // --------------------------通讯录权限过滤人员列表Start---------------------------------
  filterPersonsByContactsAcl: (_state, _getters, _rootState, rootGetters) => persons => {
    const my = LocalStorage.getItem('myself') || {}
    let contactsSettingsItems = rootGetters['settings/contactsItems']
    if (contactsSettingsItems.forbidden.orgIds.includes(my.organizeId)) {
      persons = []
    }
    if (contactsSettingsItems.forbidden.psonIds.includes(my.id)) {
      persons = []
    }
    if (persons.length && contactsSettingsItems.limit.orgIds.includes(my.organizeId)) {
      // 本机构及其子机构的
      persons = _.filter(persons, tp => contactsSettingsItems.limit.orgIds.includes(tp.organizeId))
    }
    if (persons.length && contactsSettingsItems.limit.psonIds.includes(my.id)) {
      persons = _.filter(persons, tp => my.organizeId === tp.organizeId)
    }
    return persons
  }
  // --------------------------通讯录权限过滤人员列表End---------------------------------
}
