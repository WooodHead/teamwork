<template>
  <q-card
    class="text-center widget-card document-file-card
    .document-file-card"
    style="overflow:hidden"
  >
    <!-- <div class="absolute-top-left trash-tip">
      <q-chip
        square
        color="primary"
        text-color="white"
        style="z-index: 8;"
      >
        {{trashType}}
      </q-chip>
    </div> -->
    <q-card-section class="absolute-top q-pa-sm text-caption text-grey-8 delete-info">
      <!-- {{model.deleteBy===myself.name?'':model.deleteBy}} 删除于 {{model.deleteTime}} -->
      {{$t('trash.tips.notes',{deleteBy:model.deleteBy, deleteTime:model.deleteTime})}}
    </q-card-section>
    <task-trash-card
      v-if="trashType==='task'"
      :model="model"
    ></task-trash-card>
    <checkins-trash-card
      v-if="['answer', 'question'].includes(trashType)"
      :model="model"
    ></checkins-trash-card>
    <document-trash-card
      v-if="trashType==='document'"
      :model="model"
    ></document-trash-card>
    <notice-trash-card
      v-if="trashType==='notice'"
      :model="model"
    ></notice-trash-card>
    <resource-trash-card
      v-if="trashType==='resource'"
      :model="model"
    ></resource-trash-card>
    <div
      class="absolute-bottom cursor-pointer text-primary text-center q-py-sm bg-white"
      @click="resotreIt()"
    >
      恢复它
    </div>
  </q-card>
</template>

<script>
// import { mapActions } from 'vuex'
import { date, LocalStorage, format } from 'quasar'
import { showWarningMessage } from '@/utils/show-message'
const { capitalize } = format
export default {
  name: 'TrashCard',
  props: {
    model: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  filters: {
    filterModifyTime (value) {
      return date.formatDate(value, 'MM/DD HH:mm')
    }
  },
  data () {
    return {
      myself: LocalStorage.getItem('myself')
    }
  },
  computed: {
    trashType () {
      if (['list', 'item', 'group'].includes(this.model.type)) {
        return 'task'
      } else if (Object.keys(this.model).includes('noticeType')) {
        return 'notice'
      } else if (Object.keys(this.model).includes('questionID')) {
        return 'answer'
      } else if (Object.keys(this.model).includes('cron')) {
        return 'question'
      } else if (['folder', 'doc', 'file', 'link'].includes(this.model.classify)) {
        return 'document'
      } else if (Object.keys(this.model).includes('resourceType')) {
        return 'resource'
      } else {
        return ''
      }
    }
  },
  methods: {
    resotreIt () {
      // 恢复成功后跳转至详情页
      // 恢复失败提示“请重试”
      let undeleteInfo = {
        undeleteName: `${this.trashType}/undelete${capitalize(this.trashType)}`,
        routeName: `${this.trashType}Detail`,
        params: {
          category: this.model.objectType,
          objectID: +this.model.objectId || +this.model.objectID,
          id: +this.model.id
        }
      }
      if (this.trashType === 'answer') {
        undeleteInfo.undeleteName = 'checkins/undeleteAnswer'
        undeleteInfo.routeName = 'answer'
        undeleteInfo.params = {
          category: this.model.objectType,
          objectID: +this.model.objectId,
          questionID: +this.model.questionID,
          answerID: +this.model.id
        }
      } else if (this.trashType === 'question') {
        undeleteInfo.undeleteName = 'checkins/undeleteQuestion'
        undeleteInfo.routeName = 'question'
        undeleteInfo.params = {
          category: this.model.objectType,
          objectID: +this.model.objectId,
          questionID: +this.model.id
        }
      } else if (this.trashType === 'document') {
        if (this.model.classify !== 'folder') {
          undeleteInfo.routeName = `${this.model.classify}Detail`
        } else {
          if (this.model.objectType === 'productCase') {
            undeleteInfo.routeName = 'productCaseHome'
          } else {
            undeleteInfo.routeName = `folder`
          }
        }
      } else if (this.trashType === 'resource') {
        undeleteInfo.undeleteName = `${this.model.resourceType}/undelete${capitalize(this.model.resourceType)}`
        undeleteInfo.routeName = `${this.model.resourceType}Detail`
        undeleteInfo.params = { id: Number(this.model.id) }
      }
      this.$store.dispatch(`${undeleteInfo.undeleteName}`, this.model.id).then(res => {
        if (res) {
          this.$router.push({
            name: `${undeleteInfo.routeName}`,
            params: undeleteInfo.params
          })
        } else {
          showWarningMessage('恢复失败')
        }
      })
    }
  },
  components: {
    TaskTrashCard: () => import('components/trash/TaskTrashCard'),
    CheckinsTrashCard: () => import('components/trash/CheckinsTrashCard'),
    DocumentTrashCard: () => import('components/trash/DocumentTrashCard'),
    NoticeTrashCard: () => import('components/trash/NoticeTrashCard'),
    ResourceTrashCard: () => import('components/trash/ResourceTrashCard')
  }
}
</script>

<style lang="scss" scoped>
.trash-tip {
  .q-chip {
    margin: 0;
  }
}
.delete-info {
  display: none;
  background-color: $primary;
  opacity: 0.8;
  text-align: center;
  z-index: 9;
  color: #fff !important;
}
.widget-card:hover .delete-info {
  display: block;
}
.widget-card:before {
  content: "";
  display: block;
  padding-top: 133% !important;
  // height: 133% !important;
}
.widget-card {
  width: 100%;
}
@media (min-width: $breakpoint-xs-max) {
  .widget-card {
    width: 100% !important;
    display: block;
  }
}
.toolsCard {
  width: 43% !important;
  display: block;
}
.toolsCard .widget-card {
  width: 100% !important;
}
@media (max-width: $breakpoint-xs-max) {
  .toolsCard .toolsCardStyle {
    margin: auto !important;
  }
  .toolsCard .toolsCardStyle.q-card__section--vert {
    padding: 10px;
  }
  .markmap-section /deep/.q-carousel__slide {
    padding: 0;
  }
}
.link-style {
  word-wrap: break-word;
  word-break: break-all;
  color: blue;
}
.q-img {
  width: 4.2em;
  height: 5.45em;
}
img {
  width: 100%;
}
.tiptap-content {
  word-break: break-all;
}
.document-file-card img {
  width: 100%;
}
.secrecy-content {
  background-size: 80%;
}
.secrecy-content /deep/.q-carousel {
  background-color: unset !important;
}
.secrecy-content /deep/.mind-map {
  background-color: unset !important;
}
.card-colorpicker {
  background-image: url(/icons/match-color.svg);
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 1rem;
  display: block;
  position: absolute;
  height: 1rem;
  width: 1rem;
  border: 0;
  padding: 0;
  opacity: 0.33;
  top: 0.2rem;
  right: 0.3rem;
  transform: scale(0.7);
  z-index: 1;
}
.card-colorpicker:hover {
  opacity: 1;
}
.adjustment {
  padding-top: 22px;
}
/deep/ .trashcard-tip {
  width: 70%;
  height: 24px;
  line-height: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #c4d7eb;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  color: white;
  z-index: 8;
}
</style>
