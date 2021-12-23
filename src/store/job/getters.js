export default {
  /**
   * 岗位列表（
   */
  jobs: (state, getters) => {
    return getters.jobsSorted
  },
  /** 草稿、发布、归档、类别过滤 */
  jobsFiltered: state => {
    let jobs = state.jobs
    // 类别过滤
    if (state.category) {
      jobs = jobs.filter(item => {
        return state.category === item.category
      })
    }
    // 模糊匹配
    if (state.search) {
      jobs = jobs.filter(item => {
        return item.title.indexOf(state.search) !== -1
      })
    }
    if (state.isDraftList) {
      // 草稿列表
      jobs = jobs.filter(item => {
        return item.isPublish === 0
      })
    } else if (state.isArchivedList) {
      // 归档列表
      jobs = jobs.filter(item => {
        return item.archived
      })
    } else {
      // 发布列表
      jobs = jobs.filter(item => {
        return item.isPublish === 1 && !item.archived
      })
    }
    return jobs
  },
  /** 列表排序 */
  jobsSorted: (state, getters) => {
    return _.orderBy(getters.jobsFiltered, ['id'], ['desc'])
  }
}
