<!--
@Name：资源新建按钮详情
@Author：陆欢
@date：2021/08/05
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-list>
    <q-item
      v-for="item in addList"
      :key="item.key"
      clickable
      v-close-popup
      @click="item.click"
    >
      <q-item-section avatar>
        <q-icon :name="item.icon" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{item.label}}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
export default {
  name: 'AddMenusWithTemplate',
  props: {
    category: {
      type: String,
      default: '',
      required: false,
      description: '模块类型'
    }
  },
  data () {
    return {
      addList: [
        {
          key: 'add',
          icon: 'add',
          label: this.$t(`${this.category}.add`),
          click: () => { this.$emit('addingEvent') }
        },
        {
          key: 'addFromTemplate',
          icon: 'add',
          label: this.$t(`${this.category}.addFromTemplate`),
          click: () => { this.addFromTemplate() }
        },
        {
          key: 'manageTemplates',
          icon: 'view_module',
          label: this.$t('template.manageTemplates'),
          click: () => { this.manageTemplates() }
        }
      ]
    }
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    addFromTemplate () {
      this.$router.push({ name: `${this.category}AddFromTemplate` })
      this.$emit('selectedAdd')
    },
    manageTemplates () {
      this.$router.push({ name: `${this.category}TemplateManage` })
      this.$emit('selectedAdd')
    }
  }
}
</script>

<style scoped>
</style>
