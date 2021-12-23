<!-- 简历人员头像，姓名，分数展示卡片 -->
<template>
  <div class="row">
    <div
      v-for="view in views"
      :key="view.resumeDeliveryID"
      class="text-center q-pr-sm relative-position"
    >
      <tw-avatar
        size="lg"
        :img="getUrl(view.photo)"
        :name="view.interviewee"
      />
      <div>{{view.interviewee}}</div>
      <div v-if="view.result">{{view.result}}分</div>
      <q-btn
        dense
        rounded
        icon="clear"
        size="xs"
        color="grey-8"
        class="absolute-top-right"
        v-if="removable"
        @click="deleteResumeDeliveryID(view.resumeDeliveryID)"
      />
    </div>
  </div>
</template>

<script>
import { getUrl } from '@/boot/file'
export default {
  name: 'ResumePersonCard',
  props: {
    views: {
      type: Array,
      default () {
        return []
      }
    },
    removable: {
      pe: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
    getUrl,
    deleteResumeDeliveryID (resumeDeliveryID) {
      this.$emit('remove', resumeDeliveryID)
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar')
  }
}

</script>

<style lang='scss' scoped>
</style>
