// import Vue from 'vue'
import request from '@/boot/axios'
import { showWarningMessage } from '@/utils/show-message'
import { i18n } from '@/boot/i18n'
import Project from './model'
import { LocalStorage, date } from 'quasar'
const { formatDate } = date
const visitedApi = []
export default {
  /**
   * 获取项目model
   * @param {*} id 项目ID：ProjectID
   */
  loadProject ({ state, commit }, id) {
    id = Number(id)
    const project = _.find(state.projects, { id })
    const api = 'projects/getmodel/' + id
    if (!project && !visitedApi.includes(api)) {
      visitedApi.push(api)
      return request.get('projects/getmodel', { id }).then(res => {
        if (res.data) {
          const model = Project.from(res.data)
          commit('updateProject', model)
          return model
        } else {
          return false
        }
      })
    } else {
      return project
    }
  },
  /**
   *
   * 获取项目列表
   * @param {*} { state, commit }
   * @param {string} [query] 查询条件
   * @param {string} [filter] 模糊查询对象
   * @param {string} [sort] 排序
   * @param {string} [search] 搜索
   * @param {string} [fields] 查询字段
   * @param {boolean} [byPage] 是否分页查询
   * @param {number} [limit] 每页记录条数
   * @param {number} [offset] 偏移记录条数
   * 如果不分页，这不用传byPage
   */
  loadProjects (
    { state, commit, rootState },
    { query,
      filter,
      sort,
      search,
      fields = 'List',
      byPage = state.byPage,
      limit = state.page.limit,
      offset = state.page.offset,
      order = state.order
    } = {}
  ) {
    // 搜索条件转换为query条件
    const page = state.page
    const condition = {
      query: JSON.stringify(query),
      filter: JSON.stringify(filter),
      search,
      fields,
      sort
    }
    Object.assign(condition, byPage ? { limit, offset, order } : {})
    let url = byPage ? 'projects/getpagelist' : 'projects/getlist'
    return request
      .get(url, condition)
      .then(res => {
        const projects = Project.from(res.data)
        commit('updatePage', {
          offset: page.offset + projects.length,
          nextPageToken: res.nextPageToken
        })
        commit('setListProjects', projects)
        return projects
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  /**
   * 获取供选择的项目信息
   * @returns
   */
  loadSelectProjects ({ state, commit }) {
    // 当没有加载过
    if (_.isEmpty(state.selectProjects) || !state.loadedSelect) {
      commit('setLoadedSelect', true)
      const _query =
        [
          { 'Key': 'IsTemplate', 'Value': 0, 'Oper': 'eq' }
        ]
      return request
        .get('/projects/getlist', { query: JSON.stringify(_query), fields: 'Select' })
        .then(res => {
          const projects = Project.from(res.data)
          // 初始化选择组件列表
          commit('updateSelectProjects', projects)
          return projects
        })
    } else {
      return state.selectProjects.all
    }
  },
  /**
   * 获取项目统计图数据公共
   */
  loadProjectDashboardData ({ state, commit }, { chart, uid }) {
    // 如果没有加载过
    let key = `${uid}-${chart.name}`
    let url = `/projects/${chart.name.toLowerCase()}`
    let projectOverView = state.dashboardRank[key]
    if (!projectOverView) {
      return request.put(url, chart)
        .then(res => {
          commit('updateDashboardRank', Object.assign({}, { key, value: res.data }))
        })
    }
  },
  /**
  * 获取项目统计图数据的详细信息
  */
  loadDetailProjectDashboardData ({ state, commit }, { chart, startDate, endDate, status, order }) {
    // 如果没有加载过
    let offset = _.cloneDeep(state.page.offset)
    let con = {
      chart,
      limit: state.page.limit,
      offset,
      order
    }
    if (startDate && endDate) {
      Object.assign(con, { startDate, endDate })
    }
    if (status) {
      Object.assign(con, { status })
    }
    return request.put('/projects/getprojectdashboarddetail', con)
      .then(res => {
        const projects = Project.from(res.data)
        commit('updatePage', {
          offset: offset + projects.length,
          nextPageToken: res.nextPageToken
        })
        commit('setListProjects', projects)
        return res.total
      })
  },
  /**
   * 获取项目排行榜
   */
  loadProjectRankData ({ state, commit }, { query }) {
    let url = `/projects/projectrank`
    let params = {}
    if (query && query.queryStart && query.queryEnd) {
      params = {
        queryStart: query.queryStart,
        queryEnd: query.queryEnd
      }
    }
    return request
      .put(url, params)
      .then(res => {
        commit('setProjectRank', res.data)
        return res.data
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`project.error.${error.userMessage}`))
        return false
      })
  },

  /**
  * 添加一个项目
  * @param {*} project 需要提交的表单数据
  */
  addProject ({ state, commit }, project) {
    return request
      .post('projects/add', Project.to(project))
      .then(res => {
        // 前台
        const model = Project.from(res.data)
        commit('addProject', model)
        return model
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`project.error.${error.userMessage}`))
        return {}
      })
  },
  /**
   * 添加一个项目从模板中
   * @param {*} project 需要提交的表单数据
   */
  addProjectFromTemplate ({ state, commit }, project) {
    return request
      .post('projects/addfromtemplate', Project.to(project))
      .then(res => {
        // 前台
        const model = Project.from(res.data)
        commit('addProject', model)
        return model
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`project.error.${error.userMessage}`))
        return {}
      })
  },
  /**
   *更新项目
   * @param {*} project 更新后需要提交的model
   */
  updateProject ({ state, commit }, project) {
    return request
      .put('projects/update', Project.to(project))
      .then(res => {
        const model = Project.from(res.data)
        commit('updateProject', model)
        return model
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`project.error.${error.userMessage}`))
        return {}
      })
  },
  /**
   * 更新指定的属性
   * @param {*} param0
   * @param {object} fields 对象，包含的字段属性和值
   */
  updateProjectField ({ state, commit }, fields) {
    let project = Project.to(fields)
    !_.has(fields, 'BeginDate') && delete project['BeginDate']
    !_.has(fields, 'EndDate') && delete project['EndDate']
    !_.has(fields, 'DeclareTime') && delete project['DeclareTime']
    !_.has(fields, 'PredictEndDate') && delete project['PredictEndDate']
    // 删除AddTemplateID和IsTemplate字段
    project = _.omit(project, ['IsTemplate'])
    return request
      .put('projects/updatefields', project)
      .then(res => {
        const model = Project.from(res.data)
        commit('updateProject', model)
        return model
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`project.error.${error.userMessage}`))
        return {}
      })
  },
  /**
  * 更新立项/结项字段
  * @param {*} param0
  * @param {*} payload:包含项目ID，立项时间或结项时间或预计结项时间,立项/结项说明
  */
  updateStartOrDone ({ state, commit }, payload) {
    return request.put('projects/updatestartordone', payload)
      .then(res => {
        const model = Project.from(res.data)
        commit('updateProject', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return {}
      })
  },
  /**
   * 更新项目成员
   * @param {*} id:项目ID
   * @param {*} newMemberIds： 目前项目成员的IDs的集合
   * @param {*} oldMemberIds： 原项目成员的IDs的集合
   * @param {*} identify 成员职位
   */
  updateProjectMembers ({ state, commit }, { id, newMemberIds, oldMemberIds, identify }) {
    return request
      .put('projects/updatemember', {
        id,
        newMemberIds: _.join(newMemberIds),
        oldMemberIds: _.join(oldMemberIds),
        identify: identify
      })
      .then(res => {
        const model = Project.from(res.data)
        commit('updateProject', model)
        return model
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`project.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * 更新项目状态，挂起/激活
   * @param {*} param0
   * @param {*} payload ProjectID:项目ID，State：项目状态
   */
  updateStatus ({ state, commit }, { ProjectID, Status, Reason }) {
    return request
      .put('projects/updatestate', { ProjectID, Status, Reason })
      .then(res => {
        const model = Project.from(res.data)
        commit('updateProject', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return {}
      })
  },
  /**
 * 删除一个项目
 * @param {*} param0 --
 * @param {*} { id, notes = '' }有两个参数或者一个参数
 */
  deleteProject ({ state, commit }, { id, notes = '' }) {
    if (!id && arguments.length === 2) {
      id = arguments[1]
    }
    return request
      .delete('projects/delete', { id, notes })
      .then(res => {
        const deleteModel = _.find(state.listProjects, { id })
        commit('deleteProject', id)
        commit('template/deleteTemplate', { id, objectType: 'project' }, { 'root': true })
        // 如果是在卡片中删除，在哪删除就在哪呆着，如果是详情页删除，跳到home或archivedHome
        const route = this.$router.currentRoute
        if (route.name === 'projectDetail') {
          route.path.includes('archived')
            ? this.$router.push({ name: 'archivedProjects' })
            : deleteModel.isTemplate
              ? this.$router.push({ name: 'projectTemplateManage' })
              : this.$router.push({ name: 'projectList' })
        }
        return true
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`project.error.${error.userMessage}`))
      })
  },

  loadArchivedCount ({ state, commit }) {
    const _query = [
      { Key: 'Archived', Value: 1, Oper: 'eq' }]
    let condition = { query: JSON.stringify(_query) }
    state.search && Object.assign(condition, { search: state.search })
    request
      .get('projects/getcount', condition)
      .then(res => {
        commit('setArchivedCount', res.data)
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
      })
  },
  /**
   * 归档项目
   * @param {*} ID 项目ID
   */
  archiveProject ({ commit, rootState }, id) {
    return request
      .get(`projects/archive`, { id })
      .then(res => {
        const model = Project.from(res.data)
        commit('updateProject', model)
        let archivedCount = 0
        if (rootState.template.archivedCount['project']) {
          archivedCount = rootState.template.archivedCount['project'].count + 1
        }
        commit('template/updateTemplate', Object.assign(model, { objectType: 'project' }), { 'root': true })
        commit('template/setArchivedCount', { category: 'project', count: archivedCount }, { 'root': true })
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return {}
      })
  },
  /**
   * 解档一个项目
   * @param {*} ID 项目ID
   */
  unarchiveProject ({ commit, rootState }, id) {
    request
      .get(`projects/unarchive`, { id })
      .then(res => {
        const model = Project.from(res.data)
        let archivedCount = 0
        if (rootState.template.archivedCount['project']) {
          archivedCount = rootState.template.archivedCount['project'].count - 1
        }
        commit('updateProject', model)
        commit('template/updateTemplate', Object.assign(model, { objectType: 'project' }), { 'root': true })
        commit('template/setArchivedCount', { category: 'project', count: archivedCount }, { 'root': true })
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return {}
      })
  },
  /** ************************************************************************************************/
  /** ************************************* 废纸篓（项目）start ***************************************/
  /** ************************************************************************************************/
  /**
   * 取消删除
   * @param {*} param0
   * @param {*} id
   * @returns
   */
  undeleteProject ({
    state,
    commit
  }, id) {
    return request.get('/projects/Undelete', { id })
      .then(res => {
        if (res.data) {
          let project = Project.from(res.data)
          commit('addProject', project)
          commit('undeleteProjectInTrash', id)
          return project
        } else {
          return false
        }
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /**
   *获取与我相关的已删除项目
   * @param {*} param0
   * @returns
   */
  loadProjectsInMyTrash ({
    state,
    commit
  }) {
    const my = LocalStorage.getItem('myself')
    const time = formatDate(new Date() - 3600 * 1000 * 24 * 90, 'YYYY-MM-DD HH:mm:ss')
    const query = [
      [
        { Key: 'DeleteBy', Value: my.name, Oper: 'eq' },
        'Or',
        { Key: 'CreateBy', Value: my.name, Oper: 'eq' },
        'Or',
        { Key: 'Members ->\'$.all\'', Value: _.toString(my.id), Oper: 'search' }
      ],
      'And',
      [
        { Key: 'DeleteTime', Value: time, Oper: 'ge' }
      ]
    ]
    return request.get('/projects/GetDeletedList', { query: JSON.stringify(query) }).then(res => {
      let list = Project.from(res.data)
      commit('addProjectsTrash', list)
      return list
    }).catch(error => {
      error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      return false
    })
  }
  /** ************************************************************************************************/
  /** ************************************* 废纸篓（项目）end *****************************************/
  /** ************************************************************************************************/
}
