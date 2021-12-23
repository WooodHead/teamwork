/**
 * input元素的全选中指令
 */
export const selectAll = {
  inserted (el) {
    const input = el.querySelector('.q-field__native')
    input.addEventListener('focus', () => {
      if (input.value.length) {
        input.select()
      }
    })
  }
}
