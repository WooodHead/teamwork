<template>
  <div class="row items-center">
    <!-- btn + line + title + line + homeLink -->
    <q-btn
      outline
      rounded
      color="positive"
      :label="leftBtns[category].label"
      size="md"
      :to="leftBtns[category].to"
    />
    <q-separator />
    <div class="q-px-sm text-h6">{{title}}</div>
    <q-separator />
    <q-btn
      dense
      outline
      round
      color="grey-7"
      icon="more_horiz"
      :to="{name:`${category}Home`}"
    />
  </div>
</template>

<script>
export default {
  name: 'TwModuleGroupTitle',
  props: {
    // 模块名
    category: { type: String, required: true },
    // 标题
    title: { type: String, required: true }
  },
  data () {
    return {
      leftBtns: {
        team: { label: this.$t('action.add'), to: { name: `${this.category}Add` } },
        project: { label: this.$t('action.add'), to: { name: `${this.category}Add` } },
        product: { label: this.$t('action.selection'), to: { name: '' } }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
