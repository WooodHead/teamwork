import { defaultsDeep } from 'lodash'
import copywriting from './copywriting/copywriting.js'
const title = '知识库'
const wiki = {
  module: title,
  noWikiNotes: `目前${title}无数据`,
  title: title,
  notes: `${title}是一个面向组织的知识管理系统。通过结构化沉淀高价值信息，形成组织完整的知识体系。通过便捷地分享和传播，轻松提升知识的流转效率，更好地成就组织和个人。`,
  action: {
    add: '新增知识空间',
    updateSnapshot: '知识空间设置'
  },
  sortBy: {},
  field: {
    label: {
      title: '',
      notes: ''
    },
    placeholder: {
      title: '名称',
      notes: '简介'
    },
    hint: {
      title: ''
    },
    rule: {
      title: ''
    }
  },
  formCerifyRule: {
    title: '名称不能为空',
    notes: '简介不能为空'
  }
}
export default defaultsDeep(copywriting.wiki, wiki)
