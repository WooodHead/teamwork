export default function () {
  return {
    // 列表类型：
    listType: 'my',
    // 是否导入成功
    isImport: false,
    importType: 1,
    // 文件校验表格
    fileTable: {
      columns: { infoCheck: '信息校验', rusult: '校验结果', IsError: '是否异常' },
      rows: { fileName: '文件名称', Code: '产品代码', MatCode: '机械配置码', Type: '明细表类型' }
    },
    // 数据校验表格
    dataTable: {
      columns: [
        {
          name: 'OrderNo',
          required: true,
          label: '序号',
          align: 'left',
          field: 'OrderNo',
          headerClasses: 'text-primary',
          headerStyle: 'font-size: 1em'
        },
        { name: 'Name', align: 'left', label: '物料名称', field: 'Name', headerClasses: 'text-primary', headerStyle: 'font-size: 1em' },
        { name: 'Code', align: 'left', label: '物料代码', field: 'Code', headerClasses: 'text-primary', headerStyle: 'font-size: 1em' },
        { name: 'Graphics', align: 'left', label: '物料图号', field: 'Graphics', headerClasses: 'text-primary', headerStyle: 'font-size: 1em' },
        { name: 'Materials', align: 'left', label: '材料', field: 'Materials', headerClasses: 'text-primary', headerStyle: 'font-size: 1em' },
        { name: 'Version', align: 'left', label: '版本', field: 'Version', headerClasses: 'text-primary', headerStyle: 'font-size: 1em' },
        { name: 'Amount', align: 'left', label: '数量', field: 'Amount', headerClasses: 'text-primary', headerStyle: 'font-size: 1em' },
        { name: 'MaxGraphics', align: 'left', label: '物料最高版本', field: 'MaxGraphics', headerClasses: 'text-primary', headerStyle: 'font-size: 1em' },
        { name: 'CheckResult', align: 'left', label: '差异项', field: 'CheckResult', headerClasses: 'text-primary', headerStyle: 'font-size: 1em' },
        { name: 'Notes', align: 'left', label: '备注', field: 'Notes', headerClasses: 'text-primary', headerStyle: 'font-size: 1em' }
      ],
      excelcolumns: [
        {
          name: 'OrderNo',
          required: true,
          label: '序号',
          align: 'left',
          field: row => row.序号,
          format: val => `${val}`,
          sortable: true,
          headerClasses: 'text-primary',
          headerStyle: 'font-size: 1em;font-weight:bold;'
        },
        { name: 'Name', align: 'left', label: '物料名称', field: '物料名称', sortable: true, headerClasses: 'text-primary', headerStyle: 'font-size: 1em;font-weight:bold;' },
        { name: 'Code', align: 'left', label: '物料代码', field: '物料代码', sortable: true, headerClasses: 'text-primary', headerStyle: 'font-size: 1em;font-weight:bold;' },
        { name: 'Graphics', align: 'left', label: '物料图号', field: '物料图号', sortable: true, headerClasses: 'text-primary', headerStyle: 'font-size: 1em;font-weight:bold;' },
        { name: 'Materials', align: 'left', label: '材料', field: '材料', sortable: true, headerClasses: 'text-primary', headerStyle: 'font-size: 1em;font-weight:bold;' },
        { name: 'Version', align: 'left', label: '版本', field: '版本', sortable: true, headerClasses: 'text-primary', headerStyle: 'font-size: 1em;font-weight:bold;' },
        { name: 'MaxGraphics', align: 'left', label: '物料最高版本', field: '最高版本', headerClasses: 'text-primary', headerStyle: 'font-size: 1em;font-weight:bold;' },
        { name: 'CheckResult', align: 'left', label: '差异项', field: '差异项', headerClasses: 'text-primary', headerStyle: 'font-size: 1em;font-weight:bold;' },
        { name: 'Amount', align: 'left', label: '数量', field: '数量', sortable: true, headerClasses: 'text-primary', headerStyle: 'font-size: 1em;font-weight:bold;' }
        // { name: 'Notes', align: 'left', label: '备注', field: '备注', sortable: true, headerClasses: 'text-primary', headerStyle: 'font-size: 1em;font-weight:bold;' }
      ]
    },
    // 数据校验表格
    columns: ['序号', '代号', '版本', '图号', '名称', '材料', '数量'],
    columusNames: { OrderNo: '序号', Name: '名称', Code: '物料代码', Graphics: '物料图号', Materials: '材料', Version: '版本', Notes: '备注', Amount: '数量' },
    matType: { 1: '机加件明细表', 2: '钣金件明细表', 3: '外购件明细表', 4: '润滑件明细表' },
    bomType: { 1: 'machinetool', 2: 'grouppart' },
    bomNameType: { 1: '整机', 2: '组部件' },
    error: {
      file: '文件已导入',
      modelColumn: '缺少模板列',
      type: '不属于模板类型或未找到',
      productName: '未找到产品名称',
      productCode: '未找到产品代码',
      machineCode: '未找到机械配置码'
    },
    file: {},
    excelFile: {},
    // lessTrueRows: [],
    // lessFlaseRows: [],
    importData: [],
    // 物料modelList
    MatList: [],
    // 导入主表modelList
    MatMainList: [],
    // 导入子表modelList
    MatDetailList: [],
    // 文件modelList
    Files: [],
    // 是否分页
    byPage: false,
    // 是否分页
    byFilesPage: false,
    mainPage: {
      offset: 0,
      limit: 20,
      nextPageToken: 0
    },
    // 文件分页对象定义
    filesPage: {
      offset: 0,
      limit: 20,
      nextPageToken: 0
    },
    tabNames: [{ ID: 'same', FileName: '公共项(数量相同)' }, { ID: 'dif', FileName: '公共项(数量不同)' }],
    checkInfo: { same: { color: 'green', text: '一致' }, none: { color: 'red', text: '不存在' }, high: { color: 'primary', text: '版本较高' }, low: { color: 'cyan', text: '版本较低' } }
  }
}
