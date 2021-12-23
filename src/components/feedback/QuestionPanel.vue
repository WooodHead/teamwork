
<template>
  <div>
    <div class="text-primary text-weight-bold text-white questions-title">{{$t('feedback.questionTitle')}}</div>
    <div class="question-area">
      <q-card
        class="question-card"
        :key="item.id"
        v-for="item in commonProblemList"
        @click="GoToLink(item)"
      >
        <div class="question-title">{{ item.title }}{{ item.extension }}</div>
        <div
          class="question-desc"
          v-html="item.content"
        ></div>
      </q-card>
    </div>
  </div>
</template>
<script>
import { LocalStorage } from 'quasar'
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      myinfo: LocalStorage.getItem('myself')
    }
  },
  computed: {
    ...mapGetters('commonProblem', ['commonProblemList']),
    ...mapState('file', ['imgExts', 'pdfExts', 'threeDExts', 'videoExts', 'audioExts']),
    ...mapGetters('file', ['canPreviewExts'])

  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions('commonProblem', ['loadFeedbackDocuments']),
    init () {
      // 初始化常见问题文档
      let query = [{ Key: 'ParentID', Value: 10, Oper: 'eq' }]
      _.isEmpty(this.commonProblemList) && this.loadFeedbackDocuments({ query })
    },
    GoToLink (item) {
      // 可预览文件
      if (item.classify === 'file') {
        if (this.canPreviewExts.includes(item.extension.toLowerCase())) {
          previewFile(
            item.filePath,
            item.title,
            item.extension,
            this,
            item.id
          )
          // 不可预览文件
        } else {
          window.open('/document/' + `${item.classify}` + '/' + `${item.id}`, '_blank')
        }
        // 外部链接
      } else if (item.classify === 'link') {
        window.open(`${item.filePath}`, '_blank')
        // 其他
      } else {
        window.open('/document/' + `${item.classify}` + '/' + `${item.id}`, '_blank')
      }
    }
  }
}
</script>
<style lang='scss' scoped>
  .questions-title {
    width: 100%;
    height: 105px;
    background-color: $friend;
    text-align: center;
    padding-top: 19px;
    font-size: 16px;
  }
  .question-area {
    padding: 0 15px 20px 15px;
    margin-top: -30px;
  }
  .question-card {
    margin-bottom: 5px;
    padding: 16px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
      rgba(193, 203, 212, 0.7) 0px 0px 0px 1px inset,
      rgb(193, 203, 212) 0px -1px 0px 0px inset;
    cursor: pointer;
  }
  .question-title {
    color: $friend;
    margin-bottom: 5px;
  }
  .question-desc {
    font-size: 13px;
  }
  /deep/ .question-desc img {
    max-width: 100%;
  }
  @media (max-width: $breakpoint-xs-max) {
    .questions-title {
      height: 90px;
      padding-top: 17px;
      font-size: 15px;
    }
    .question-area {
      padding: 0 10px 10px 10px;
      margin-top: -20px;
    }
    .question-card {
      margin-bottom: 5px;
      padding: 12px;
    }
    .question-title {
      margin-bottom: 3px;
      font-size: 13px;
    }
    .question-desc {
      font-size: 12px;
    }
  }
</style>
