<template>
  <tw-header-with-nav
    v-if="$q.screen.lt.sm"
    :title="title"
    :actions="actions"
    :add="add"
    :select="select"
    :selectLabel="selectLabel"
    :selectOptions="selectOptions"
    :showOrderReverse="showOrderReverse"
    @update:select="$emit('update:select', $event)"
    @update:order="$emit('update:order')"
  >
    <template #titleAppend>
      <slot name="titleAppend" />
    </template>
    <template #menu>
      <slot name="menu" />
    </template>
    <template #add>
      <slot name="add" />
    </template>
    <template #right>
      <slot name="right" />
    </template>
  </tw-header-with-nav>
  <!-- PC端 -->
  <q-card-section
    v-else
    class="q-pa-none q-pt-md"
  >
    <q-toolbar class="q-px-lg q-pb-sm">
      <slot name="add">
        <q-btn
          v-if="intersection(actions,['add','select','other']).length"
          rounded
          unelevated
          color="positive"
          ref="add"
          icon="add"
          :label="add.label"
          @click="add.click"
          :class="{'invisible':!actions.includes('add')}"
          no-caps
          :disable = "add.disable"
        />
      </slot>
      <!-- 菜单对称占位所用，保持左右对称 -->
      <q-btn
        v-if="actions.includes('menu')"
        color="primary"
        dense
        flat
        round
        icon="navigate_before"
        class="q-ml-sm invisible"
      />
      <q-toolbar-title
        v-if="title"
        class="row no-wrap items-center justify-center q-px-sm"
      >
        <span class="ellipsis">{{title}}</span>
        <slot name="titleAppend">
        </slot>
      </q-toolbar-title>
      <q-space v-else />
      <slot name="right">
        <q-select
          v-if="intersection(actions,['add','select','other']).length"
          :class="{'invisible':!intersection(actions,['select','other']).length}"
          :value="select"
          @input="$emit('update:select', $event)"
          :options="selectOptions"
          :label="selectLabel"
          dense
          emit-value
          map-options
          options-dense
          outlined
          rounded
        >
          <template v-slot:prepend>
            <q-btn
              v-if="showOrderReverse"
              round
              dense
              flat
              icon="swap_vert"
              @click.stop="$emit('update:order')"
            />
          </template>
        </q-select>
      </slot>
      <!-- 菜单 -->
      <div
        v-if="actions.includes('menu')"
        class="q-ml-sm"
      >
        <slot name="menu">
          <tw-menu />
        </slot>
      </div>
    </q-toolbar>
    <q-separator />
  </q-card-section>
</template>

<script>

export default {
  name: 'TwHeaderCard',
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
          },
          disable: false
        }
      }
    },
    select: {
      type: String,
      required: false,
      default: ''
    },
    selectLabel: {
      type: String,
      required: false,
      default: undefined
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
  components: {
    TwMenu: () => import('components/base/TwMenu'),
    TwHeaderWithNav: () => import('components/base/TwHeaderWithNav')
  },
  methods: {
    intersection: _.intersection
  }
}
</script>

<style lang="scss" scoped>
</style>
