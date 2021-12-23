/**
 *职位职级
 */
export default {
  positions: [],
  filterType: 'all',
  search: '',
  statusCount: {},
  // 是否分页
  byPage: true,
  page: {
    offset: 0,
    limit: 15,
    nextPageToken: 0
  },
  // 各状态数量-全部
  positionCountAndStatus: {
    all: 0,
    error: 0,
    isRead: 0,
    mismatch: 0,
    newData: 0,
    unRead: 0,
    unSend: 0
  },
  // 各状态数量-批量
  positionBatchCountAndStatus: {
    all: 0,
    error: 0,
    isRead: 0,
    mismatch: 0,
    newData: 0,
    unRead: 0,
    unSend: 0,
    isSending: 0
  },
  // 职级上传进度
  importProgress: 0
}
