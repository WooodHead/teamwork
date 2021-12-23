export default function () {
  return {
    // 内推码列表
    recommendCodes: [],
    // 是否分页
    byPage: true,
    page: {
      offset: 0,
      limit: 3,
      nextPageToken: 0
    },
    search: '',
    codeType: {
      0: { type: 0, label: '1-N推荐码' },
      1: { type: 1, label: '1-1内推码' }
    }

  }
}
