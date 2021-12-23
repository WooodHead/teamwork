import app from './app'
import settings from './settings'
import task from './task'
import document from './document'
import contacts from './contacts'
import discuss from './discuss'
import consult from './consult'
import message from './message.js'
import checkins from './checkins'
import order from './order'
import boost from './boost'
import person from './person'
import history from './history'
import push from './push'
import member from './member'
import wexin from './wexin'
import dashboard from './dashboard'
import workHour from './workHour'
import qrcode from './qrcode'
import feedback from './feedback'
import resume from './resume'
import workRecord from './workRecord'
import state from './state'
import recruitment from './recruitment'

const index = {
  isoName: 'en-us',
  nativeName: 'English (US)',
  // quasar 组件数据，为了不重复定义，在此列出，这部分使用时按照quasar的方式引入，如
  // vue的template中{{$q.lang.label.clear}},
  // vue的script中this.$q.lang.label.clear
  // js中，import {Quasar} from "quasar", Quasar.lang.label.clear
  label: {
    clear: 'Clear',
    ok: 'OK',
    cancel: 'Cancel',
    close: 'Close',
    set: 'Set',
    select: 'Select',
    reset: 'Reset',
    remove: 'Remove',
    update: 'Update',
    create: 'Create',
    search: 'Search',
    filter: 'Filter',
    refresh: 'Refresh',
    edit: 'Edit',
    delete: 'Delete'
  },
  // date: {
  //   days: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
  //   daysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
  //   months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
  //   monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
  //   firstDayOfWeek: 0, // 0-6, 0 - Sunday, 1 Monday, ...
  //   format24h: false
  // },
  table: {
    noData: 'No data available',
    noResults: 'No matching records found',
    loading: 'Loading...',
    selectedRecords: function (rows) {
      return rows === 1
        ? '1 record selected.'
        : (rows === 0 ? 'No' : rows) + ' records selected.'
    },
    recordsPerPage: 'Records per page:',
    allRows: 'All',
    pagination: function (start, end, total) {
      return start + '-' + end + ' of ' + total
    },
    columns: 'Columns'
  },
  resource: {
    task: 'new list',
    workHour: 'working hour'
  },
  editor: {
    url: 'URL',
    bold: 'Bold',
    italic: 'Italic',
    strikethrough: 'Strikethrough',
    underline: 'Underline',
    unorderedList: 'Unordered List',
    orderedList: 'Ordered List',
    subscript: 'Subscript',
    superscript: 'Superscript',
    hyperlink: 'Hyperlink',
    toggleFullscreen: 'Toggle Fullscreen',
    quote: 'Quote',
    left: 'Left align',
    center: 'Center align',
    right: 'Right align',
    justify: 'Justify align',
    print: 'Print',
    outdent: 'Decrease indentation',
    indent: 'Increase indentation',
    removeFormat: 'Remove formatting',
    formatting: 'Formatting',
    fontSize: 'Font Size',
    align: 'Align',
    hr: 'Insert Horizontal Rule',
    undo: 'Undo',
    redo: 'Redo',
    heading: 'Heading',
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    heading4: 'Heading 4',
    heading5: 'Heading 5',
    heading6: 'Heading 6',
    paragraph: 'Paragraph',
    code: 'Code',
    size1: 'Very small',
    size2: 'A bit small',
    size3: 'Normal',
    size4: 'Medium-large',
    size5: 'Big',
    size6: 'Very big',
    size7: 'Maximum',
    defaultFont: 'Default Font',
    viewSource: 'View Source'
  },
  tree: {
    noNodes: 'No nodes available',
    noResults: 'No matching nodes found'
  },
  // 通用的自定义数据，按照vue-i18n方式引入，
  // vue的template中{{$t("title.confirm")}},
  // vue的script中this.$t("title.confirm")
  // js中，import i18n from "../boot/i18n", i18n.t("title.confirm")
  date: {
    MMDD: 'ddd,MMM DD',
    YYYYMMDD: 'MM DD,YYYY',
    day: 'day',
    hour: 'hour',
    minite: 'minite'
  },
  title: {
    confirm: 'Confirm',
    error: 'Error'
  },
  toolbar: {
    search: 'Search',
    sortBy: 'Sort by',
    noSearchResults: 'No results matched your search.'
  },
  action: {
    save: 'Save',
    submit: 'Submit',
    continue: 'Continue',
    cancel: 'Cancel',
    confirm: 'Confirm',
    add: 'Add',
    edit: 'Edit',
    update: 'Update',
    apply: 'Apply',
    reallyDelete: 'Really delete?',
    pleaseGiveDeletionNotes: 'Please give deletion notes.',
    send: 'Send this to someone',
    html2Img: 'html to img'
  },
  base: {
    editedBy: '{action}ed by {person} {time}',
    resourceOrganize: 'Organize'
  }
}
// 合并单独维护的模块数据，按照vue-i18n方式引入，
// vue的template中{{$t("task.added")}},
// vue的script中this.$t("task.added")
// js中，import i18n from "../boot/i18n", i18n.t("task.added")
Object.assign(index, {
  app,
  settings,
  task,
  document,
  contacts,
  discuss,
  consult,
  message,
  checkins,
  order,
  boost,
  person,
  history,
  push,
  member,
  wexin,
  dashboard,
  workHour,
  qrcode,
  feedback,
  resume,
  workRecord,
  state,
  recruitment
})
export default index
