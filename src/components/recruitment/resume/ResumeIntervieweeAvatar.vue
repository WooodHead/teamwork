<!-- 应聘者头像，姓名展示 -->
<template>
  <div class="text-center q-pr-sm relative-position">
    <tw-avatar
      size="md"
      :name="resumeView.interviewee"
      :img="resumeView.photo?getUrl(resumeView.photo):'icons/default-profile.png'"
    />
    <div class="text-grey-9">{{resumeView.interviewee}}</div>
    <div
      v-if="resumeView.result"
      class="text-grey-9"
    >
      {{resumeView.result}}分
    </div>
    <q-btn
      v-if="removable"
      dense
      rounded
      icon="clear"
      size="xs"
      color="grey-8"
      class="absolute-top-right"
      @click="onDeleteID(resumeView.resumeDeliveryID)"
    />
  </div>
</template>

<script>
import { getUrl } from '@/boot/file'
export default {
  name: 'ResumeIntervieweeAvatar',
  props: {
    resumeView: {
      type: Object,
      required: true,
      default: () => null
    },
    removable: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
    getUrl,
    onDeleteID (resumeDeliveryID) {
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
