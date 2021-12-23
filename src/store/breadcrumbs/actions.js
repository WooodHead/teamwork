import { i18n } from '@/boot/i18n'
import { LocalStorage } from 'quasar'
/**
 * 获取业务模块的信息
 * @param {Object} currentRoute 当前路由对象
 * @returns { category, objectID }
 */
function getModuleInfo (currentRoute) {
  let { category, objectID, id } = currentRoute.params
  // 路径中的第一个/后的就是模块类型，它在有的时候是category参数
  category = category || _.camelCase(currentRoute.path.split('/')[1])
  // 模块ID
  objectID = +objectID || +id || 0
  if (['schedule', 'activity'].includes(category)) {
    // 没有模块类型的情况下，默认认为是当前人员,
    // 这样的一般都是个人工具,如日程，动态等
    category = 'person'
    const my = LocalStorage.getItem('myself') || {}
    objectID = my.id
  }
  return { category, objectID }
}
/**
 * 规整路由名称
 *
 * @param {*} routeName 当前路由名称
 * @param {*} category 业务模块类型
 * @returns routeName
 */
function regularRouteName (routeName, category) {
  if (routeName === 'document' && !category) {
    routeName = 'documentCenter'
  }
  return routeName
}
/**
 * 获取路由层级，路由的模块层级center>home>detail>inDetail
 * @param {string} currentRouteName 当前路由名称
 * @param {String}} category 业务类型
 * @returns 路由层级
 */
function getRouteLevel (currentRouteName, category) {
  let routeModuleLevel = 'inDetail'
  if (currentRouteName.includes('Center')) {
    // 一些应用中心页面，如文档中心，个人中心，聊天中心
    routeModuleLevel = 'center'
  } else if (currentRouteName.includes('Home')) {
    // 业务模块的主页
    routeModuleLevel = 'home'
  } else if (currentRouteName === `${category}Detail`) {
    // 业务模块的一个实例的详情页
    routeModuleLevel = 'detail'
  } else if (category === 'my') {
    routeModuleLevel = 'home'
  }
  return routeModuleLevel
}
/**
 * 是否具有center级面包屑
 *
 * @param {*} routeModuleLevel
 * @param {*} category
 * @returns
 */
function hasCenterLevelBread (routeModuleLevel, category) {
  return ['detail', 'inDetail'].includes(routeModuleLevel) &&
    ['document', 'chat'].includes(category)
}
/**
 * 是否具有home级面包屑
 *
 * @param {*} routeModuleLevel
 * @param {*} category
 * @returns
 */
function hasHomeLevelBread ({ routeModuleLevel, category, isBuiltInModule }) {
  return ['detail', 'inDetail'].includes(routeModuleLevel) &&
    category !== 'person' &&
    !(category === 'manufacturer' && LocalStorage.getItem('myself').auth.role.isOutsource) &&
    !isBuiltInModule
}
/**
 * 是否具有tempalte级面包屑
 *
 * @param {*} routeModuleLevel
 * @param {*} category
 * @returns
 */
