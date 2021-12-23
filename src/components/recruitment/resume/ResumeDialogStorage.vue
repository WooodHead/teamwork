<!-- 淘汰应聘者弹窗 -->
<template>
  <q-card class="card-grow-in-page">
    <q-card-section>
      <div class="text-h6">简历淘汰入库后会通过短信、邮件通知应聘者</div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        outline
        color="primary"
        :label="$t('action.cancel')"
        type="reset"
        class="q-ml-sm"
        v-close-popup
      />
      <q-btn
        color="primary"
        label="推荐给"
        type="reset"
        class="q-ml-sm"
        @click="$emit('onPushInterviewer')"
        v-close-popup
      />
      <q-btn
        color="primary"
        label="确认淘汰"
        class="text-bold"
        @click="$emit('confirmStorage')"
        v-close-popup
      />
    </q-card-actions>

  </q-card>
</template>

<script>
export default {
  name: 'ResumeDialogStorage'
}

</script>

<style lang='scss' scoped>
</style>
