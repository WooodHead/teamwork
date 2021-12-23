
export default {
  archivedCount: 0,
  sort: 'createTime',
  questions: [],
  answers: [],
  // 废纸篓
  questionsInTrash: [],
  answersInTrash: [],
  // 筛选条件
  objectType: 'project',
  objectId: 1,
  addingEvent: true,
  search: '',
  // 是否分页
  byPage: true,
  page: {
    offset: 0,
    limit: 20,
    nextPageToken: 0
  }
}
