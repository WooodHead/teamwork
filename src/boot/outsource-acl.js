import { format, LocalStorage } from 'quasar'
import request from '@/boot/axios'
import setMyinfo from '@/utils/local-storage-myinfo'
const { capitalize } = format
const aclRouteNames = [
  'manufacturerDetail',
  'manufacturerEdit',
  'assess',
  'assessDetail',
  'archivedAssess',
  'allocation',
  'allocationDetail',
  'archivedAllocations'
]

/**
 *
 *
 * @param {*} routeName
 * @param {*} params
 */
function assembleParams (routeName, params) {
  let newParams = {}
  const myinfo = LocalStorage.getItem('myself')
  switch (routeName) {
    case 'manufacturerDetail':
    case 'myManufacturerDetail':
      newParams.id = myinfo.manufacturerId
      break
    case 'manufacturerEdit':
    case 'myManufacturerEdit':
      newParams.id = myinfo.manufacturerId
      newParams.openType = 'edit'
      break
    case 'assess':
    case 'assessDetail':
    case 'archivedAssess':
    case 'myAssess':
    case 'myAssessDetail':
    case 'myArchivedAssess':
    case 'allocation':
    case 'allocationDetail':
    case 'archivedAllocations':
    case 'myAllocation':
    case 'myAllocationDetail':
    case 'myArchivedAllocations':
      newParams.category = 'manufacturer'
      newParams.objectID = myinfo.manufacturerId
      break
  }
  Object.assign(params, newParams)
}

/**
 * 路由分发，针对生产单位负责人
 *
 * @param {*} router 路由对象
 * @param {*} to 路由去向
 * @param {*} from 路由来自
 * @param {*} next
 */
function routeGo (router, to, from, next) {
  let routeName = to.name
  let params = to.params || {}
  assembleParams(routeName, params)
  if (['home', 'manufacturerHome'].includes(routeName)) {
    routeName = 'myManufacturerDetail'
    from.name !== routeName &&
      router.push({ name: routeName, params })
  } else if (aclRouteNames.includes(routeName)) {
    const newRouteName = `my${capitalize(routeName)}`
    router.push({ name: newRouteName, params })
  } else {
    next()
  }
}

export default ({ router }) => {
  router.beforeEach((to, from, next) => {
    const myinfo = LocalStorage.getItem('myself')
    if (myinfo && myinfo !== 'undefined' && myinfo.auth.role.isOutsource) {
      // 不进入系统主页，转到其所在的生产单位详情页
      // 暂不考虑一个生产单位负责人隶属多个生产单位的情况
      if (myinfo.manufacturerId > 0) {
        routeGo(router, to, from, next)
      } else {
        const query = [{ Key: 'OrganizeID', Value: myinfo.organizeId, Oper: 'eq' }]
        const condition = {
          query: JSON.stringify(query),
          fields: 'Id'
        }
        request.get('/manufacturers', condition)
          .then(res => {
            if (res && res.data.length > 0) {
              myinfo.manufacturerId = res.data[0]['ID']
              setMyinfo(myinfo)
              routeGo(router, to, from, next)
            } else {
              next()
            }
          })
      }
    } else {
      next()
    }
  })
}
