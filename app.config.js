
// 多版本多实例的配置文件
// const config = require('./src/config/config-jd-xa-dev.json')// 开发版
// const config = require('./src/config/config-jd-xa-test.json')// 西安研发测试版
const config = require('./src/config/config-jd-dev.json')// 精雕集团开发版
// const config = require('./src/config/config-jd-test.json')// 精雕集团测试版
// const config = require('./src/config/config-jd.json')// 精雕集团正式版
// const config = require('./src/config/config-jd-xa.json')// 西安研发正式版
// const config = require('./src/config/config-jd-jj.json')// 精机正式版版
// const config = require('./src/config/config-jd-cp.json')// 产品正式版

// const config = require('./src/config/config-edu-jsit-dev.json')// 苏信开发版
// const config = require('./src/config/config-edu-jsit-test.json')// 苏信测试版
// const config = require('./src/config/config-edu-jsit.json')// 苏信正式版

const app = {
  menusOfPlatform: [
    'home',
    'contactsHome',
    'documentCenter',
    'teamHome',
    'projectHome',
    'productDevHome',
    'help',
    'adminFeedbackHome',
    'settings'
  ],
  toolsAllInWorkbench: [
    'task',
    'schedule',
    'activity',
    'myBookmarks',
    'myDrafts',
    'history',
    'myBoosts',
    'trash'
  ]
}
const salary = {
  defaultActual: {
    'salary': '实发工资',
    'reward': '实发奖金',
    'subsidy': '实发补贴',
    'reimburse': '实发报销',
    'resalary': '实发工资'
  },
  templateRequiredColumn: [
    '姓名',
    '职员代码',
    '部门'
  ],
  notDisplayIf0: [
    '售机奖励',
    '驻外补贴',
    '实习生补贴'
  ]
}
const position = {
  defaultActual: '职级',
  templateRequiredColumn: [
    '姓名',
    '职员代码',
    '部门',
    '职位'
  ]
}

const resume = {
  defaultActual: '测评结果',
  templateRequiredColumn: [
    '简历ID（必选字段）',
    '姓名'
  ]
}
// 合并平台级菜单和实例专有的菜单
const menus = [...app.menusOfPlatform, ...config.app.menusOfExclusive]
Object.assign(app, config.app, { menus })
Object.assign(config, { app, salary, position, resume })

module.exports = config
