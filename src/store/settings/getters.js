import { convertToModel } from '@/store/checkins/model'
import { i18n } from '@/boot/i18n'
export default {

  /** 当前类别下的问题列表 */
  currQuestions: state => {
    let questions = state.settings.defaultQuestion && state.settings.defaultQuestion[state.settings.currQuestionCategory]
    return questions && questions.map(question => {
      let cron = convertToModel(question.CronSchedule)
      return {
        ID: question.ID,
        content: question.Content,
        cron: cron,
        cronName: cron ? getCronName(cron) : ''
      }
    })
  },
  /**
   *通讯录Settings各项Items
   * @returns
   */
  contactsItems: (state) => {
    let contactsSettingsLimit = state.settings.contacts.settings ? state.settings.contacts.settings.limit : { title: '', description: '', items: [] }
    let contactsSettingsForbidden = state.settings.contacts.settings ? state.settings.contacts.settings.forbidden : { title: '', description: '', items: [] }
    let limitOrgIds = _.map(_.filter(contactsSettingsLimit.items, item => item.name === 'organize'), 'value')
    let limitPsonIds = _.map(_.filter(contactsSettingsLimit.items, item => item.name === 'person'), 'value')
    let forbiddenOrgIds = _.map(_.filter(contactsSettingsForbidden.items, item => item.name === 'organize'), 'value')
    let forbiddenPsonIds = _.map(_.filter(contactsSettingsForbidden.items, item => item.name === 'person'), 'value')
    return { limit: { orgIds: limitOrgIds, psonIds: limitPsonIds }, forbidden: { orgIds: forbiddenOrgIds, psonIds: forbiddenPsonIds } }
  }
}
function getCronName (cron) {
  let cronName = ''
  let days = getCronDays(cron)
  if (cron.type === 'month') {
    if (cron.monthtype === 'firstweek') {
      cronName = i18n.t(`question.header.cron.firstweek`, { days: days })
    } else if (cron.monthtype === 'lastweek') {
      cronName = i18n.t('question.header.cron.lastweek', { days: days })
    } else if (cron.monthtype === 'lastday') {
      cronName = i18n.t('question.header.cron.lastday')
    } else {
      cronName = i18n.t('question.header.month', { days: days })
    }
  } else if (cron.type === 'week') {
    cronName = i18n.t('question.header.week', { days: days })
  } else {
    cronName = i18n.t('question.header.day')
  }
  return i18n.t(`question.header.title`, { Cron: cronName, time: cron.time })
}
function getCronDays (cron) {
  let days = []
  if (cron.days) {
    if (cron.days.includes('sun')) {
      days.push(i18n.t('checkins.sunday'))
    }
    if (cron.days.includes('mon')) {
      days.push(i18n.t('checkins.monday'))
    }
    if (cron.days.includes('tue')) {
      days.push(i18n.t('checkins.tuesday'))
    }
    if (cron.days.includes('wed')) {
      days.push(i18n.t('checkins.wednesday'))
    }
    if (cron.days.includes('thu')) {
      days.push(i18n.t('checkins.thursday'))
    }
    if (cron.days.includes('fri')) {
      days.push(i18n.t('checkins.friday'))
    }
    if (cron.days.includes('sat')) {
      days.push(i18n.t('checkins.saturday'))
    }
  }
  if (cron.monthtype === 'day') {
    days.push(cron.days)
  }
  return days.join(' ')
}
