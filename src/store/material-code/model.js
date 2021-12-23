function fromOne (end) {
  const
    Route = _.has(end, 'Route')
      ? (_.isObject(end.Route) ? end.Route : JSON.parse(end.Route)) : {},
    Params = _.has(Route, 'Params') && Route.Params !== ''
      ? (_.isObject(Route.Params) ? Route.Params : JSON.parse(Route.Params)) : {}
  return {
    id: end.Id,
    route: {
      name: Route.Name,
      params: Params,
      path: Route.Path
    }
  }
}
export default class Member {
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => fromOne(e))
    } else {
      return fromOne(end)
    }
  }
}
