import { listToTree } from '@/utils/list-to-tree'
import { LocalStorage } from 'quasar'
export default {
  // 获取机构对象
  organize: (_state, getters) => (id) => {
    return _.find(getters.organizes, c => c.id === +id) || {}
  },
  // 获取机构列表
  organizes: (_state, getters) => {
    return getters.organizesFiltered
  },
  // 获取根据search匹配的数据
  getMatchList: (_state, getters) => search => {
    return _.filter(getters.selectOrganizes, value => value.name.includes(search))
  },
  // 选择下拉数据列表
  selectOrganizes: (state, _getters, _rootState, _rootGetters) => {
    return _.values(state.selectOrganizes)
  },
  // 选择下拉数据树
  selectOrganizesTree: (_state, getters, _rootState, _rootGetters) => {
    return listToTree(_.cloneDeep(getters.selectOrganizes), 'id', 'parentId')
  },
  // 获取本机构相关联的上级和下级机列表
  selectOrganizesRelation: (_state, getters) => (organizeId) => {
    var currOrg = _.find(getters.selectOrganizes, org => org.id === organizeId)
    var beforeList = _.filter(getters.selectOrganizes, org => currOrg && currOrg.path.split(',').includes(String(org.id)))
    var afterList = _.filter(getters.selectOrganizes, org => org.path.split(',').includes(String(organizeId)))
    let result = currOrg ? _.concat(beforeList, [currOrg], afterList) : _.concat(beforeList, afterList)
    return _.uniqBy(result, 'id')
  },
  // 获取本机构相关联的上级和下级机构树
  selectOrganizesRelationTree: (_state, getters) => (organizeId) => {
    return listToTree(_.cloneDeep(getters.selectOrganizesRelation(organizeId)), 'id', 'parentId')
  },
  // 获取本机构及其子机构下的树状组织数据列表
  selectOrganizesChild: (_state, getters) => (organizeId) => {
    return _.filter(getters.selectOrganizes, o => o.path.split(',').includes(String(organizeId)))
  },
  selectOrganizesChildTree: (_state, getters) => (organizeId) => {
    var afterList = _.filter(getters.selectOrganizesChild(organizeId), o => o.path.split(',').includes(String(organizeId)))
    return listToTree(_.cloneDeep(afterList), 'id', 'parentId')
  },
  // 获取员工orgdutyList中机构IDs及其子机构的树状组织数据列表
  selectOrganizesChildTreeByOrganizeIds: (_state, getters) => (organizeIds) => {
    let childPaths = _.filter(getters.selectOrganizes, o => organizeIds.split(',').indexOf(String(o.id)) >= 0).map(r => { return r.childPath })
    let allOrganizeIds = _.uniq(_.join(childPaths, ',').split(',')).map(r => { return _.toNumber(r) })
    let afterList = _.filter(getters.selectOrganizes, o => allOrganizeIds.indexOf(o.id) >= 0)
    return listToTree(_.cloneDeep(afterList), 'id', 'parentId')
  },
  // 前端筛选
  organizesFiltered: (state, _getters, _rootState, _rootGetters) => {
    let search = state.search
    let organizes = _.values(state.organizes)
    if (_.isObject(search)) {
      const organizeIds = search.organizeIds
      search = search.search
      return _.filter(organizes, organize =>
        organize.name.toLowerCase().includes(search.toLowerCase()) ||
        organize.shortName.toLowerCase().includes(search.toLowerCase()) ||
        organizeIds.includes(organize.id)
      )
    } else {
      if (search) {
        return _.filter(organizes, organize =>
          organize.name.toLowerCase().includes(search.toLowerCase()) ||
          organize.shortName.toLowerCase().includes(search.toLowerCase())
        )
      } else {
        return organizes
      }
    }
  },
  // 我的废纸篓
  OrganizesInMyTrash: (state) => {
    const my = LocalStorage.getItem('myself') || {}
    let list = state.organizesInTrash.filter(item => item.createBy === my.name || item.deleteBy === my.name)
    list = _.filter(list, item => {
      return item.classify !== 'customer'
    })
    list.map(item => {
      item.resourceType = 'organize'
    })
    return _.sortBy(list, ['deleteTime'], ['desc'])
  },
  // --------------------------通讯录权限过滤机构列表Start---------------------------------
  filterOrganizesByContactsAcl: (_state, _getters, _rootState, rootGetters) => organizes => {
    let contactsSettingsItems = rootGetters['settings/contactsItems']
    const my = LocalStorage.getItem('myself') || {}
    if (contactsSettingsItems.forbidden.orgIds.includes(my.organizeId)) {
      organizes = []
    }
    if (contactsSettingsItems.forbidden.psonIds.includes(my.id)) {
      organizes = []
    }
    if (organizes.length && contactsSettingsItems.limit.orgIds.includes(my.organizeId)) {
      organizes = _.filter(organizes, org => !!(_.intersectionBy(org.path.split(','), contactsSettingsItems.limit.orgIds, Number).length))
    }
    if (organizes.length && contactsSettingsItems.limit.psonIds.includes(my.id)) {
      organizes = _.filter(organizes, org => !!(_.intersectionBy(org.path.split(','), [my.organizeId], Number).length))
    }
    return organizes
  }
  // --------------------------通讯录权限过滤机构列表Start---------------------------------
}
