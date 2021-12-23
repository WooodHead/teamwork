
import QCalendar from '@quasar/quasar-ui-qcalendar'
import { i18n } from '@/boot/i18n'
const repeatType = {
  DONT_REPEAT: 'dontRepeat',
  EVERY_DAY: 'everyDay',
  EVERY_WEEK: 'everyWeek',
  EVERY_MONTH: 'everyMonth',
  EVERY_QUARTER: 'everyQuarter'
}
// const category = {
//   event: '事项',
//   task: '任务',
//   consult: '咨询'
// }
export default function () {
  return {
    events: [],
    event: {}, // 当前事项
    archivedCount: 0, // 已归档数量
    selectedDate: QCalendar.parseDate(new Date()).date,
    constMonths: 2,
    intervalMonths: 2,
    repeatType,
    repeatOptions: [
      {
        label: i18n.t('schedule.dontRepeat'),
        value: repeatType.DONT_REPEAT
      },
      {
        label: i18n.t('schedule.everyDay'),
        value: repeatType.EVERY_DAY
      },
      {
        label: i18n.t('schedule.everyWeek'),
        value: repeatType.EVERY_WEEK
      },
      {
        label: i18n.t('schedule.everyMonth'),
        value: repeatType.EVERY_MONTH
      },
      {
        label: i18n.t('schedule.everyQuarter'),
        value: repeatType.EVERY_QUARTER
      }
    ],
    addingEvent: false,
    clickEvent: false
  }
}
