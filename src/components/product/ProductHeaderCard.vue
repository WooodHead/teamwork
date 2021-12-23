<template>
  <tw-header-card
    :title="title"
    :actions="actions"
    :add="add"
    :select="select"
    :selectOptions="selectOptions"
  >
    <template #titleAppend>
      <slot name="titleAppend" />
    </template>
    <template #menu>
      <slot v-if="!$q.platform.is.mobile" name="menu" />
      <q-btn-group
        v-else-if="actions.includes('menu')"
        rounded
        unelevated
      >
        <slot name="menu" />
        <q-separator vertical class="q-mx-xs" />
        <q-btn
          flat
          dense
          rounded
          unelevated
          color="primary"
          icon="close"
          :to="{ name: 'home' }"
        />
      </q-btn-group>
      <q-btn
        v-else
        flat
        dense
        rounded
        unelevated
        color="primary"
        icon="close"
        :to="{ name: 'home' }"
      />
    </template>
    <template #add>
      <slot name="add" />
    </template>
    <template #right>
      <slot name="right" />
    </template>
  </tw-header-card>
</template>

<script>
export default {
  name: 'ProductHeaderCard',
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  },
  props: {
    title: {
      type: String,
      required: true
    },
    actions: {
      type: Array,
      required: false,
      default: function () {
        return []
      },
      description: 'menu,add,select,other' // other为右侧自定义的动作
    },
    add: {
      type: Object,
      required: false,
      default: function () {
        return {
          label: this.$t('action.add'),
          click: function () {
            this.$q.notify('新建')
          }
        }
      }
    },
    select: {
      type: String,
      required: false,
      default: ''
    },
    selectOptions: {
      type: Array,
      required: false
    },
    showOrderReverse: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style lang='scss' scoped>
</style>
