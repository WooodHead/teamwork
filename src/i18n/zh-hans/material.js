export default {
  module: 'BOM对比',
  title: 'BOM对比',
  add: '添加',
  edit: '编辑',
  importMaterial: '导入明细表',
  step: {
    select: '选择明细表',
    filecheck: '文件校验',
    datacheck: '数据校验',
    import: '导入',
    upload: '上传'
  },
  Precautions: '<div>注意事项：</div><div> 1、模板中的表头名称不可更改，表头行不能删除</div><div>2、必须含有标题列，标题顺序不可调整</div><div>3、文件中数据中不能有删除线</div><div>4、不能解析图片,文件中不能含有图片</div><div>5、日期格式为2021-01-01或20210101,不能为2021/01/01</div>',
  noSearchMaterial: '没有匹配的明细表',
  noMaterialPk: '您还未选择要对比的明细表!',
  pkType: {
    machinetool: '整机',
    grouppart: '组部件'
  },
  moreLimit: '对比数量不得超过10个,不得少于两个',
  selectMaterial: '选择明细表',
  startPK: '开始对比',
  materialPK: '明细对比',
  exportData: '导出数据',
  allMaterial: '所有明细',
  allFiles: '所有文件',
  pkResult: '物料明细对比结果.xlsx'
}
