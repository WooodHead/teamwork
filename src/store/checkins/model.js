/**
 * 任务
 * @export
 * @class Task
 */
import commomFields from '@/utils/model-common-fields'
import { date } from 'quasar'
const { formatDate } = date

/** -----------------------------------------Question---------------------------------------------- */
class Question {
  // eslint-disable-next-line space-before-function-paren
  constructor(question) {
    Object.assign(this, initquestion, question)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => fromQuestionOne(e))
    } else {
      return fromQuestionOne(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => toQuestionOne(f))
    } else {
      return toQuestionOne(front)
    }
  }
}
const initquestion = {
  id: 0,
  content: '',
  objectId: 0,
  objectType: '', // 资源类型
  objectTitle: '',
  cron: {
    time: '9:30',
    days: '',
    type: 'day',
    monthtype: ''
  },
  cronName: '',
  createByID: 0,
  assignedTo: [],
  isStop: false
}

function fromQuestionOne (end) {
  return {
    id: +end.Id,
    content: end.Content,
    objectId: +end.ObjectID,
    objectType: end.ObjectType, // 资源类型
    objectTitle: '',
    cron: convertToModel(end.CronSchedule),
    cronName: '',
    assignedTo: formatToArray(end.AssignedTo),
    createByID: +end.CreateByID,
    isStop: !!end.IsStop,
    ...commomFields.from(end)
  }
}

function toQuestionOne (front) {
  let model = {
    Id: +front.id,
    Content: front.content,
    ObjectID: +front.objectId,
    ObjectType: front.objectType, // 资源类型
    ObjectTitle: front.objectTitle,
    CronSchedule: convertToCron(front.cron),
    AssignedTo: formatToString(front.assignedTo),
    IsStop: front.isStop ? 1 : 0,
    ...commomFields.to(front)
  }
  return model
}

/** -----------------------------------------Answer---------------------------------- */
class Answer {
  // eslint-disable-next-line space-before-function-paren
  constructor(answer) {
    Object.assign(this, initanswer, answer)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => fromAnswerOne(e))
    } else {
      return fromAnswerOne(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => toAnswerOne(f))
    } else {
      return toAnswerOne(front)
    }
  }
}
const initanswer = {
  id: 0,
  content: '',
  questionID: 0,
  createByID: 0,
  objectId: 0,
  objectType: '', // 资源类型
  objectTitle: '',
  postDate: formatDate(new Date(), 'YYYY-MM-DD'),
  subscribers: [],
  commentCount: 0
}

function fromAnswerOne (end) {
  const front = {
    id: end.Id,
    content: end.Content,
    questionID: end.QuestionID,
    objectId: end.ObjectID,
    objectType: end.ObjectType,
    createByID: end.CreateByID,
    postDate: formatDate(end.PostDate.replace(/-/g, '/'), 'YYYY-MM-DD'),
    subscribers: end.Subscribers,
    commentCount: end.CommentCount,
    ...commomFields.from(end)
  }
  return front
}

function toAnswerOne (front) {
  let end = {
    Id: front.id,
    Content: front.content,
    QuestionID: front.questionID,
    PostDate: front.postDate,
    Subscribers: front.subscribers,
    ObjectId: front.objectId,
    ObjectType: front.objectType, // 资源类型
    ObjectTitle: front.objectTitle,
    CreateByID: +front.createByID,
    CommentCount: +front.commentCount,
    ...commomFields.to(front)
  }
  return end
}

export function convertToCron (model) {
  // "0 15 10 * * ?" 每天上午10:15触发
  // "0 15 10 ? * MON-FRI" 每周的周一至周五的上午10:15触发
  // "0 15 10 ? * 6#1" 每月的第一个星期五上午10:15触发
  // "0 15 10 ? * 6L" 每月的最后一个星期五上午10:15触发
  // "0 15 10 L * ?" 每月最后一日的上午10:15触发
  // "0 15 10 15 * ?" 每月的15日上午10:15触发
  let Cron = []
  const time = model.time.split(':')
  Cron.push('0')
  for (let i = time.length - 1; i >= 0; i--) {
    Cron.push(time[i])
  }
  if (model.type === 'day') {
    Cron.push('* * ?')
  } else if (model.type === 'week') {
    Cron.push('? *')
    Cron.push(model.days)
  } else if (model.type === 'month') {
    if (model.monthtype === 'firstweek') {
      Cron.push('? *')
      Cron.push(model.days + '#1')
    } else if (model.monthtype === 'lastweek') {
      Cron.push('? *')
      Cron.push(model.days + 'L')
    } else if (model.monthtype === 'lastday') {
      Cron.push('L * ?')
    } else {
      Cron.push(model.days)
      Cron.push('* ?')
    }
  }
  return Cron.join(' ')
}

export function convertToModel (Cron) {
  const model = {}
  Cron = Cron.split(' ')
  model.time = Cron[2] + ':' + Cron[1]
  if (Cron[3] === '*') {
    model.type = 'day'
    model.days = ''
  } else if (Cron[3] === '?') {
    if (Cron[5].includes('#1')) {
      model.type = 'month'
      model.days = Cron[5].split('#')[0]
      model.monthtype = 'firstweek'
    } else if (Cron[5].includes('L')) {
      model.type = 'month'
      model.days = Cron[5].split('L')[0]
      model.monthtype = 'lastweek'
    } else {
      model.type = 'week'
      model.days = Cron[5]
    }
  } else if (Cron[3] === 'L') {
    model.type = 'month'
    model.monthtype = 'lastday'
  } else {
    model.type = 'month'
    model.monthtype = 'day'
    model.days = Cron[3]
  }
  return model
}

function formatToArray (string) {
  if (string || string !== '') {
    return string.split(',').map(e => +e)
  } else {
    return []
  }
}

function formatToString (array) {
  if (array.length > 0) {
    return array.join(',')
  } else {
    return ''
  }
}
export default {
  Question,
  Answer
}
