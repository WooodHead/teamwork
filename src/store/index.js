import Vue from 'vue'
import Vuex from 'vuex'
import contacts from './contacts'
import wechat from './wechat'
import approval from './approval'
import chat from './chat'
import duty from './duty'
import group from './group'
import organize from './organize'
import settings from './settings'
import person from './person'
import role from './role'
import task from './task'
import taskchart from './taskchart'
import auth from './auth'
import document from './document'
import layout from './store-layout'
import message from './message'
import discuss from './discuss'
import notice from './notice'
import schedule from './schedule'
import consult from './consult'
import checkins from './checkins'
import activity from './activity'
import resource from './resource'
import productDev from './product-dev'
import product from './product'
import team from './team'
import widget from './widget'
import project from './project'
import order from './order'
import allocation from './allocation'
import breadcrumbs from './breadcrumbs'
import customer from './customer'
import opportunity from './opportunity'
import followup from './followup'
import assess from './assess'
import quotation from './quotation'
import publicLink from './public-link'
import dictionary from './dictionary'
import websocket from './websocket'
import subscribe from './subscribe'
import file from './file'
import boost from './boost'
import home from './store-home'
import member from './member'
import workflow from './workflow'
import tag from './tag'
import editorTemplate from './editor-template'
import productSelection from './product-selection'
import search from './search'
import service from './service'
import bookmark from './bookmark'
import jd50Alarm from './jd50-alarm'
import workHour from './work-hour'
import materialCode from './material-code'
import feedback from './feedback'
import commonProblem from './feedback-common-problem'
import job from './job'
import resume from './resume'
import guide from './guide'
import interviewer from './interviewer'
import recruitPlan from './recruit-plan'
import manufacturer from './manufacturer'
import recommendCode from './recommend-code'
import salary from './salary'
import position from './position'
import recruitPlanNeed from './recruit-plan-need'
import material from './material'
import template from './template'
import dashboard from './dashboard'
import menu from './menu'
import wiki from './wiki'
import productUser from './product-user'
Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth,
      settings,
      contacts,
      wechat,
      approval,
      chat,
      duty,
      group,
      organize,
      person,
      role,
      document,
      layout,
      activity,
      message,
      discuss,
      notice,
      schedule,
      consult,
      checkins,
      resource,
      productDev,
      product,
      team,
      widget,
      project,
      breadcrumbs,
      customer,
      opportunity,
      assess,
      followup,
      quotation,
      publicLink,
      order,
      allocation,
      task,
      taskchart,
      dictionary,
      websocket,
      subscribe,
      file,
      boost,
      home,
      member,
      workflow,
      tag,
      editorTemplate,
      productSelection,
      search,
      service,
      bookmark,
      jd50Alarm,
      workHour,
      materialCode,
      feedback,
      commonProblem,
      job,
      resume,
      guide,
      interviewer,
      recruitPlan,
      manufacturer,
      recommendCode,
      salary,
      position,
      recruitPlanNeed,
      material,
      template,
      dashboard,
      menu,
      wiki,
      productUser
    },
    // enable strict mode (adds overhead!)
    // for dev mode only  process.env.DEV
    strict: false
  })
  return Store
}
