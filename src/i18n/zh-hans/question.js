export default {
  module: '自动提问',
  title: '提问',
  notes: '创建重复的问题，定期自动推送，可用于汇报、例会等。',
  header: {
    title: '{Cron}{time}向{number}个人发出提问.',
    cron: {
      firstweek: '每月第一周的{days}',
      lastweek: '每月最后一周的{days}',
      day: '每月{days}日',
      lastday: '每月的最后一天'
    },
    day: '每天',
    week: '每周的{days}',
    month: '每月的{days}日'
  },
  hint: '填写你的回答...',
  reallyDelete: '删除此问题，将一并' + '<span class="text-red">删除其下所有回答</span>' + '，确认删除吗？'

}
