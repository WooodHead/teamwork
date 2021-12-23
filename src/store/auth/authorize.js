/**
 @Name：系统权限处理js，其中包括角色访问权限控制，路由访问权限控制
 @Author：陈冬
 @date：2020/6/30
 @Copyright：西安精雕软件科技有限公司
 */
import routes from '@/router/routes'
const config = require('app/app.config.js')
/**
 * 获取可显示的所有路由的name
 *
 * @param {*} menus
 * @param {*} routes
 * @returns
 */
function showsMenus (menus, routes) {
  routes.forEach(r => {
    if (!r.hideInMenu) {
      r.name && config.app.menus.includes(r.name) && !menus.includes(r.name) && menus.push(r.name)
      if (r.children) {
        showsMenus(menus, r.children)
      }
    }
  })
}
/**
 * 角色访问权限控制
 *
 * @export
 * @param {*} roleCodes 角色数组['User','SystemAdministrator'],每个用户可能不同，这一块目前需要在数据库维护
 * @returns
 */
export function roleAuthorize (roleCodes) {
  const isRole = {}
  roleCodes.forEach(role => {
    isRole[`is${role}`] = true
  })
  return isRole
}
/**
 * 路由访问权限控制
 *
 * @export
 * @param {*} roleCodes 角色数组['User','SystemAdministrator'],每个用户可能不同，这一块目前需要在数据库维护
 */
export function routeAuthorize (roleCodes) {
  // 获取可见路由的name
  var menus = []
  showsMenus(menus, routes)
  // 定义角色可查看路由的列表权限
  var roleMenus = config.app.menusOfAllRole
  roleCodes.forEach(role => {
    config.app.menusProperOfRole[role] &&
      roleMenus.push(...config.app.menusProperOfRole[role])
  })
  // 去除重复
  roleMenus = _.union(roleMenus)
  // 组装人员路由菜单权限
  return {
    // 1.所有菜单范围
    allMenus: _.clone(menus),
    // 2.角色可以看到的不同菜单项（多角色取并集去重）
    roleMenus: roleMenus
  }
}
