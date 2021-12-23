<!--
@Name：资源添加组件
@Author：陆欢
@date：2021/06/08
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-btn
    unelevated
    :icon="icon"
    :label="label"
    class="cursor-pointer"
    :color="color"
    :text-color="textColor"
    :rounded="rounded"
    :stack="stack"
    :flat="flat"
    :size="size"
  >
    <q-menu>
      <add-menus-with-template
        :category="category"
        @addingEvent="addingEvent"
      ></add-menus-with-template>
    </q-menu>
  </q-btn>
</template>

<script>
// import { mapActions } from 'vuex'
// import { format } from 'quasar'
// const { capitalize } = format
export default {
  name: 'AddBtnWithTemplate',
  props: {
    category: {
      type: String,
      default: '',
      required: false,
      description: '模块类型'
    },
    stack: {
      type: Boolean,
      default: false
    },
    flat: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'positive'
    },
    label: {
      type: String,
      default: '新建'
    },
    icon: {
      type: String,
      default: 'add'
    },
    rounded: {
      type: Boolean,
      default: true
    },
    textColor: {
      type: String,
      default: 'white'
    },
    size: {
      type: String,
      default: 'md'
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
    addingEvent () {
      this.$emit('addingEvent')
    }
  },
  components: {
    AddMenusWithTemplate: () => import('components/template/AddMenusWithTemplate')
  }
}
</script>

<style scoped>
</style>
