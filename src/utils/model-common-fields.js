import _ from 'lodash'
// 后台公共字段
const commonFieldsOfEnd = {
  CreateTime: 'createTime',
  CreateBy: 'createBy',
  ModifyTime: 'modifyTime',
  ModifyBy: 'modifyBy',
  IsDelete: 'deleted',
  DeleteTime: 'deleteTime',
  DeleteBy: 'deleteBy',
  Archived: 'archived',
  ArchiveTime: 'archiveTime',
  ArchiveBy: 'archiveBy',
  ParentID: 'parentId',
  Level: 'level',
  Path: 'path'
}
// 前台公共字段
const commonFieldsOfFront = _.invert(commonFieldsOfEnd)

/**
 * 将后台取到的数据转换为前台数据类型
 * @param {Object} end 后台对象
 */
function from (end) {
  // 传入属性与公共属性取交集
  const intersect = _.intersection(Object.keys(commonFieldsOfEnd), Object.keys(end))
  let commonFields = {}
  _(intersect).forEach((field) => {
    ['IsDelete', 'Archived'].includes(field)
      ? commonFields[commonFieldsOfEnd[field]] = !!end[field]
      : commonFields[commonFieldsOfEnd[field]] = end[field]
  })
  return commonFields
}
/**
 * 将前台取到的数据转换为后台数据类型
 * @param {Object} front 前台对象
 */
function to (front) {
  // 2、传入属性与公共属性取交集
  const intersect = _.intersection(Object.keys(commonFieldsOfFront), Object.keys(front))
  let commonFields = {}
  _(intersect).forEach((field) => {
    ['deleted', 'archived'].includes(field)
      ? commonFields[commonFieldsOfFront[field]] = (front[field] ? 1 : 0)
      : commonFields[commonFieldsOfFront[field]] = front[field]
  })
  return commonFields
}
export default { from, to }
