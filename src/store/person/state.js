
import { i18n } from '@/boot/i18n'
export default {
  // 模糊查询
  search: '',
  // 排序
  sort: 'pinyin',
  // 参与排序的对象列表
  sortOptions: [
    {
      label: '姓名',
      value: 'pinyin'
    },
    {
      label: '职位等级',
      value: 'dutyLevel'
    },
    {
      label: '机构名称',
      value: 'organizeName'
    }
  ],
  // 是否在职/离职
  isInService: 1,
  // 参与在职/离职的对象列表
  isInServiceOptions: [
    {
      label: i18n.t('person.onJob'),
      value: 1
    },
    {
      label: i18n.t('person.leaveOffice'),
      value: 0
    }
  ],
  // 是否分页
  byPage: false,
  
  // 人员分页（不区分类别）
  page: {
    offset: 0,
    limit: 12,
    total: 0,
    nextPageToken: -1 // 下一页数据起始页PsonID,如果没有数据了，则为-1
  },
  selectPage: {
    offset: 0,
    limit: 500,
    total: 0,
    nextPageToken: -1 // 下一页数据起始页PsonID,如果没有数据了，则为-1
  },
  // 前端人员库
  persons: {},

  // 加载选择组件所需要的系统所有人员
  selectPersons: {},

  // 类别ID
  organizeId: 0,
  teamId: 0,
  dutyId: 0,
  roleId: 0,
  groupId: 0,

  myQuickLinksDefault: [
    {
      name: 'team',
      show: true
    },
    {
      name: 'project',
      show: true
    },
    {
      name: 'productDev',
      show: true
    }
  ]
}