function hasTemplateLevelBread ({ currentRouteName, category, isTemplate }) {
  return currentRouteName === `archived${_.upperFirst(category)}sTemplate` || isTemplate
}
export default {
  /**
   * 设置模块面包屑，直到模块实例的详情页级别
   * 这里指的是机构，产品，团队，项目等这些通用的模块和一些文档、聊天等中心模块
   * 不包括产品选型这些非通用的业务模块（需要自定义设置) // TODO
   * @param {*} param0
   */
  async setModuleBreadcrumbs ({ state, dispatch, commit, rootState }) {
    commit('clearWidgetBreadcrumbs')
    const { category, objectID } = getModuleInfo(this.$router.currentRoute)
    // 业务模块自身控制面包屑
    if (state.independentModule.includes(category)) {
      await dispatch(`${category}/setProductBreadcrumbs`, '', { root: true })
      return
    }
    const currentRouteName = regularRouteName(this.$router.currentRoute.name, category),
      // 路由的模块层级center,home,detail,inDetail
      routeModuleLevel = getRouteLevel(currentRouteName, category),
      isBuiltInModule = !rootState.resource.builtInModules.includes(category),
      breads = []

    hasCenterLevelBread(routeModuleLevel, category) &&
      breads.push({
        id: `${category}Center`,
        title: i18n.t(`${category}.center`),
        to: { name: `${category}Center` },
        category: category,
        level: 'center'
      })
    hasHomeLevelBread({ routeModuleLevel, category, isBuiltInModule }) &&
      breads.push({
        id: `${category}Home`,
        title: i18n.t(`${category}.module`),
        to: { name: category === 'project' ? 'projectList' : `${category}Home` },
        category: category,
        level: 'home'
      })

    // 获取业务模块数据
    let resource = state.resource || {}
    if (objectID) {
      // 避免相同资源重复加载
      if (!resource.id || resource.id !== objectID) {
        resource = await dispatch('resource/loadResourceItem',
          { objectID: objectID, objectType: category },
          { root: true })
      } else if (!isBuiltInModule) {
        const resBuiltIn = _.find(rootState[category][`${category}s`], objectID)
        resBuiltIn &&
          (resource = {
            id: resBuiltIn.id,
            category,
            title: resBuiltIn.title || resBuiltIn.name,
            archived: resBuiltIn.archived
          })
      }
      commit('setResource', resource)
    }

    hasTemplateLevelBread({ currentRouteName, category, isTemplate: resource.isTemplate }) &&
      breads.push({
        id: `isTemplate${category}${objectID}`,
        to: { name: `${category}TemplateManage` },
        title: i18n.t('template.templateManage'),
        category: category,
        level: 'template'
      })

    if (!objectID) {
      commit('setModuleBreadcrumbs', breads)
      return
    }

    // 如果是归档的模块，则添加归档区面包屑
    resource.archived && breads.push({
      id: `archived${category}${objectID}`,
      to: { name: `archived${_.upperFirst(category)}s${resource.isTemplate ? 'Template' : ''}` },
      title: i18n.t('archive.area'),
      category: category,
      level: 'archivedHome'
    })
    if (!['consult', 'workRecord'].includes(category) && routeModuleLevel === 'inDetail' && this.$router.currentRoute.name !== 'wikiManage') {
      let { type } = this.$router.currentRoute.query
      // 添加模块实例面包屑
      if ((category === 'person' && !['service', 'consult'].includes(type)) ||
        category !== 'person') {
        breads.push({
          id: category + objectID,
          // TODO 自定义的暂没有详情页
          to: isBuiltInModule
            ? undefined
            : {
              name: category === 'wiki' ? 'wikiManage' : `${category}Detail`, params: { id: objectID }
            },
          title: resource.title,
          category: category,
          level: 'detail',
          // TODO 人员暂时不加工具切换器
          switcher: (category === 'person' || isBuiltInModule)
            ? undefined
            : { type: 'widget', icon: 'widgets', color: 'grey' }
        })
      } else {
        breads.push({
          id: `${type}Home`,
          title: i18n.t(`${type}.module`),
          to: { name: `${type}Home` },
          category: type,
          level: 'home'
        })
      }
    }
    if (this.$router.currentRoute.name === 'wikiManage') {
      let query = [
        { Key: 'ObjectID', Value: +objectID, Oper: 'eq' },
        'and',
        { Key: 'ObjectType', Value: 'wiki', Oper: 'eq' },
        'and',
        { Key: 'Level', Value: 2, Oper: 'eq' }
      ]
      let folder = await dispatch('document/loadDocumentByQuery',
        {
          frontQuery: (m) => { return m.objectType === 'wiki' && m.level === 2 && m.objectId === +objectID },
          endQuery: query,
          onlyGetData: true
        },
        { root: true })
      breads.push({
        id: folder.id,
        title: folder.title,
        to: { name: 'folder', params: { objectID, category: 'wiki', id: folder.id } },
        category: 'wiki',
        level: 'home'
      })
    }
    commit('setModuleBreadcrumbs', breads)
  }
}
