import Vue from 'vue'
export default {
  // -----------主页面相关事件 start
  setConsults (state, consults) {
    state.consults.push(..._.differenceBy(consults, state.consults, 'id'))
  },
  addConsult (state, consult) {
    state.consults.unshift(..._.differenceBy([consult], state.consults, 'id'))
  },
  updateConsult (state, consult) {
    Object.assign(_.find(state.consults, { id: consult.id }), consult)
  },
  deleteConsult (state, id) {
    Vue.delete(state.consults, _.findIndex(state.consults, { id }))
  },
  setConsultSearch (state, value) {
    state.consultSearch = value
  },
  setConsultSort (state, value) {
    state.consultSort = value
  },
  setByPage (state, value) {
    state.byPage = value
  },
  setPage (state, page) {
    Object.assign(state.page, page)
  },
  setEmptyConsults (state) {
    state.consults = []
  },
  setSelectedStatus (state, status) {
    state.selectedStatus = status
  },
  // -----------主页面相关事件 end

  // -----------咨询何事 start
  setConsultItems (state, items) {
    state.consultItems.push(..._.differenceBy(items, state.consultItems, 'id'))
  },
  addConsultItem (state, item) {
    state.consultItems.unshift(
      ..._.differenceBy([item], state.consultItems, 'id')
    )
  },
  updateConsultItem (state, item) {
    Object.assign(_.find(state.consultItems, { id: item.id }), item)
  },
  deleteConsultItem (state, id) {
    Vue.delete(state.consultItems, _.findIndex(state.consultItems, { id }))
  },
  setConsultItemSearch (state, value) {
    state.consultItemSearch = value
  },
  // -----------咨询何事 end

  // -----------向谁咨询 start
  setTransactorSearch (state, value) {
    state.transactorSearch = value
  },
  setTransactors (state, transactors) {
    state.transactors.push(
      ..._.differenceBy(transactors, state.transactors, 'id')
    )
  },
  setEmptyTransators (state) {
    state.transactors = []
  }
  // -----------向谁咨询 end
}
