import { i18n } from '@/boot/i18n'
export default {
  module: {

  },
  menu: {
    edit: {
      key: 'edit',
      label: i18n.t('action.edit'),
      icon: 'edit'
    },
    setWidgets: {
      key: 'setWidgets',
      label: i18n.t('action.setWidgets'),
      icon: 'settings'
    },
    move: {
      key: 'move',
      label: i18n.t('action.move'),
      icon: 'redo'
    },
    copy: {
      key: 'copy',
      label: i18n.t('action.copy'),
      icon: 'content_copy'
    },
    archive: {
      key: 'archive',
      label: i18n.t('archive.archive'),
      icon: 'archive'
    },
    delete: {
      key: 'delete',
      label: i18n.t('action.delete'),
      icon: 'delete'
    },
    bookmark: {
      key: 'bookmark',
      label: i18n.t('action.bookmark'),
      icon: 'bookmark_border'
    },
    deleteBookmark: {
      key: 'deleteBookmark',
      label: i18n.t('action.deleteBookmark'),
      icon: 'bookmark'
    },
    publicLink: {
      key: 'publicLink',
      label: i18n.t('action.publicLink'),
      icon: 'link'
    },
    history: {
      key: 'history',
      label: i18n.t('action.history'),
      icon: 'query_builder'
    },
    send: {
      key: 'send',
      label: i18n.t('action.send'),
      icon: 'person_add'
    },
    start: {
      key: 'start',
      label: i18n.t('action.approval'),
      icon: 'play_arrow'
    },
    done: {
      key: 'done',
      label: i18n.t('action.finish'),
      icon: 'stop'
    },
    suspended: {
      key: 'suspended',
      label: i18n.t('action.suspended'),
      icon: 'drag_handle'
    },
    activate: {
      key: 'activate',
      label: i18n.t('action.activate'),
      icon: 'wb_incandescent'
    },
    moveThem: {
      key: 'moveThem',
      label: i18n.t('action.moveThem'),
      icon: 'redo'
    },
    copyThem: {
      key: 'copyThem',
      label: i18n.t('action.copyThem'),
      icon: 'content_copy'
    },
    archiveThem: {
      key: 'archiveThem',
      label: i18n.t('archive.archiveThem'),
      icon: 'archive'
    },
    deleteThem: {
      key: 'deleteThem',
      label: i18n.t('action.deleteThem'),
      icon: 'delete'
    },
    assignedThem: {
      key: 'assignedThem',
      label: i18n.t('action.assignedThem'),
      icon: 'touch_app'
    },
    insert: {
      key: 'insert',
      label: i18n.t('action.insert'),
      icon: 'add'
    },
    addGroup: {
      key: 'addGroup',
      label: i18n.t('action.addGroup'),
      icon: 'playlist_add'
    },
    releaseGroup: {
      key: 'releaseGroup',
      label: i18n.t('action.releaseGroup'),
      icon: 'playlist_play'
    },
    convertToList: {
      key: 'convertToList',
      label: i18n.t('action.convertToList'),
      icon: 'list'
    },
    showcards: {
      key: 'showcards',
      label: i18n.t('action.showcards'),
      icon: 'crop_16_9'
    },
    showlist: {
      key: 'showlist',
      label: i18n.t('action.showlist'),
      icon: 'list'
    },
    showtable: {
      key: 'showtable',
      label: i18n.t('action.showtable'),
      icon: 'grid_on'
    },
    export: {
      key: 'export',
      label: i18n.t('action.export', { type: 'Excel' }),
      icon: 'trending_up'
    },
    exportHour: {
      key: 'exportHour',
      label: i18n.t('action.exportHour', { type: 'Excel' }),
      icon: 'library_books'
    },
    exportProjectHour: {
      key: 'exportProjectHour',
      label: i18n.t('action.exportProjectHour', { type: 'Excel' }),
      icon: 'library_books'
    },
    serviceChart: {
      key: 'serviceChart',
      label: i18n.t('action.serviceChart'),
      icon: 'insert_chart'
    },
    serviceDone: {
      key: 'serviceDone',
      label: i18n.t('action.serviceDone'),
      icon: 'stop'
    },
    rename: {
      key: 'rename',
      label: i18n.t('action.rename'),
      icon: 'create'
    },
    jobStart: {
      key: 'jobStart',
      label: i18n.t('action.jobStart'),
      icon: 'play_arrow'
    },
    jobDone: {
      key: 'jobDone',
      label: i18n.t('action.jobDone'),
      icon: 'stop'
    },
    recruitPlanStart: {
      key: 'recruitPlanStart',
      label: i18n.t('action.recruitPlanStart'),
      icon: 'play_arrow'
    },
    recruitPlanDone: {
      key: 'recruitPlanDone',
      label: i18n.t('action.recruitPlanDone'),
      icon: 'stop'
    },
    secrecy: {
      key: 'secrecy',
      label: i18n.t('action.secrecy'),
      icon: 'lock_outline'
    },
    batchImport: {
      key: 'batchImport',
      label: i18n.t('action.batchImport'),
      icon: 'exit_to_app'
    },
    exportPDF: {
      key: 'exportPDF',
      label: i18n.t('action.export', { type: 'PDF' }),
      icon: 'picture_as_pdf'
    },
    exportExcel: {
      key: 'exportExcel',
      label: i18n.t('action.export', { type: 'Excel' }),
      icon: 'library_books'
    },
    showAllFiles: {
      key: 'showAllFiles',
      label: i18n.t('action.showAllFiles'),
      icon: 'collections'
    },
    trash: {
      key: 'trash',
      label: i18n.t('action.trash'),
      icon: 'delete'
    },
    recallAll: {
      key: 'recallAll',
      label: i18n.t('action.recallAll'),
      icon: 'send'
    },
    recall: {
      key: 'recall',
      label: i18n.t('action.recall'),
      icon: 'send'
    },
    // 统计
    statistics: {
      key: 'statistics',
      label: i18n.t('action.statistics'),
      icon: 'storage'
    },
    // 排行榜
    rankingList: {
      key: 'rankingList',
      label: i18n.t('action.rankingList'),
      icon: 'insert_chart'
    },
    // 截屏
    html2Img: {
      key: 'html2Img',
      label: i18n.t('action.html2Img'),
      icon: 'add_a_photo'
    }
  },
  home: {
    addProject: {
      key: 'addProject',
      label: '新建项目',
      icon: 'add'
    },
    addProductDev: {
      key: 'addProductDev',
      label: '新建' + i18n.t('productDev.title'),
      icon: 'add'
    },
    addTeam: {
      key: 'addTeam',
      label: '新建团队',
      icon: 'add'
    },
    settings: {
      key: 'settings',
      label: '布置工作台',
      icon: 'settings'
    }
  }
}
