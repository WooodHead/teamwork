export default {
  workflow: state => ({ category, type } = {}) => {
    return state.workflows[category] && state.workflows[category][type]
  }
}
