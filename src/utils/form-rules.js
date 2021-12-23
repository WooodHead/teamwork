import { i18n } from '../boot/i18n'
// #region  数值规则
// 数字
export function numeric (val) {
  return new RegExp('^[0-9]*$').test(val) || i18n.t('rule.num')
}

// 整数
export function intNum (val) {
  return new RegExp('^-?[1-9]+[0-9]*$|^0$').test(val) || i18n.t('rule.intNum')
}

// 正整数
export function positiveIntNum (val) {
  return new RegExp('^[1-9]+[0-9]*$').test(val) || i18n.t('rule.positiveIntNum')
}

// 非负整数（正整数 + 0）
export function nonNegativeIntNum (val) {
  return new RegExp('^[1-9]+[0-9]*$|^0$').test(val) || i18n.t('rule.nonNegativeIntNum')
}

// 正数
export function positiveNum (val) {
  return new RegExp('^(0\\.0*[1-9]+[0-9]*$|[1-9]+[0-9]*\\.[0-9]*[0-9]$|[1-9]+[0-9]*$)').test(val) ||
    i18n.t('rule.positiveNum')
}

// 非负数
export function nonNegativeNum (val) {
  return new RegExp('^(0\\.0*[1-9]+[0-9]*$|[1-9]+[0-9]*\\.[0-9]*[0-9]$|[1-9]+[0-9]*$)|^0$').test(val) ||
    i18n.t('rule.nonNegativeNum')
}

// 手机号校验
export function mobilePhoneRules () {
  return [
    val => !!val || i18n.t('rule.fieldIsRequired'),
    val => {
      const reg = /^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[6-7])|(17[1-8])|(18[0-9])|(19[1|3])|(19[5|6])|(19[8|9]))\d{8}$/
      return reg.test(val) || i18n.t('rule.pleaseEnterCorrectPhoneNumber')
    }
  ]
}
// 工号校验
export function jobNumberRules () {
  return [val => new RegExp('^[A-Za-z0-9]{6,18}$').test(val) || `请正确输入${i18n.t('auth.fields.jobNumber')}`]
}
// #endregion
