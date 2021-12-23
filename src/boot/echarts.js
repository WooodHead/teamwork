import Vue from 'vue'
import ECharts from 'vue-echarts' // 在 webpack 环境下指向 components/ECharts.vue
// 手动引入 ECharts 各模块来减小打包体积
// 图表类型
import 'echarts/lib/chart/bar' // 柱状图
import 'echarts/lib/chart/line' // 折线图
import 'echarts/lib/chart/pie' // 饼图
import 'echarts/lib/chart/scatter' // 散点图
// import 'echarts/lib/chart/effectScatter' // 涟漪散点图
// import 'echarts/lib/chart/candlestick' // K线图
// import 'echarts/lib/chart/radar' // 雷达图
// import 'echarts/lib/chart/heatmap' // 热力图
// import 'echarts/lib/chart/tree' // 树图
// import 'echarts/lib/chart/treemap' // 矩形树图
// import 'echarts/lib/chart/sunburst' // 旭日图
// import 'echarts/lib/chart/map' // 地图
// import 'echarts/lib/chart/lines' // 线图
// import 'echarts/lib/chart/graph' // 关系图
// import 'echarts/lib/chart/boxplot' // 框线图
// import 'echarts/lib/chart/parallel' // 平行坐标
// import 'echarts/lib/chart/gauge' // 仪表盘
import 'echarts/lib/chart/funnel' // 漏斗图
import 'echarts/lib/chart/sankey' // 桑基图
// import 'echarts/lib/chart/themeRiver' // 主题河流图
// import 'echarts/lib/chart/pictorialBar' // 象形柱图
// import 'echarts/lib/chart/custom' // 自定义系列

// 坐标系
import 'echarts/lib/component/polar' // 极坐标系
// import 'echarts/lib/component/geo' // 地理坐标系

// 组件
import 'echarts/lib/component/title' // 标题
import 'echarts/lib/component/legend' // 图例
import 'echarts/lib/component/tooltip' // 提示框
import 'echarts/lib/component/markPoint' // 标注
import 'echarts/lib/component/markLine' // 标线
import 'echarts/lib/component/markArea' // 标域
import 'echarts/lib/component/timeline' // 时间轴
import 'echarts/lib/component/dataZoom' // 数据区域缩放
import 'echarts/lib/component/brush' // 刷选
import 'echarts/lib/component/visualMap' // 视觉映射
import 'echarts/lib/component/toolbox' // 工具栏
import 'echarts/lib/component/graphic' // 自定义图形
import 'echarts/lib/component/dataset' // 数据集

// import 'zrender/lib/svg/svg'

// 自定义主题
import macarons from '../assets/echarts/theme/macarons.json'
import essos from '../assets/echarts/theme/essos.json'
import walden from '../assets/echarts/theme/walden.json'
import infographic from '../assets/echarts/theme/infographic.json'

ECharts.registerTheme('macarons', macarons)
ECharts.registerTheme('essos', essos)
ECharts.registerTheme('walden', walden)
ECharts.registerTheme('infographic', infographic)

Vue.component('v-chart', ECharts)
