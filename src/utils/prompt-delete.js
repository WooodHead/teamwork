import { format } from 'quasar'
const { capitalize } = format
/**
 * 弹出删除说明的填写提示，调用
 * @param {*} param0
 */
export default function prompt ({ category, id }) {
  this.$q.dialog({
    title: '请填写删除原因(必填，至少3个字符)',
    prompt: {
      model: '',
      isValid: val => val.length > 2,
      type: 'text' // optional
    },
    cancel: true,
    persistent: true
  }).onOk(data => {
    this.$store.dispatch(`${category}/delete${capitalize(category)}`, { id: id, notes: data })
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}
