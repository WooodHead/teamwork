<template>
  <div class="widget-card-section text-left full-height">
    <!-- 任务卡片 -->
    <div class="relative-position text-body2">
      <template>
        <q-scroll-area style="height: 180px; max-width: 300px;">
          <!-- 文件夹 -->
          <q-card-section class="q-pt-lg">
            <div class="absolute-top text-center trashcard-tip">公告</div>
            <div class="q-my-sm text-subtitle2 text-center text-weight-bold">{{model.title}}</div>
            <div
              class="q-mb-xs text-caption"
              v-html="model.content"
            ></div>
          </q-card-section>
        </q-scroll-area>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoticeTrashCard',
  props: {
    model: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    // 任务进度
    progress () {
      if (this.model.overview) {
        if (this.model.overview.allCount && this.model.overview.allCount === 0) {
          return 0
        } else {
          return 100 * this.model.overview.finishedAllCount / this.model.overview.allCount
        }
      } else {
        return 0
      }
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
/deep/ .q-checkbox__bg {
  display: inline-block;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  vertical-align: middle;
}
</style>
