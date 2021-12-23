/**
 * 将列表数据转换成quasar的树结构数据
 * @param {Array} list 列表数据
 * @param {String} ParentID 指定的父级字段，默认为“ParentID”
 * @param {String} icon 指定图标
 * @param {String} iconColor 指定图标颜色
 * @param {boolbar} isUserSystemIcon 是否启用系统图标
 * @param {String} isFolderCallback 是否是文件夹的函数判断
 */
export function listToTree (
  list,
  id = 'ID',
  pid = 'ParentID',
  icon = '',
  iconColor = '',
  isUserSystemIcon = false,
  isFolderCallback) {
  let translator = (children, isFindParent = true) => {
    for (let index = 0; index < children.length; index++) {
      // 先找父级和子级

      let element = children[index]
      let parent = null
      if (isFindParent) {
        parent = _.find(list, function (item) { return element[pid] === item[id] && element[id] !== item[id] })
      }
      let child = _.filter(list, function (item) { return item[pid] === element[id] && element[id] !== item[id] })

      // 添加图标属性
      if (isUserSystemIcon && !element.icon) {
        element.icon = 'app:tw-icon-file'
      }
      icon && element && (element.icon = icon)
      iconColor && element && (element.iconColor = iconColor)

      if ('children' in element) {
        let diff = _.differenceBy(child, element.children, id)

        diff.length > 0 && (element.children = element.children.concat(diff))
      } else {
        element.children = child
      }

      if (isUserSystemIcon) {
        _(element.children).forEach(function (value) {
          if (!value.icon) {
            value.icon = 'app:tw-icon-file'
          }
        })
      }

      if (parent) {
        let c = _.find(parent.children, [id, element.id])
        if (!c) {
          'children' in parent ? parent.children.push(element)
            : parent.children = [element]
        } else {
          if (isUserSystemIcon) {
            _(c.children).forEach(function (value) {
              let isFolder = isFolderCallback(value)
              if (isFolder) {
                value.icon = 'app:tw-icon-folder'
                value.color = '#ffc107'
              } else {
                value.icon = 'app:tw-icon-file'
                value.color = '#bbc4ca'
              }
            })
          }
        }
      }

      if (parent || !isFindParent) {
        let remove = _.remove(list, function (n) {
          return n[id] === element[id]
        })
        remove.length > 0 && index--
      }
      if (child.length > 0) {
        translator(child, false)
      }
    }
  }
  translator(list)
  return list
}

/**
 * listToTree稳定排序
 * @param {*} list 列表源数据
 * @param {string} [id='id'] idKey
 * @param {string} [pId='parentId'] 父idKey
 * @param {string} icon 指定图标
 * @param {string} iconColor 指定图标颜色
 * @returns tree
 */
export function listToTreeStable (
  list,
  id = 'id',
  pId = 'parentId',
  icon = '',
  iconColor = '') {
  // 设置icon和iconColor
  list.forEach(item => {
    icon !== '' && (item.icon = icon)
    iconColor !== '' && (item.iconColor = iconColor)
  })
  // filter筛选符合条件的元素，返回一个包含所有符合条件的元素的新数组
  return list.filter(item1 => !list.find(item2 => {
    // 如果有父节点
    if (item1[pId] === item2[id]) {
      // 放进它父节点的children数组中；如果children不存在，初始化为空数组
      item2.children = item2.children || []
      !item2.children.some(child => child[id] === item1[id]) && item2.children.push(item1)
    }
    // find返回第一个符合条件的元素，找到后，剩余的元素不再判断
    return item1[pId] === item2[id]
  }))
}
