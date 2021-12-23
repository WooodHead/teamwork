<template>
  <q-header
    bordered
    class="ground-glass"
    v-if="$q.platform.is.mobile"
  >
    <q-toolbar class="q-pa-xs">
      <slot name="left">
        <q-btn
          color="primary"
          dense
          flat
          round
          icon="close"
          @click="confirm"
        />
      </slot>
      <q-toolbar-title
        class="row no-wrap items-center justify-center q-px-sm text-subtitle1"
        :class="layoutTextColor"
      >
        <span class="ellipsis">{{title}}</span>
        <slot name="titleAppend">
        </slot>
      </q-toolbar-title>
      <!-- 菜单 -->
      <slot name="left">
        <div class="row">
          <q-btn
            v-if="secondary"
            flat
            rounded
            unelevated
            color="primary"
            :label="secondaryLabel"
            @click="$emit('secondary')"
            class="q-mr-sm"
          />
          <q-btn
            unelevated
            rounded
            color="primary"
            :label="primaryLabel"
            type="submit"
          />
        </div>
      </slot>
    </q-toolbar>
  </q-header>
</template>

<script>
/**
 * 表单的头部工具栏，使用时直接放置在card中，不要包裹q-card-section
 */
export default {
  name: 'TwHeaderEdit',
  inject: ['layoutTextColor'],
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    secondary: {
      type: Boolean,
      required: false,
      default: false
    },
    secondaryLabel: {
      type: String,
      required: false,
      default: '保存'
    },
    primaryLabel: {
      type: String,
      required: false,
      default: '确定'
    }
  },
  methods: {
    confirm () {
      this.$q.dialog({
        title: '放弃',
        message: '你编写的内容还没有保存，要放弃么？',
        cancel: true,
        persistent: false
      }).onOk(() => {
        window.history.back()
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }
  }
}
</script>

<style>
</style>
