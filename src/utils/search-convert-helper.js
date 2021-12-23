/**
 * 搜索转人员Id列表
 * @param {*} getters 
 * @param {*} search 搜索关键字
 * @returns 人员Ids
 */
function searchToPersonIds (getters, search) {
  // 人员列表 
  let persons = getters['person/getMatchList'](search)
  let personIds = _.map(persons, 'id').toString() || ''
  return personIds
}
/**
 * 搜索转机构Id列表
 * @param {*} getters 
 * @param {*} search 
 * @returns 机构Ids
 */
function searchToOrganizeIds (getters, search) {
  // 机构列表
  let organizes = getters['organize/getMatchList'](search)
  return _.map(organizes, 'id').toString() || ''
}
export { searchToPersonIds, searchToOrganizeIds }
