<template>
  <q-card
    :class="{'card-grow-in-page':!inset}"
    :flat="$q.screen.lt.sm"
  >
    <q-form
      autofocus
      @submit.prevent="$emit('primary')"
    >
      <tw-header-edit
        :title="title"
        :secondary="secondary"
        :secondaryLabel="secondaryLabel"
        :primaryLabel="primaryLabel"
        @secondary="$emit('secondary')"
      >
      </tw-header-edit>
      <q-card-section
        :class="[{'q-px-xxl': !inset},{'q-pt-xl':$q.screen.gt.sm}]"
      >
        <div class="q-gutter-y-md q-pb-md">
          <slot></slot>
        </div>

        <q-card-actions
          v-if="!$q.platform.is.mobile"
          :align="actionAlign"
          class="q-ma-none"
        >
          <q-btn
            rounded
            unelevated
            :label="primaryLabel"
            type="submit"
            color="primary"
            class="q-px-lg"
            :disable="buttonDisable"
          />
          <q-btn
            v-if="secondary"
            rounded
            unelevated
            outline
            :label="secondaryLabel"
            color="primary"
            class="q-px-lg q-ml-md"
            @click="$emit('secondary')"
            :disable="buttonDisable"
          />
        </q-card-actions>
      </q-card-section>
    </q-form>
  </q-card>

</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'TwForm',
  props: {
    inset: {
      type: Boolean,
      default: false,
      desc: '是否独立页面，如果是非独立页面，要去除[card-grow-in-page]等类'
    },
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
    },
    actionAlign: {
      type: String,
      required: false,
      default: 'center'
    },
    buttonDisable: {
      type: Boolean,
      required: false,
      default: false,
      description: '按钮是否被禁用'
    }
  },
  components: {
    TwHeaderEdit: () => import('components/base/TwHeaderEdit')
  },
  created () {
    this.setFooterVisible(false)
  },
  destroyed () {
    this.setFooterVisible(true)
  },
  methods: {
    ...mapMutations('layout', ['setFooterVisible'])
  }
}
</script>

<style>
</style>
