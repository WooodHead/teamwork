// 引入 moment 插件
import moment from 'moment'
// 获取今日/昨日/本周/上周/本月/上月/本季度/上季度 时间
export default {
  // 获取今日的开始和结束时间
  getToday () {
    let obj = {
      from: '',
      to: ''
    }
    obj.from = moment(moment().startOf('day').valueOf()).format('YYYY-MM-DD HH:mm:ss')
    obj.to = moment(moment().valueOf()).format('YYYY-MM-DD HH:mm:ss')
    return obj
  },
  // 获取昨日的开始和结束时间
  getYesterday () {
    let obj = {
      from: '',
      to: ''
    }
    obj.from = moment(moment().add(-1, 'days').startOf('day').valueOf()).format('YYYY-MM-DD HH:mm:ss')
    obj.to = moment(moment().add(-1, 'days').endOf('day').valueOf()).format('YYYY-MM-DD HH:mm:ss')
    return obj
  },
  // 获取当前周的开始和结束时间
  getCurrWeekDays () {
    let obj = {
      from: '',
      to: ''
    }
    obj.from = moment(moment().week(moment().week()).startOf('week').add(1, 'days').valueOf()).format('YYYY-MM-DD HH:mm:ss')
    obj.to = moment(moment().week(moment().week()).endOf('week').add(1, 'days').valueOf()).format('YYYY-MM-DD HH:mm:ss')
    return obj
  },
  // 获取上一周的开始和结束时间
  getLastWeekDays () {
    let obj = {
      from: '',
      to: ''
    }
    obj.from = moment(moment().week(moment().week() - 1).startOf('week').add(1, 'days').valueOf()).format('YYYY-MM-DD HH:mm:ss')
    obj.to = moment(moment().week(moment().week() - 1).endOf('week').add(1, 'days').valueOf()).format('YYYY-MM-DD HH:mm:ss')
    return obj
  },
  // 获取当前月的开始和结束时间
  getCurrMonthDays () {
    let obj = {
      from: '',
      to: ''
    }
    obj.from = moment(moment().month(moment().month()).startOf('month').valueOf()).format('YYYY-MM-DD HH:mm:ss')
    obj.to = moment(moment().month(moment().month()).endOf('month').valueOf()).format('YYYY-MM-DD HH:mm:ss')
    return obj
  },
  // 获取上一个月的开始和结束时间
  getLastMonthDays () {
    let obj = {
      from: '',
      to: ''
    }
    obj.from = moment(moment().month(moment().month() - 1).startOf('month').valueOf()).format('YYYY-MM-DD HH:mm:ss')
    obj.to = moment(moment().month(moment().month() - 1).endOf('month').valueOf()).format('YYYY-MM-DD HH:mm:ss')
    return obj
  },
  // 获取上一季度的开始和结束时间
  getLastSeasonDays () {
    let obj = {
      from: '',
      to: ''
    }
    obj.from = moment(moment().quarter(moment().quarter() - 1).startOf('quarter').valueOf()).format('YYYY-MM-DD HH:mm:ss')
    obj.to = moment(moment().quarter(moment().quarter() - 1).endOf('quarter').valueOf()).format('YYYY-MM-DD HH:mm:ss')
    return obj
  },
  // 获取本季度的开始和结束时间
  getCurrSeasonDays () {
    let obj = {
      from: '',
      to: ''
    }
    obj.from = moment(moment().quarter(moment().quarter()).startOf('quarter').valueOf()).format('YYYY-MM-DD HH:mm:ss')
    obj.to = moment(moment().quarter(moment().quarter()).endOf('quarter').valueOf()).format('YYYY-MM-DD HH:mm:ss')
    return obj
  },
  // 获取上一年度的开始和结束时间
  getLastYearDays () {
    let obj = {
      from: '',
      to: ''
    }
    obj.from = moment(moment().year(moment().year() - 1).startOf('year').valueOf()).format('YYYY-MM-DD HH:mm:ss')
    obj.to = moment(moment().year(moment().year() - 1).endOf('year').valueOf()).format('YYYY-MM-DD HH:mm:ss')
    return obj
  },
  // 获取本年度的开始和结束时间
  getCurrYearDays () {
    let obj = {
      from: '',
      to: ''
    }
    obj.from = moment(moment().year(moment().year()).startOf('year').valueOf()).format('YYYY-MM-DD HH:mm:ss')
    obj.to = moment(moment().year(moment().year()).endOf('year').valueOf()).format('YYYY-MM-DD HH:mm:ss')
    return obj
  }
}
