<template>
  <q-btn
    :icon="icon"
    :ripple="ripple"
    round
    dense
    unelevated
    :flat="flat"
    :outline="!$q.platform.is.mobile"
    :color="color"
    :size="size"
  >
    <q-menu
      ref="menu"
      :persistent="showing"
      auto-close
      transition-show="jump-down"
      transition-hide="jump-up"
      anchor="top left"
      self="top right"
      :offset="[0, 0]"
      class="z-max"
    >
      <q-list
        style="min-width:120px"
        class="bg-blue-1"
      >
        <div
          v-for="(menu, index) in menus"
          :key="index"
        >
          <q-separator
            v-if="isObject(menu) && index !== 0"
            spaced
          />
          <!-- <q-item-label
            v-if="isObject(menu) && menu.label"
            header
          >
          {{menu.label}}
          </q-item-label> -->
          <template v-if="isObject(menu)">
            <q-item
              v-for="(menuInGroup, index) in menu.group"
              :key="index"
              clickable
              @click="$emit(menuInGroup)"
            >
              <q-item-section avatar>
                <q-icon :name="objMenu[menuInGroup].icon" />
              </q-item-section>
              <q-item-section>
                <label>{{ objMenu[menuInGroup].label }}</label>
              </q-item-section>
            </q-item>
          </template>
          <q-item
            v-else
            clickable
            @click="$emit(menu)"
          >
            <q-item-section avatar>
              <q-icon :name="objMenu[menu].icon" />
            </q-item-section>
            <q-item-section>
              <label>{{ objMenu[menu].label }}</label>
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-menu>
  </q-btn>
