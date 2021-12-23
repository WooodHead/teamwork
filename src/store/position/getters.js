/**
 *职位职级
 */
import { i18n } from '../../boot/i18n'
export default {
  filterCondition: (state, getters) => {
    let query = [{ Key: '1', Value: 1, Oper: 'eq' }]
    // 已读
    if (state.filterType === 'isRead') {
      query = [
        { Key: 'SendStatus', Value: 1, Oper: 'eq' },
        'and',
        { Key: 'IsRead', Value: 1, Oper: 'eq' }
      ]
    }
    // 未读
    if (state.filterType === 'unRead') {
      query = [
        { Key: 'SendStatus', Value: 1, Oper: 'eq' },
        'and',
        { Key: 'IsRead', Value: 0, Oper: 'eq' }
      ]
    }
    // 未绑定
    if (state.filterType === 'mismatch') {
      query = [
        { Key: 'SendStatus', Value: 2, Oper: 'eq' }
      ]
    }
    // 新数据
    if (state.filterType === 'newData') {
      query = [
        { Key: 'SendStatus', Value: 3, Oper: 'eq' }
      ]
    }
    // 发送异常
    if (state.filterType === 'error') {
      query = [
        { Key: 'SendStatus', Value: 4, Oper: 'eq' }
      ]
    }
    // 未发送
    if (state.filterType === 'unSend') {
      query = [
        { Key: 'SendStatus', Value: 0, Oper: 'eq' }
      ]
    }
    return query
  },
  countPositionStatus: (state, getters) => {
    return [
      { label: `${i18n.t('position.filterOptions.all')}(${state.positionCountAndStatus.all})`, value: 'all' },
      { label: `${i18n.t('position.filterOptions.isRead')}(${state.positionCountAndStatus.isRead})`, value: 'isRead' },
      { label: `${i18n.t('position.filterOptions.unRead')}(${state.positionCountAndStatus.unRead})`, value: 'unRead' },
      { label: `${i18n.t('position.filterOptions.newData')}(${state.positionCountAndStatus.newData})`, value: 'newData' },
      { label: `${i18n.t('position.filterOptions.mismatch')}(${state.positionCountAndStatus.mismatch})`, value: 'mismatch' },
      { label: `${i18n.t('position.filterOptions.error')}(${state.positionCountAndStatus.error})`, value: 'error' },
      { label: `${i18n.t('position.filterOptions.unSend')}(${state.positionCountAndStatus.unSend})`, value: 'unSend' }
    ]
  },
  position: (state, getters) => (recordNum) => {
    return _.find(state.positions, { recordNum })
  }
}
