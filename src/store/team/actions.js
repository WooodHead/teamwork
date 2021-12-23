import request from '@/boot/axios'
import { showWarningMessage } from '@/utils/show-message'
import Team from './model'
import { LocalStorage, date } from 'quasar'
const { formatDate } = date
import { i18n } from '@/boot/i18n'
const visitedApi = []
export default {
  /**
   * 获取ID指定团队
   * @param {*} id
   */
  loadTeam ({ state, commit }, id) {
    id = Number(id)
    const team = _.find(state.teams, { id })
    const api = 'teams/getmodel/' + id
    if (!team && !visitedApi.includes(api)) {
      visitedApi.push(api)
      return request.get('teams/getmodel', { id })
        .then((res) => {
          const model = Team.from(res.data)
          commit('addTeam', model)
          return model
        })
        .catch((error) => {
          error.userMessage && showWarningMessage(i18n.t(`team.error.${error.userMessage}`))
          return false
        })
    } else {
      return team
    }
  },
  /**
   *
   * 获取团队列表
   * @param {*} { state, commit }
   * @param {string} [query] 查询条件
   * @param {string} [filter] 模糊查询对象
   * @param {string} [sort] 排序
   * @param {string} [search] 搜索
   * @param {string} [fields] 查询字段
   * @param {number} [limit] 每页记录条数
   * @param {number} [offset] 偏移记录条数
   */
  loadTeams ({ state, commit }, {
    query,
    filter,
    sort,
    search,
    fields = 'List',
    limit = state.page.limit,
    offset = state.page.offset,
    byPage = state.byPage
  } = {}) {
    // 搜索条件转换为query条件
    if (search) {
      let okPersons = this.getters['person/getMatchList'](search)
      let okPersonsIds = _.map(okPersons, 'id').toString()
      query.push('And')
      let searchQuery = []
      // 拼人员条件
      okPersonsIds && searchQuery.push({ Key: 'LeaderID', Value: okPersonsIds, Oper: 'in' })

      // 拼机构条件
      let okOrganizes = this.getters['organize/getMatchList'](search)
      let okOrganizesIds = _.map(okOrganizes, 'id').toString()
      if (okOrganizesIds) {
        okPersonsIds && searchQuery.push('Or')
        searchQuery.push({ Key: 'OrganizeID', Value: okOrganizesIds, Oper: 'in' })
      }
      // 拼名称条件
      if (okPersonsIds || okOrganizesIds) { searchQuery.push('Or') }
      searchQuery.push({ Key: 'Title', Value: `%${search}%`, Oper: 'like' })
      searchQuery.push('Or', { Key: 'Code', Value: `%${search}%`, Oper: 'like' })
      searchQuery.push('Or', { Key: 'Notes', Value: `%${search}%`, Oper: 'like' })
      query.push(searchQuery)
      search = ''
    }
    let params = {}, url = '', page = state.page
    if (byPage) {
      params = {
        limit: limit,
        offset: offset,
        filter: JSON.stringify(filter),
        query: JSON.stringify(query),
        search: search,
        sort: sort,
        fields: fields
      }
      url = 'teams/getpagelist'
    } else {
      params = {
        filter: JSON.stringify(filter),
        query: JSON.stringify(query),
        search: search,
        fields: fields
      }
      url = 'teams/getlist'
    }
    return request.get(url, params)
      .then(res => {
        let teams = Team.from(res.data)
        commit('setPage', {
          offset: page.offset + teams.length, nextPageToken: res.nextPageToken
        })
        commit('setListTeams', teams)
        return teams
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`team.error.${error.userMessage}`))
      })
  },
  /***
   * 获取供选择的团队信息
   */
  loadSelectTeams ({ state, commit }) {
    if (_.isEmpty(state.selectTeams) || !state.loadedSelect) {
      commit('setLoadedSelect', true)
      const _query =
        [
          { 'Key': 'IsTemplate', 'Value': 0, 'Oper': 'eq' }
        ]
      return request.get('/teams/getlist', { query: JSON.stringify(_query), fields: 'Select' }).then(res => {
        const teams = Team.from(res.data)
        commit('updateSelectTeams', teams)
        return teams
      }).catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`team.error.${error.userMessage}`))
        return false
      })
    } else {
      return state.selectTeams.all
    }
  },

  /**
   * * 获取系统所有未删除的团队信息，与当前用户的角色无关
   * 业务特有
   * @param {*} { state, commit }
   * @param {*} [{ fields = 'List', orderby = '' }={}]
   * @returns
   */
  loadAllTeams ({ state, commit }, { fields = 'List', orderby = '' } = {}) {
    if (!state.allTeams.length) {
      return request.get('/teams/getalllist', { fields: fields, orderby: orderby }).then(res => {
        let teams = Team.from(res.data)
        commit('setAllTeams', teams)
        return teams
      }).catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`team.error.${error.userMessage}`))
        return false
      })
    } else {
      return state.allTeams
    }
  },
  /**
   * 新建团队
   * @param {Object} team 新建的团队对象
   */
  addTeam ({ state, commit }, team) {
    return request.post('teams/add', Team.to(team))
      .then(res => {
        const model = Team.from(res.data)
        commit('addTeam', model)
        return model
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`team.error.${error.userMessage}`))
        return false
      })
  },
  /**
* 添加一个团队从模板中
* @param {*} project 需要提交的表单数据
*/
  addTeamFromTemplate ({ state, commit }, team) {
    return request
      .post('teams/addfromtemplate', Team.to(team))
      .then(res => {
        // 前台
        const model = Team.from(res.data)
        commit('addTeam', model)
        return model
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`productDev.error.${error.userMessage}`))
        return {}
      })
  },
  /**
   * 编辑团队
   * @param {Object} param0 --
   * @param {Object} team 编辑后的团队对象
   */
  updateTeam ({ state, commit }, team) {
    return request.put('teams/update', Team.to(team))
      .then(res => {
        const model = Team.from(res.data)
        commit('updateTeam', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`team.error.${error.userMessage}`))
        return false
      })
  },
  /**
 * 更新团队成员
 * @param {*} id:团队ID
 * @param {*} personIDs： 团队成员的IDs的集合
 */
  updateTeamMembers ({ state, commit }, { id, personIDs, identify }) {
    return request.put('teams/updatemember', {
      id,
      personIDs: _.join(personIDs),
      identify: identify
    })
      .then(res => {
        const model = Team.from(res.data)
        commit('updateTeam', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`team.error.${error.userMessage}`))
        return false
      })
  },
  /**
   *  更新团队字段
   * @param {*} param0
   * @param {*} param1
   */
  updateTeamField ({ state, commit }, fields) {
    let team = Team.to(fields)
    // 删除AddTemplateID和IsTemplate字段
    team = _.omit(team, ['IsTemplate'])
    return request.put('teams/updatefields', team)
      .then(res => {
        const model = Team.from(res.data)
        commit('updateTeam', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`team.error.${error.userMessage}`))
        return {}
      })
  },

  /**
   * 删除一个团队
   * @param {Object} param0 --
   * @param {Number} id 团队id
   */
  deleteTeam ({ state, commit }, id) {
    return request.delete('teams/delete', { id })
      .then((res) => {
        const deleteModel = _.find(state.listTeams, { id })
        commit('deleteTeam', id)
        commit('template/deleteTemplate', { id, objectType: 'team' }, { 'root': true })
        // 如果是在卡片中删除，在哪删除就在哪呆着，如果是详情页删除，跳到home或archivedHome
        const route = this.$router.currentRoute
        if (route.name === 'teamDetail') {
          route.path.includes('archived')
            ? this.$router.push({ name: 'archivedTeams' })
            : deleteModel.isTemplate
              ? this.$router.push({ name: 'teamTemplateManage' })
              : this.$router.push({ name: 'teamHome' })
        }
        return true
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`team.error.${error.userMessage}`))
        return false
      })
  },

  /**
 * 解删除一个团队
 * @param {Object} param0 --
 * @param {Number} id 团队id
 */
  undeleteTeam ({ state, commit }, id) {
    return request.get('teams/undelete', { id })
      .then((res) => {
        let team = Team.from(res.data)
        commit('addTeam', team)
        commit('undeleteTeamInTrash', team)
        return team
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`team.error.${error.userMessage}`))
        return false
      })
  },

  /**
* 加载归档数量
*/
  loadArchivedCount ({ state, commit }) {
    const _query = [
      { Key: 'Archived', Value: 1, Oper: 'eq' }]
    let condition = { query: JSON.stringify(_query) }
    state.search && Object.assign(condition, { search: state.search })
    request.get('teams/getcount', condition)
      .then((res) => {
        commit('setArchivedCount', res.data)
      })
      .catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`team.error.${error.userMessage}`))
      })
  },
  /**
* 归档团队
* @param {*} ID 团队ID
*/
  archiveTeam ({ commit, rootState }, id) {
    return request.get(`teams/archive`, { id })
      .then(res => {
        const model = Team.from(res.data)
        commit('updateTeam', model)
        let archivedCount = 0
        if (rootState.template.archivedCount['team']) {
          archivedCount = rootState.template.archivedCount['team'].count + 1
        }
        commit('template/updateTemplate', Object.assign(model, { objectType: 'team' }), { 'root': true })
        commit('template/setArchivedCount', { category: 'team', count: archivedCount }, { 'root': true })
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`team.error.${error.userMessage}`))
        return {}
      })
  },
  /**
 * 解档一个团队
 * @param {*} ID 团队ID
 */
  unarchiveTeam ({ commit, rootState }, id) {
    request.get(`teams/unarchive`, { id })
      .then(res => {
        const model = Team.from(res.data)
        commit('updateTeam', model)
        if (rootState.template.archivedCount['team']) {
          archivedCount = rootState.template.archivedCount['team'].count - 1
        }
        commit('template/updateTemplate', Object.assign(model, { objectType: 'team' }), { 'root': true })
        commit('template/setArchivedCount', { category: 'team', count: archivedCount }, { 'root': true })
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`team.error.${error.userMessage}`))
        return {}
      })
  },

  // 是否存在数据。首页判断是否存在我的数据，如果存在则显示，如果不存在，查询所有数据。如果所有数据仍不存在，则显示我的数据。
  existMyTeam ({ state, commit }) {
    let myTeams = []
    if (!_.isEmpty(state.listTeams)) myTeams = state.listTeams.filter(a => !a.archived && _.indexOf(a.members.map(Number), LocalStorage.getItem('myself').id) >= 0)
    if (!_.isEmpty(myTeams)) return 1
    // 如果我的不存在，有两种情况：1、确实没有我的数据；2、state里面存储的是已归档的数据，即从归档界面跳转至首页。所以需要在数据库里面查询
    const query = [
      { 'Key': 'Members ->\'$.all\'', 'Value': _.toString(LocalStorage.getItem('myself').id), 'Oper': 'search' },
      'and',
      { Key: 'Archived', Value: 0, Oper: 'eq' },
      'and',
      { 'Key': 'IsTemplate', 'Value': 0, 'Oper': 'eq' }]
    return request.get('teams/exists', { query: JSON.stringify(query) })
      .then((res) => {
        return res.data
      })
      .catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`team.error.${error.userMessage}`))
        return false
      })
  },

  /** ------------------------------废纸篓 start------------------ */
  // 获取与我相关的已删除的团队
  loadTeamsInMyTrash ({ state, commit }) {
    const time = formatDate(new Date() - 3600 * 1000 * 24 * 90, 'YYYY-MM-DD HH:mm:ss')
    const query = [
      { Key: 'DeleteTime', Value: time, Oper: 'ge' }
    ]
    return request.get('teams/getdeletedlist', { query: JSON.stringify(query) })
      .then((res) => {
        let list = Team.from(res.data)
        commit('addTeamsInTrash', list)
        return list
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  }

}
