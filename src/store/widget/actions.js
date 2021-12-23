import { i18n } from '@/boot/i18n'
import { showWarningMessage } from '@/utils/show-message'
export default {
  /**
   * 打开工具卡片列表页面
   * @param {*} widgetType 工具类型：‘document、notice’
   * @param {*} category 模块类型：‘project、team、product’
   * @param {*} objectID  模块ID：‘ProductID、ProjectID、TeamID’
   */
  routeWidget ({ state, rootGetters }, { widget, category, objectID }) {
    let model = rootGetters[`${category}/${category}`](objectID)
    if (model.isTemplate && !['task', 'document', 'notice', 'checkins'].includes(widget)) {
      showWarningMessage(i18n.t('template.templateWidgetNoSupport'))
      return false
    }
    // widget详情页跳转
    if (['team', 'project', 'productDev', 'customer'].includes(widget)) {
      this.$router.push({
        name: 'resourceRelation',
        params: { category: category, objectID: Number(objectID), relates: widget }
      })
    } else if (['order', 'opportunity'].includes(widget)) {
      this.$router.push({
        name: 'customerRelation',
        params: { category: category, objectID: Number(objectID), relates: widget }
      })
    } else if (category === 'wiki' && widget === 'document') {
      const element = document.getElementsByClassName('q-breadcrumbs')
      element && element[0].click()
    } else {
      // 处理路由名称与widget传值不一致的情况
      let curWidget = widget
      if (widget === 'opportunityAssess') {
        curWidget = 'assess'
      } else if (widget === 'productionDemand') {
        curWidget = 'allocation'
      } else if (widget === 'customerInfo') {
        curWidget = 'customerInfo'
      }
      this.$router.push({
        name: curWidget,
        params: { category: category, objectID: Number(objectID) }
      })
    }
  }
}
