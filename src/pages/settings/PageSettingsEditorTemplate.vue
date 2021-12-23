<!-- 富文本框模板设置 -->
<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <tw-header-card
      :title="$t('settings.editorTemplate')"
      :actions="actions"
      :add="{label:$t('editorTemplate.addLabel'),click:()=>addGroupFormShow=true}"
    />
    <!-- 新建模板Form -->
    <q-card-section
      class="q-px-xxl"
      v-if="addGroupFormShow"
    >
      <editor-template-form-group :addGroupFormShow.sync="addGroupFormShow" />
    </q-card-section>
    <q-card-section
      class="q-px-xxl"
      v-for="dictionary in dictionarys"
      :key="dictionary.id"
    >
      <editor-template-card :dictionary="dictionary"></editor-template-card>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'PageSettingsEditorTemplate',
  data () {
    return {
      actions: ['add'],
      addGroupFormShow: false
    }
  },
  created () {
    this.loadDictionarys('editorTemplate')
    this.$nextTick(() => {
      this.loadEditorTemplates()
    })
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    dictionarys () {
      return this.dictionary['editorTemplate'] ? this.dictionary['editorTemplate']['editorTemplate'] : []
    }
  },
  methods: {
    ...mapActions('dictionary', ['loadDictionarys']),
    ...mapActions('editorTemplate', ['loadEditorTemplates'])
  },
  components: {
    'tw-header-card': () => import('components/base/TwHeaderCard'),
    'editor-template-form-group': () => import('components/editor-template/EditorTemplateFormGroup'),
    'editor-template-card': () => import('components/editor-template/EditorTemplateCard')
  }
}

</script>

<style lang='scss' scoped>
</style>
