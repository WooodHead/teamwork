import { defaultsDeep } from 'lodash'
import copywriting from './copywriting/copywriting.js'
const organize = {
  module: '机构管理',
  title: '机构',
  notes: '在这里管理所有机构',
  field: {
    label: {
      type: '归属于'
    },
    placeholder: {

    },
    hint: {

    },
    rule: {

    }
  },
  add: '新建机构',
  update: '编辑机构',
  organizeManage: '机构管理',
  leader: '负责人',
  editCerify: {
    leader: '请选择机构负责人'
  },
  messageTip: '是否将机构地址同步到子级机构？'
}

export default defaultsDeep(copywriting.organize, organize)
