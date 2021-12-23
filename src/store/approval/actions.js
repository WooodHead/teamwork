import request from '@/boot/axios'
import Approval from './model'
const url = {
  getTemplateForm: 'wechat/gettemplateform',
  sendApplyEvent: 'wechat/sendapplyevent',
  getApprovalDetail: 'wechat/getapprovaldetail',
  getModel: 'approvals/getmodel',
  getList: 'approvals/getlist',
  getPagelist: 'approvals/getpagelist',
  Add: 'approvals/add',
  Update: 'approvals/update',
  UpdateFields: 'approvals/updatefields',
  Delete: 'approvals/delete'
}
export default {
  loadTemplateForm ({ dispatch, state, commit }, { templateId = '' } = {}) {
    let temp = _.find(state.templates, l => l.templateId === templateId)
    if (temp && temp.formFields.template_names.length) {
      initTempValue({ dispatch }, temp.formFields.template_names, temp.formFields.template_content, temp.formFields.vacation_list)
      return
    }
    return request.get(url.getTemplateForm, { templateId })
      .then(res => {
        let templateContent = res.data.template_content
        let vacationList = res.data.vacation_list
        let templateNames = res.data.template_names
        initTempValue({ dispatch }, templateNames, templateContent, vacationList)
        commit('pushTemplateFormFields', { templateId, formFields: { template_content: templateContent, vacation_list: vacationList, template_names: templateNames } })
      })
  },
  sendApplyEvent ({ state, dispatch, commit }, payload) {
    return request.post(url.sendApplyEvent, payload)
      .then(res => {
        if (res.data) {
          if (res.data.errcode === 0) {
            this.$router.push({ name: 'approvalHome' })
          } else {
            res.data.errmsg && showWarningMessage(i18n.t(`${res.data.errcode}:${res.data.errmsg}`))
          }
        }
      })
  },
  loadApprovalDetail ({ dispatch, state, commit }, { spNo = '' } = {}) {
    return request.get(url.getApprovalDetail, { spNo })
      .then(res => {
        console.log(res)
      })
  },
  loadApproval ({ state, commit }, id) {
    let approval = _.find(state.approvals, o => o.id === +id)
    if (!approval) {
      return request.get(url.getModel, { id: +id })
        .then((res) => {
          approval = Approval.from(res.data)
          commit('addApprovals', [approval])
          return approval
        })
    } else {
      return approval
    }
  },
  loadApprovals ({ state, commit },
    {
      query,
      filter,
      sort,
      search,
      fields = 'List',
      limit = state.page.limit,
      offset = state.page.offset,
      byPage = state.byPage
    }) {
    let condition =
    {
      query: JSON.stringify(query),
      filter: JSON.stringify(filter),
      sort: sort,
      search: search,
      fields: fields
    }, reqUrl = url.getList
    if (byPage) {
      Object.assign(condition, { limit: limit, offset: offset })
      reqUrl = url.getPagelist
    }
    return request.get(reqUrl, condition)
      .then(res => {
        let approvals = res.data ? Approval.from(res.data) : []
        if (byPage) {
          const nextPageToken = res.nextPageToken
          commit('setPage', { offset: offset + approvals.length, nextPageToken })
        } else {
          commit('setPage', { nextPageToken: -1 })
        }
        commit('addApprovals', approvals)
        return approvals
      })
  },
  addApproval ({ commit }, approval) {
    approval = Approval.to(approval)
    return request.post(url.Add, approval)
      .then(res => {
        approval = Approval.from(res.data)
        commit('addApprovals', [approval])
        return approval
      })
  },
  updateApproval ({ commit }, approval) {
    approval = Approval.to(approval)
    return request.put(url.Update, approval)
      .then(res => {
        approval = Approval.from(res.data)
        commit('updateApproval', approval)
        return approval
      })
  },
  updateApprovalField ({ commit }, fields) {
    let approval = Approval.to(fields)
    return request.put(url.UpdateFields, approval)
      .then(res => {
        approval = Approval.from(res.data)
        commit('updateApproval', approval)
        return approval
      })
  },
  deleteApproval ({ commit }, id) {
    return request.delete(url.Delete, { id })
      .then(res => {
        commit('deleteApproval', id)
        return true
      })
  }
}

function initTempValue ({ dispatch }, _templateNames, templateContent, vacationList) {
  _.forEach(templateContent.controls, c => {
    if (c.property.control === 'Attendance') {
      c.property.value = { attendance: { date_range: { type: c.config.attendance.date_range.type, new_begin: '', new_end: '', new_duration: '' }, type: c.config.attendance.type } }
    } else if (c.property.control === 'Vacation') {
      var options = []; if (vacationList && vacationList.item) { _.forEach(vacationList.item, i => { options.push({ key: i.id, value: i.name }) }) }
      c.config = { vacation: { selector: { type: 'single', options }, attendance: { date_range: { type: 'hour' }, type: 1 } } }
      c.property.value = { vacation: { selector: { type: 'single', options: [options.length && options[0]], exp_type: 0 }, attendance: { date_range: { type: 'hour', new_begin: '', new_end: '', new_duration: '' }, type: 1 } } }
    } else if (c.property.control === 'Selector') {
      c.property.value = { selector: { type: 'single', options: [c.config.selector.options.length && c.config.selector.options[0]] } }
    } else if (c.property.control === 'Number') {
      c.property.value = { new_number: '' }
    } else if (c.property.control === 'Money') {
      c.property.value = { new_money: '' }
    } else if (c.property.control === 'Date') {
      c.property.value = { date: { type: 'day', s_timestamp: '' } }
    } else if (c.property.control === 'Textarea' || c.property.control === 'Text') {
      c.property.value = { text: '' }
    } else if (c.property.control === 'File') {
      c.property.value = { files: [] }
    } else if (c.property.control === 'Contact') {
      let options = []
      if (c.config.contact.mode === 'department') {
        c.property.value = { departments: [] }
        // 企业微信中机构列表
        dispatch('wechat/getWechatDeptlist', {}, { root: true }).then(res => {
          _.forEach(res, r => {
            options.push({ openapi_id: r.id, name: r.name })
          })
        })
      } else {
        c.property.value = { members: [] }
        // 企业微信中人员列表
        dispatch('wechat/getWechatDeptUserlist', {}, { root: true }).then(res => {
          _.forEach(res, r => {
            options.push({ userid: r.userid, name: r.name })
          })
        })
      }
      Object.assign(c.config.contact, { options })
    }
  })
  return templateContent
}
