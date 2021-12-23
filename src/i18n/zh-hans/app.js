import copywriting from './copywriting/copywriting.js'
const logo = 'TeamWork',
  app =
  {
    title: copywriting.title || '精雕协同工作平台',
    name: copywriting.name || 'JDSoft TeamWork',
    logo,
    home: '主页',
    help: '用户手册',
    moduleGroup: {
      auth: '账户',
      index: '主页',
      oa: '协同办公',
      rd: '研发管理',
      crm: '客户关系管理',
      tool: '通用工具',
      jd: 'jd定制业务',
      system: '系统管理',
      job: '精雕招聘',
      finance: '财务',
      hr: '人事',
      thirdparty: '第三方应用'
    },
    error: {
      oopsSomethingWentWrong: '哎呀，出了点问题，能否重试下？',
      exist: '数据重复，请修改！',
      serverAccessDenied: '服务端拒绝访问：你没有权限，或者掉线了',
      notImplemented: '该接口未实现'
    },
    success: {
      deleted: '删除成功！'
    },
    loadMore: '加载更多...'
  }
export default app

export { logo }
