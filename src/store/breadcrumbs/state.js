export default {
  // 业务模块的面包屑
  moduleBreadcrumbs: [],
  // 工具的面包屑
  widgetBreadcrumbs: [],
  // 当前业务模块数据对象
  resource: {},
  // 面包屑的对象属性
  breadcrumb: {
    // id, // 唯一标识,模块的规则category+id，如project100，工具详情的直接是id
    // to, // 跳转路由
    // title, // 标题
    // category, // 资源类型
    // level, // 当前业务模块层级：center/home/archivedHome/draftHome/detail/inDetail
    // type, // 类型：module/widget，系统自动设置，无需设置
    // switcher // 切换图标{type,icon,color}
  },
  // 自身控制面包屑的模块
  independentModule: ['product']
}
