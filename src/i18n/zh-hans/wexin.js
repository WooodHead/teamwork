const config = require('app/app.config.js')
const jobNumber = {
  ent: '工号',
  edu: '编号'
}
export default {
  syncWxUserInfo: '企业微信账户同步',
  startSyncWxUserInfo: '开始前，请阅读账户同步说明',
  confirmSyncWXMessageTips_1: `TeamWork中仅维护了手机号和${jobNumber[config.version]}的账户会与企业微信实现同步`,
  confirmSyncWXMessageTips_2: 'TeamWork中离职的账户会在企业微信中禁用',
  confirmSyncWXMessageTips_3: `TeamWork中账户最好不要采用临时${jobNumber[config.version]}或保证临时${jobNumber[config.version]}唯一性`,
  SyncWXingMessage: '正在与企微微信同步中，请耐心等待...',
  SyncWXOk: '同步完毕，本次同步共 {count} 人',
  hasErrorUser: '存在异常账户，请手动修改！'
}
