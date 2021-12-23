<template>
  <tw-form
    @primary="onSubmit"
  >
    <q-input
      v-model="model.title"
      input-class="text-center text-h5"
      :placeholder="$t('wiki.field.placeholder.title')"
      lazy-rules
      :rules="[val => !!val.trim() || $t('wiki.formCerifyRule.title')]"
      autofocus
      debounce="500"
      filled
    />
    <q-input
      v-model="model.notes"
      :placeholder="$t('wiki.field.placeholder.notes')"
      type="textarea"
      debounce="500"
      filled
    /> 
    <q-item-label>设置封面</q-item-label>
    <wiki-cover-picture :model="model"/>
  </tw-form>
</template>

<script>
import Wiki from '@/store/wiki/model'
import { mapActions } from 'vuex'
export default {
  name: 'WikiSpaceForm',
  props: {
    id: {
      type: [String, Number],
      default: 0
    },
    openType: {
      type: String,
      default: 'add'
    } 
  },
  data () {
    return {
      model: new Wiki({
        snapshotPath: '/icons/wiki-cover-picture/picture_11.PNG'
      })
    }
  },
  components: {
    WikiCoverPicture: () => import('components/wiki/WikiCoverPicture'),
    TwForm: () => import('components/base/TwForm')
  },
  mounted () {
    // 新增
    if (this.openType === 'add') {
      if (Object.keys(this.widgets).length) {
        this.model.widgets = this.widgets
      } else {
        let that = this
        this.loadCategory('wiki').then(category => {
          that.model.widgets = that.widgets
        })
      }
    } else { // 编辑
      +this.id && this.loadWiki(+this.id).then(res => {
        if (res) {
          this.model = _.cloneDeep(res)
        }
      })
    }
  },
  computed: {
    widgets () {
      return this.$store.getters['resource/initWidgets']('wiki')
    }
  },
  methods: {
    ...mapActions('wiki', ['addWiki', 'loadWiki', 'updateWiki']),
    ...mapActions('resource', ['loadCategory']),
    onSubmit () {
      // 新增
      if (this.openType === 'add') { 
        this.addWiki(this.model).then(res => {
          if (res) {
            this.$router.push({ 
              name: 'wikiManage',
              params: {
                id: +res.id
              } 
            })
          }
        })
      } else { // 编辑
        this.updateWiki(this.model).then(res => {
          if (res) {
            this.$router.push({ 
              name: 'wikiManage',
              params: {
                id: +res.id
              } 
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
