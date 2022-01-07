
import { defaultsDeep } from 'lodash'
import copywriting from './copywriting/copywriting.js'
const productDev = {
  module: '产品管理',
  title: '产品',
  notes: '产品的研发之路是漫长的，整个产品生命周期里的点点滴滴，在这里记录起来吧，目前暂无数据。',
  field: {
    label: {
      notes: '描述'
    },
    placeholder: {
      title: '输入标题',
      notes: '描述...'
    }
  },
  add: '新建产品',
  addFromTemplate: '从模板中新建产品',
  update: '编辑产品',
  sortBy: {
    myFocus: '默认排序',
    type: '按类型排序',
    title: '按标题排序',
    productDevNum: '按编号排序',
    status: '按状态排序',
    beginDate: '按开始日期排序',
    predictEndDate: '按预计结束日期排序',
    organizeName: '按机构排序'
  },
  search: '搜索',
  relate: '关联产品',

  moreInfo: '补充更多信息',
  leader: '负责人',
  type: '类型',
  editCerify: {
    title: '请输入标题',
    leader: '请选择产品负责人',
    type: '请选择类型'
  },
  predictEndDate: '预计结束日期',
  approval: '立项',
  finish: '结项',
  suspended: '挂起',
  activate: '激活',
  selectDate: '请选择日期',
  exportHour: '工时结算',
  searchPlaceholder: '搜索标题/机构/负责人',
  archive: '归档'
}

export default defaultsDeep(copywriting.productDev, productDev)
