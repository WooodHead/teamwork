export default {
  interviewers: state => {
    let modelList = []
    let tmpInterviewers = state.interviewers
    // 模糊匹配
    if (state.search) {
      tmpInterviewers = tmpInterviewers.filter(item => {
        let str = item.psonName + item.jobName + item.organizeName + item.city
        return str.indexOf(state.search) !== -1
      })
    }
    _.forEach(_.groupBy(tmpInterviewers, p => +p.psonID), obj => {
      let model = {}
      model.psonID = obj[0].psonID
      model.psonName = obj[0].psonName
      model.objList = obj
      modelList.push(model)
    })
    return modelList
  },
  byIdInterviewer: state => (psonID) => {
    let tmpInterviewers = state.interviewers.filter(item => {
      return +item.psonID === +psonID
    })
    let model = {}
    model.psonID = psonID
    model.psonName = tmpInterviewers.length && tmpInterviewers[0].psonName
    model.objList = tmpInterviewers
    return model
  },
  search: state => {
    return state.search
  }
}
