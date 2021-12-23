/**
 * 将树状数据转换成列表数据
 * @param {tree} tree 树状数据
 */
export function TreeToList (tree, list = []) {
  list.push(tree)
  if (tree.parent) {
    TreeToList(tree.parent, list)
  }
  if (tree.children) {
    tree.children.forEach(item => {
      TreeToList(item, list)
    })
  }
  if (tree.Parent) {
    TreeToList(tree.Parent, list)
  }
  if (tree.Children) {
    tree.Children.forEach(item => {
      TreeToList(item, list)
    })
  }
  return list
}
