
import { Platform, LocalStorage } from 'quasar'
import { isEqualObject } from '@/utils/isequal-object'
// import Smartour from 'smartour/dist/index.esm.js'
// const tour = new Smartour()
// let tourFeedbackElement = ''
export default ({ store, router }) => {
  router.beforeEach((to, from, next) => {
    // 移动端记住路由
    if (Platform.is.mobile) {
      let activeNav = LocalStorage.getItem('nowActivateTab') || 'home'
      let newAddObj = { key: activeNav, name: to.name, params: to.params }
      let navLastRoute = LocalStorage.getItem('navLastRoute') || {}
      // 如果切换的新的路由的tab发生了切换，需要更改nowActivateTab，用于浏览器自己后退的时候
      let key = _.findKey(navLastRoute, n => { return n.name === newAddObj.name && isEqualObject(n.params, newAddObj.params) })
      if (key && key !== activeNav) {
        LocalStorage.set('nowActivateTab', key)
        activeNav = key
      }

      // 将旧的离开的那个location加到新的上面，如果匹配到旧的路由的话
      let oldSeamObj = navLastRoute[activeNav]
      let location = { x: 0, y: 0 }
      if (oldSeamObj && oldSeamObj.name === newAddObj.name && isEqualObject(oldSeamObj.params, newAddObj.params)) {
        location = oldSeamObj.location
      }
      navLastRoute[activeNav] = { key: activeNav, name: to.name, params: to.params, location }
      LocalStorage.set('navLastRoute', navLastRoute)
    }
    if (window.RichTextEditting && window.RichTextChange) {
      // Do you really want to leave ? you have unsaved changes!
      if (window.confirm('确定要离开吗？你还有未保存的更改！')) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  })
  // 导航文件：需要在显示导航的位置添加tour-focus类型。
  router.afterEach((to, from) => {
    to.meta.label && (document.title = `${to.meta.label} | TeamWork`)
    // Smartour导游
    // let tours = LocalStorage.getItem('tours') || [], tourqueue = []
    // if (tours.indexOf('feedback') === -1) {
    //   setTimeout(() => {
    //     tourFeedbackElement = document.getElementsByClassName('tour-focus-feedback')
    //     if (tourFeedbackElement.length) {
    //       tourqueue.push({
    //         el: '.tour-focus-feedback',
    //         slot: '<p>您可以在这里反馈您的建议或遇到的问题~</p>',
    //         options: {
    //           slotPosition: 'left',
    //           layerEvent: tour.next.bind(tour)
    //         }
    //       })
    //       tours.push('feedback')
    //       LocalStorage.set('tours', tours)
    //       if (tourqueue.length) {
    //         tour.queue(tourqueue).run()
    //       }
    //     }
    //   }, 1000)
    // }
    // 处理仅PC端访问的路由
    if (to.meta.onlyDesktop && !Platform.is.desktop) {
      router.push({
        name: 'onlyDesktop'
      })
    }
    let fromArr = from.path.split('/') // 不将当前页面的路由加入浏览器的history记录
    if (['add', 'edit', 'upload', 'link'].includes(fromArr[fromArr.length - 1]) ||
                        ['add', 'edit', 'upload', 'link'].includes(fromArr[fromArr.length - 2])) {
      router.replace(to.path).catch(err => err)
      router.go(-1)
    } else if (['copy', 'move'].includes(fromArr[fromArr.length - 1]) ||
      ['copy', 'move'].includes(fromArr[fromArr.length - 2])) {
      router.replace(to.path).catch(err => err)
    }        
  })
}
