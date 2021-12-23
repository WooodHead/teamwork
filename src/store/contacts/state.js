
import { i18n } from '@/boot/i18n'
import custom from '@/boot/custom'
const selects = [
  { id: 1, label: '机构', icon: 'group', color: 'teal', name: 'organize', group: 'organize', used: true, data: [], selected: true },
  { id: 2, label: '团队', icon: 'group', color: 'info', name: 'team', group: 'team', used: true, data: [], selected: false },
  { id: 3, label: '角色', icon: 'group', color: 'primary', name: 'role', group: 'role', used: true, data: [], selected: false },
  { id: 4, label: '职位', icon: 'group', color: 'primary', name: 'duty', group: 'duty', used: true, data: [], selected: false },
  { id: 5, label: '群组', icon: 'group', color: 'teal', name: 'group', group: 'group', used: true, data: [], selected: false },
  { id: 6, label: i18n.t('consult.module'), icon: 'app:tw-icon-consult', color: 'light-green', name: 'consult', group: 'service', used: false, data: [], selected: false }
]
custom.hasService &&
  selects.push({ id: 7, label: i18n.t('service.module'), icon: 'app:tw-icon-service', color: 'primary', name: 'service', group: 'service', used: false, data: [], selected: false })
export default {
  // 全局类型列表
  selects: selects,
  // 节点选中定义
  selectedOrganize: 0,
  selectedTeam: 0,
  selectedRole: 0,
  selectedDuty: 0,
  selectedGroup: 0,

  // 移动端首页数据获取
  mhome: { organize: [], service: [], teamGroup: [], frequentContact: [] }

}
