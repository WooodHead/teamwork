// type：folder或者file
export function documentMenuList (that, type) {
  if ([that.category, (that.model || that.detailModel).objectType].includes('productCase')) {
    if (type === 'file') {
      return getFileProductCaseMenuList(that)
    } else {
      return getFolderProductCaseMenuList(that)
    }
  } else {
    if (type === 'file') {
      return getFileDocumentMenuList(that)
    } else {
      return getFolderDocumentMenuList(that)
    }
  }
}
function getFileProductCaseMenuList (that) {
  let arrMenu = []
  if (that.detailModel.extension &&
    that.canPreviewExts.includes(that.detailModel.extension.toLowerCase())) {
    arrMenu = ['preview']
  }
  if (+that.detailModel.authorID === +that.$myinfo.id || that.$myinfo.auth.role.isSystemAdministrator) {
    arrMenu.push('edit', 'delete', 'download')
  } else if (!that.detailModel.onlyICanDownload) {
    arrMenu.push('download')
  } else if (!that.detailModel.onlyICanEdit) {
    arrMenu.push('edit')
  }
  return arrMenu
}
function getFileDocumentMenuList (that) {
  let menuList =
    Object.keys(that.detailModel).length > 0 && that.detailModel.isPublish === 0
      ? ['move', 'copy', 'delete']
      : [
        'edit',
        'move',
        'copy',
        'archive',
        'delete',
        that.isBookmark ? 'deleteBookmark' : 'bookmark',
        { group: ['publicLink', 'send'] },
        { group: ['history'] }
      ]
  // 设置废纸篓中的文档菜单
  menuList =
    Object.keys(that.detailModel).length > 0 && that.detailModel.deleted
      ? [
        'move',
        'copy',
        that.isBookmark ? 'deleteBookmark' : 'bookmark',
        { group: ['publicLink'] },
        { group: ['history'] }
      ]
      : menuList

  // 仅创建者可编辑时对其他人隐藏部分菜单
  // detailModel.onlyICanEdit === 0||detailModel.authorID === myself||!!$myinfo.auth.role.isSystemAdministrator||!!$myinfo.auth.role.isSeniorManager||!isPublicLink
  if (
    !(
      that.detailModel.onlyICanEdit === 0 ||
      that.detailModel.authorID === that.$myinfo.id ||
      !!that.$myinfo.auth.role.isSystemAdministrator ||
      !!that.$myinfo.auth.role.isSeniorManager
    ) &&
    that.type === 'document'
  ) {
    menuList =
      Object.keys(that.detailModel).length > 0 &&
        that.detailModel.isPublish === 0
        ? ['move', 'copy', 'delete']
        : [
          that.isBookmark ? 'deleteBookmark' : 'bookmark',
          { group: ['history'] }
        ]
    // 设置废纸篓中的文档菜单
    menuList =
      Object.keys(that.detailModel).length > 0 && that.detailModel.deleted
        ? [
          'move',
          'copy',
          that.isBookmark ? 'deleteBookmark' : 'bookmark',
          { group: ['publicLink'] },
          { group: ['history'] }
        ]
        : menuList
  }
  if (
    [0, 1].includes(that.detailModel.acl) &&
    ((that.detailModel.onlyICanEdit === 1 &&
      that.detailModel.authorID === that.myself.id) ||
      that.detailModel.onlyICanEdit === 0)
  ) {
    that.$set(menuList, menuList.length, 'secrecy')
  }
  if (that.$myinfo.auth.role.isSystemAdministrator || that.detailModel.authorID === that.myself.id) {
    let f = _.find(menuList, m => {
      return _.isObject(m) && m.group.includes('history')
    })
    f.group = ['history', 'viewDocumentCount']
  }
  return menuList
}
function getFolderDocumentMenuList (that) {
  let menuList = [
    'rename',
    'move',
    'copy',
    'archive',
    'delete',
    that.isBookmark ? 'deleteBookmark' : 'bookmark'
  ]
  // 知识空间菜单单独设置，只有知识库管理员和系统管理员可设置
  if (that.model.level === 2 && that.model.objectID && that.model.objectType === 'wiki') {
    if (that.$myinfo.auth.role.isSystemAdministrator || that.$myinfo.auth.role.isWikiAdministrator) {
      menuList = [
        'rename',
        'move',
        'copy',
        'archive',
        'delete',
        that.isBookmark ? 'deleteBookmark' : 'bookmark'
      ]
    }
    return menuList
  }
  if (
    !(
      that.model.onlyICanEdit === 0 ||
      that.model.authorID === that.$myinfo.id ||
      !!that.$myinfo.auth.role.isSystemAdministrator ||
      !!that.$myinfo.auth.role.isSeniorManager
    )
  ) {
    _.remove(menuList, m => ['rename', 'copy', 'move', 'archive', 'delete'].includes(m))
  }
  if ([0, 1].includes(that.model.acl)) {
    that.$set(menuList, menuList.length, 'secrecy')
  }

  // 【机构，团队，产品，项目，客户】根级移除【删除、归档】按钮
  if (that.model.level === 2 && that.model.objectID) {
    _.remove(menuList, m => ['archive', 'delete'].includes(m))
  }

  if (that.model.archived) {
    _.remove(menuList, m => m === 'archive')
  }

  // if (!that.model.acl) {
  //   that.$set(menuList, menuList.length, 'secrecy')
  // }
  if (that.excludeButton.length) {
    menuList = _.difference(menuList, that.excludeButton)
  }
  return menuList
}
function getFolderProductCaseMenuList (that) {
  if (that.model.isPublish) {
    return ['dropPublish', { group: ['changeCover'] }, 'rename', 'delete']
  } else {
    return ['publish', { group: ['changeCover'] }, 'rename', 'delete']
  }
}
