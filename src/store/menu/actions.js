import i18n from '@/boot/i18n'
import promptDelete from '@/utils/prompt-delete'
import { format } from 'quasar'
import { showConfirm } from '@/utils/show-confirm'
const { capitalize } = format
export default {
  edit ({ state }, { category, id }) {
    this.$router.push({
      name: `${category}${isTemplate ? 'Template' : ''}Edit`,
      params: { category: category, id: Number(id), openType: 'edit' }
    })
  },
  delete ({ state }, { category, id, status = '', isBookmark = false }) {
    if (status) {
      promptDelete.call(this, { category, id })
    } else {
      showConfirm(i18n.t('action.reallyDelete'), () => {
        this.$store.dispatch(`${category}/delete${capitalize(category)}`, id)
          .then(res => {
            // todo 后面在后台给删除做切面，统一在后台处理删除收藏
            if (isBookmark) {
              let query = [
                { Key: 'Owner', Value: this.$myinfo.id, Oper: 'eq' },
                'and',
                { Key: 'ObjectID', Value: +id, Oper: 'eq' },
                'and',
                { Key: 'ObjectType', Value: category, Oper: 'eq' }
              ]
              this.$store.dispatch('bookmark/deleteBookmark', query)
            }
          })
      }, () => { })
    }
  },
  setWidgets ({ state }, { category, id }) {
    this.$router.push({
      name: 'widgetSetting',
      params: { objectID: Number(id), category: category }
    })
  },
  archive ({ state }, { category, id }) {
    this.$store.dispatch(`${category}/archive${capitalize(category)}`, +id)
  }
}
