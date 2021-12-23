export default {
  heading: '历史记录',
  // 具体操作，如：Add, Delete
  Action: {
    add: '新建了',
    delete: '删除了',
    update: '编辑了',
    archive: '归档了',
    unarchive: '解档了',
    start: '开始了',
    stop: '暂停了',
    move: '移动了',
    copy: '复制了',
    finish: '完成了',
    activate: '激活了',
    send: '发送了',
    reupload: '重新上传了',
    undelete: '恢复了',
    assigned: '指派了'
  },
  Extra: {
    Content: '内容',
    TaskName: '名称',
    AssignedTo: '指派人',
    Description: '描述',
    StartTime: '开始日期',
    EndTime: '结束日期',
    CronSchedule: '提问时间',
    NotifyTo: '通知人',
    Title: '名称',
    NoticeType: '公告类型',
    OldContent: '原{content}为：',
    Color: '背景颜色',
    FilePath: '文件',
    Send: '发送给了',
    Notes: '备注',
    Source: '来源',
    BusinessType: '类型',
    WorkHour: '工作时长',
    OnRoadHour: '路途用时',
    PredictHour: '预计工时',
    BeginTime: '开始时间',
    FinishedTime: '结束时间'
  },
  CronSchedule: {
    header: {
      title: '{Cron}{time}',
      cron: {
        firstweek: '每月第一周的{days}',
        lastweek: '每月最后一周的{days}',
        day: '每月{days}日',
        lastday: '每月的最后一天'
      },
      day: '每天',
      week: '每周的{days}',
      month: '每月的{days}'
    },
    hint: 'Add your answer...'
  },
  title: '{Actor}{Action}这个{Name}'
}
