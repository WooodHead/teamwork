import { i18n } from '../boot/i18n'
/**
 * 导航菜单的分组最大数量
 */
const maxIndexGroup = 10
/**
 * 导航菜单的分组
 */
const group = new Map()
group
  .set('index', { index: 0, label: i18n.t('app.moduleGroup.index') })
  .set('oa', { index: 1, label: i18n.t('app.moduleGroup.oa') })
  .set('rd', { index: 2, label: i18n.t('app.moduleGroup.rd') })
  .set('crm', { index: 3, label: i18n.t('app.moduleGroup.crm') })
  .set('tool', { index: 4, label: i18n.t('app.moduleGroup.tool') })
  .set('jd', { index: 5, label: i18n.t('app.moduleGroup.jd') })
  .set('job', { index: 6, label: i18n.t('app.moduleGroup.job') })
  .set('system', { index: maxIndexGroup, label: i18n.t('app.moduleGroup.system') })
  .set('finance', { index: 7, label: i18n.t('app.moduleGroup.finance') })
  .set('hr', { index: 8, label: i18n.t('app.moduleGroup.hr') })
  .set('thirdparty', { index: 9, label: i18n.t('app.moduleGroup.thirdparty') })

export default group
export { maxIndexGroup, group }
