export default {
  /**
   * 跟进列表（
   */
  followups: (state, getters) => ({ objectID, objectType } = { objectID: state.ObjectID,
    objectType: state.ObjectType }) => {
    state.ObjectID = objectID
    state.ObjectType = objectType
    return getters.followupsSorted
  },
  /** 列表排序 */
  followupsSorted: (state, getters) => {
    return _.orderBy(getters.followupsFiltered, ['modifyTime'], ['desc'])
  },
  /** 跟进列表过滤 */
  followupsFiltered: state => {
    let followups = []
    if (state.followups.length > 0 && +state.ObjectID > 0) {
      followups = _.filter(state.followups.slice(), followup =>
        (followup.objectType === state.ObjectType) && (followup.objectID === state.ObjectID) && (followup.deleted === false))
    } else {
      followups = state.followups
    }
    return followups
  }
}
