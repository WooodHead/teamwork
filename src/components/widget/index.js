const components = {}
const requireComponent = require.context(
  './', // 在当前目录下查找
  false, // 不遍历子文件夹
  /\.vue$/ // 正则匹配 以 .vue结尾的文件
)
requireComponent.keys().forEach(fileName => {
  if (fileName !== './WidgetKit.vue' && fileName !== './WidgetRelated.vue' && fileName !== './WidgetSetting.vue') {
    const component = requireComponent(fileName)
    components[fileName.replace(/^\.\/(.*)\.\w+$/, '$1')] = component.default
  }
})
export default components
