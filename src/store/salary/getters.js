// import Salary from '../salary/model'
import { i18n } from '@/boot/i18n'
export default {
  salaryModel: state => {
    // let backData = Salary.from(state.salaryModel)
    return state.salaryModel
  },
  adminSalaryModel: state => {
    return state.adminSalaryModel
  },
  allSalaryDateAndType: state => {
    return state.allSalaryDateAndType
  },
  search: state => {
    return state.search
  },
  getCurrentSalarys: (state) => {
    let list = _.filter(state.adminSalarys, o => {
      return o.salaryYear === state.currentDateAndType.salaryYear &&
        o.salaryMonth === state.currentDateAndType.salaryMonth &&
        o.type === state.currentDateAndType.type
    })
    return {
      all: {
        label: i18n.t('salary.filterOptions.all'),
        list: list
      },
      isRead: {
        label: i18n.t('salary.filterOptions.isRead'),
        list: _.filter(list, o => { return o.sendStatus === 1 && o.isRead })
      },
      unRead: {
        label: i18n.t('salary.filterOptions.unRead'),
        list: _.filter(list, o => { return o.sendStatus === 1 && !o.isRead })
      },
      error: {
        label: i18n.t('salary.filterOptions.error'),
        list: _.filter(list, o => { return o.sendStatus === 4 })
      },
      unSend: {
        label: i18n.t('salary.filterOptions.unSend'),
        list: _.filter(list, o => { return !o.sendStatus })
      },
      newData: {
        label: i18n.t('salary.filterOptions.newData'),
        list: _.filter(list, o => { return o.sendStatus === 3 })
      },
      mismatch: {
        label: i18n.t('salary.filterOptions.mismatch'),
        list: _.filter(list, o => { return o.sendStatus === 2 })
      }
    }
  },
  getCurrentCountAndStatus: (state) => {
    return state.salaryCountAndStatus[`${state.currentDateAndType.salaryYear}-${state.currentDateAndType.salaryMonth}-${state.currentDateAndType.type}`]
  },
  getCurrentFilterStatus: (state) => {
    return state.salaryFilterStatus[`${state.currentDateAndType.salaryYear}-${state.currentDateAndType.salaryMonth}-${state.currentDateAndType.type}`]
  }
}