</template>
<script>
export default {
  name: 'TwMenu',
  props: {
    icon: {
      type: String,
      required: false,
      default: 'more_horiz'
    },
    flat: {
      type: Boolean,
      required: false,
      default: false
    },
    size: {
      type: String,
      required: false,
      default: 'md'
    },
    noClose: {
      type: Boolean,
      required: false,
      default: false
    },
    color: {
      type: String,
      required: false,
      default: function () {
        return this.$q.platform.is.mobile ? 'primary' : 'grey-7'
      }
    },
    ripple: {
      type: Boolean,
      required: false,
      default: true
    },
    menus: {
      type: Array,
      required: false,
      default () {
        return [
          'edit',
          'move',
          'copy',
          'archive',
          'delete',
          { label: 'share', group: ['publicLink'] }
        ]
      }
    },
    // 是否展开
    showing: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      objMenu: {
        edit: {
          key: 'edit',
          label: this.$t('action.edit'),
          icon: 'edit'
        },
        rename: {
          key: 'rename',
          label: this.$t('action.rename'),
          icon: 'create'
        },
        setWidgets: {
          key: 'setWidgets',
          label: this.$t('action.setWidgets'),
          icon: 'settings'
        },
        move: {
          key: 'move',
          label: this.$t('action.move'),
          icon: 'redo'
        },
        copy: {
          key: 'copy',
          label: this.$t('action.copy'),
          icon: 'content_copy'
        },
        archive: {
          key: 'archive',
          label: this.$t('archive.archive'),
          icon: 'archive'
        },
        bookmark: {
          key: 'bookmark',
          label: this.$t('action.bookmark'),
          icon: 'bookmark_border'
        },
        deleteBookmark: {
          key: 'deleteBookmark',
          label: this.$t('action.deleteBookmark'),
          icon: 'bookmark'
        },
        delete: {
          key: 'delete',
          label: this.$t('action.delete'),
          icon: 'delete'
        },
        moveThem: {
          key: 'moveThem',
          label: this.$t('action.moveThem'),
          icon: 'redo'
        },
        copyThem: {
          key: 'copyThem',
          label: this.$t('action.copyThem'),
          icon: 'content_copy'
        },
        archiveThem: {
          key: 'archiveThem',
          label: this.$t('archive.archiveThem'),
          icon: 'archive'
        },
        deleteThem: {
          key: 'deleteThem',
          label: this.$t('action.deleteThem'),
          icon: 'delete'
        },
        assignedThem: {
          key: 'assignedThem',
          label: this.$t('action.assignedThem'),
          icon: 'touch_app'
        },
        publicLink: {
          key: 'publicLink',
          label: this.$t('action.publicLink'),
          icon: 'link'
        },
        start: {
          key: 'start',
          label: this.$t('action.approval'),
          icon: 'play_arrow'
        },
        done: {
          key: 'done',
          label: this.$t('action.finish'),
          icon: 'stop'
        },
        suspended: {
          key: 'suspended',
          label: this.$t('action.suspended'),
          icon: 'drag_handle'
        },
        activate: {
          key: 'activate',
          label: this.$t('action.activate'),
          icon: 'wb_incandescent'
        },
        insert: {
          key: 'insert',
          label: this.$t('action.insert'),
          icon: 'add'
        },
        addGroup: {
          key: 'addGroup',
          label: this.$t('action.addGroup'),
          icon: 'playlist_add'
        },
        releaseGroup: {
          key: 'releaseGroup',
          label: this.$t('action.releaseGroup'),
          icon: 'playlist_play'
        },
        convertToList: {
          key: 'convertToList',
          label: this.$t('action.convertToList'),
          icon: 'list'
        },
        showcards: {
          key: 'showcards',
          label: this.$t('action.showcards'),
          icon: 'crop_16_9'
        },
        showlist: {
          key: 'showlist',
          label: this.$t('action.showlist'),
          icon: 'list'
        },
        showtable: {
          key: 'showtable',
          label: this.$t('action.showtable'),
          icon: 'grid_on'
        },
        history: {
          key: 'history',
          label: this.$t('action.history'),
          icon: 'query_builder'
        },
        export: {
          key: 'export',
          label: this.$t('action.export', { type: 'Excel' }),
          icon: 'cloud_download'
        },
        exportHour: {
          key: 'exportHour',
          label: this.$t('action.exportHour', { type: 'Excel' }),
          icon: 'library_books'
        },
        exportProjectHour: {
          key: 'exportProjectHour',
          label: this.$t('action.exportProjectHour', { type: 'Excel' }),
          icon: 'library_books'
        },
        send: {
          key: 'send',
          label: this.$t('action.send'),
          icon: 'person_add'
        },
        serviceChart: {
          key: 'serviceChart',
          label: this.$t('action.serviceChart'),
          icon: 'insert_chart'
        },
        serviceDone: {
          key: 'serviceDone',
          label: this.$t('action.serviceDone'),
          icon: 'stop'
        },
        // 招聘模块
        jobStart: {
          key: 'jobStart',
          label: this.$t('action.jobStart'),
          icon: 'play_arrow'
        },
        jobDone: {
          key: 'jobDone',
          label: this.$t('action.jobDone'),
          icon: 'stop'
        },
        recruitPlanStart: {
          key: 'recruitPlanStart',
          label: this.$t('action.recruitPlanStart'),
          icon: 'play_arrow'
        },
        recruitPlanDone: {
          key: 'recruitPlanDone',
          label: this.$t('action.recruitPlanDone'),
          icon: 'stop'
        },
        recruitListStorageAll: {
          key: 'recruitListStorageAll',
          label: this.$t('action.recruitListStorageAll'),
          icon: 'delete_forever'
        },
        recruitListExport: {
          key: 'recruitListExport',
          label: this.$t('action.recruitListExport'),
          icon: 'library_books'
        },
        recruitListImportTestResult: {
          key: 'recruitListImportTestResult',
          label: this.$t('action.recruitListImportTestResult'),
          icon: 'post_add'
        },
        recruitListStartInvite: {
          key: 'recruitListStartInvite',
          label: this.$t('action.recruitListStartInvite'),
          icon: 'mail_outline'
        },
        recruitListSendOffer: {
          key: 'recruitListSendOffer',
          label: this.$t('action.recruitListSendOffer'),
          icon: 'redeem'
        },
        secrecy: {
          key: 'secrecy',
          label: this.$t('action.secrecy'),
          icon: 'lock_outline'
        },
        batchImport: {
          key: 'batchImport',
          label: this.$t('action.batchImport'),
          icon: 'exit_to_app'
        },
        exportPDF: {
          key: 'exportPDF',
          label: this.$t('action.export', { type: 'PDF' }),
          icon: 'picture_as_pdf'
        },
        exportExcel: {
          key: 'exportExcel',
          label: this.$t('action.export', { type: 'Excel' }),
          icon: 'library_books'
        },
        deleteAllInterviewers: {
          key: 'deleteAllInterviewers',
          label: this.$t('interviewer.deleteAllInterviewers'),
          icon: 'delete'
        },
        // 导出报表
        exportReport: {
          key: 'exportReport',
          label: this.$t('action.exportReport'),
          icon: 'library_books'
        },
        showAllFiles: {
          key: 'showAllFiles',
          label: this.$t('action.showAllFiles'),
          icon: 'collections'
        },
        trash: {
          key: 'trash',
          label: this.$t('action.trash'),
          icon: 'delete'
        },
        recallAll: {
          key: 'recallAll',
          label: this.$t('action.recallAll'),
          icon: 'send'
        },
        recall: {
          key: 'recall',
          label: this.$t('action.recall'),
          icon: 'send'
        },
        // 统计
        statistics: {
          key: 'statistics',
          label: this.$t('action.statistics'),
          icon: 'storage'
        },
        // 排行榜
        rankingList: {
          key: 'rankingList',
          label: this.$t('action.rankingList'),
          icon: 'insert_chart'
        },
        // 截屏
        html2Img: {
          key: 'html2Img',
          label: this.$t('action.html2Img'),
          icon: 'add_a_photo'
        },
        // 查看某个人的回答
        seeSomeoneAnswers: {
          key: 'seeSomeoneAnswers',
          label: this.$t('action.seeSomeoneAnswers'),
          icon: 'person'
        },
        // 台账列表
        workRecordList: {
          key: 'workRecordList',
          label: this.$t('action.workRecordList'),
          icon: 'format_list_bulleted'
        },
        // 台账日历
        workRecordCalendar: {
          key: 'workRecordCalendar',
          label: this.$t('action.workRecordCalendar'),
          icon: 'event'
        },
        // 个人台账日历
        personalWorkRecordCalendar: {
          key: 'personalWorkRecordCalendar',
          label: this.$t('action.personalWorkRecordCalendar'),
          icon: 'person'
        },
        // 台账日历
        workRecordDashboard: {
          key: 'workRecordDashboard',
          label: this.$t('action.workRecordDashboard'),
          icon: 'dashboard'
        },
        // 配置仪表盘
        setWorkRecord: {
          key: 'setWorkRecord',
          label: this.$t('action.setWorkRecord'),
          icon: 'dashboard'
        },
        // 配置工作区
        setHomeLayout: {
          key: 'setHomeLayout',
          label: this.$t('home.setHomeLayout'),
          icon: 'settings'
        },
        // 找不到办理人
        canNotFindTransactor: {
          key: 'canNotFindTransactor',
          label: this.$t('action.canNotFindTransactor'),
          icon: 'help'
        },
        // 找不到咨询项
        canNotFindItem: {
          key: 'canNotFindItem',
          label: this.$t('action.canNotFindItem'),
          icon: 'help'
        },
        // 编辑类型
        editType: {
          key: 'editType',
          label: this.$t('action.editType', {
            type: this.$t('dictionary.type')
          }),
          icon: 'edit'
        },
        // 发布
        publish: {
          key: 'publish',
          label: this.$t('action.publish'),
          icon: 'done'
        },
        // 撤销发布
        dropPublish: {
          key: 'dropPublish',
          label: this.$t('action.dropPublish'),
          icon: 'block'
        },
        // 修改封面
        changeCover: {
          key: 'changeCover',
          label: this.$t('action.changeCover'),
          icon: 'swap_horiz'
        },
        preview: {
          key: 'preview',
          label: this.$t('action.preview'),
          icon: 'zoom_in'
        },
        download: {
          key: 'download',
          label: this.$t('action.download'),
          icon: 'file_download'
        },
        viewGroupMembers: {
          key: 'viewGroupMembers',
          label: this.$t('action.viewGroupMembers'),
          icon: 'group'
        }
      }
    }
  },
  watch: {
    showing: {
      immediate: false,
      handler (newVal, oldVal) {
        if (newVal) {
          this.$refs.menu.show()
        } else {
          this.$refs.menu.hide()
        }
      }
    }
  },
  methods: {
    isObject: _.isObject
  }
}
</script>

<style scoped>
.q-item {
  min-height: 30px !important;
}
</style>
