export default function () {
  return {
    // 招聘计划需求列表
    recruitPlanNeeds: [],
    // 是否分页
    byPage: true,
    page: {
      offset: 0,
      limit: 3,
      nextPageToken: 0
    }
  }
}
