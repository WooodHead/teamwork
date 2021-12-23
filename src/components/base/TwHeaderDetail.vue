<!--
@Name：详情页头部
@Author：陆欢
@date：2021/08/26
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <!-- 移动端 -->
  <tw-header-with-nav
    :title="title"
    v-if="$q.screen.lt.sm"
    :actions="noMenu?[]:actions"
    :select="select"
    :selectOptions="selectOptions"
    @update:select="$emit('update:select', $event)"
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
      <q-space />
      <slot name="right">
        <q-select
          v-if="actions.includes('select')"
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
        </q-select>
      </slot>
      <!-- 菜单 -->
      <div
        v-if="actions.includes('menu')"
        class="q-ml-sm"
      >
        <slot
          name="menu"
          v-if="!noMenu"
        >
          <tw-menu />
        </slot>
      </div>
    </q-toolbar>
  </q-card-section>

</template>

<script>
export default {
  name: 'TwHeaderDetail',
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    noMenu: {
      type: Boolean,
      required: false,
      default: false,
      description: '是否有菜单'
    },
    actions: {
      type: Array,
      required: false,
      default: function () {
        return ['menu']
      },
      description: 'menu,select'
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
    }
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  },
  components: {
    TwMenu: () => import('components/base/TwMenu'),
    TwHeaderWithNav: () => import('components/base/TwHeaderWithNav')
  }
}
</script>

<style scoped>
</style>
