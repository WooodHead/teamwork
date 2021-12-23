<!-- 淘汰应聘者弹窗 -->
<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">确认结束这个招聘计划吗？</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div>
        注：该操作会将本次招聘计划内所有<b>未入职</b>的应聘者放入人才库。
      </div>
      <div>
        且不会激活第二志愿。
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        color="primary"
        :label="$t('action.confirm')"
        class="text-bold"
        v-close-popup
        @click="ok()"
      />
      <q-btn
        outline
        color="primary"
        :label="$t('action.cancel')"
        type="reset"
        class="q-ml-sm"
        v-close-popup
      />
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: 'RecruitDialogClose',
  props: {
    resumeDeliveryID: {
      type: [Number, String],
      required: false,
      default: 0
    }
  },
  data () {
    return {}
  },
  methods: {
    ok () {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss" scoped></style>
