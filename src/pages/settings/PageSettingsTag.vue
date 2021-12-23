<!-- 资源工具包配置页面 -->
<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <tw-header-card
      :title="$t('settings.tag')"
      :actions="actions"
      :add="{label:$t('tag.addLabel'),click:add}"
    />
    <!-- 新建清单Form -->
    <q-card-section
      class="q-px-xl"
      v-if="adding"
    >
      <tag-form-group @close="adding=false" />
    </q-card-section>
    <tag-group
      v-for="group in tagGroups"
      :key="group.id"
      class="q-px-xl"
      :tag-group="group"
      editable
    ></tag-group>
  </q-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'PageSettingsTag',
  data () {
    return {
      actions: ['add'],
      adding: false
    }
  },
  computed: {
    ...mapGetters('tag', ['tags']),
    ...mapState('dictionary', ['dictionary']),
    tagGroups () {
      return this.dictionary['tag'] ? this.dictionary['tag']['tag'] : []
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TagGroup: () => import('components/tag/TagGroup.vue'),
    'tag-form-group': () => import('components/tag/TagFormGroup')
  },
  methods: {
    ...mapActions('tag', ['loadTags']),
    ...mapActions('dictionary', ['loadDictionarys']),
    add () {
      this.adding = true
    }
  },
  created () {
    this.loadTags()
    this.loadDictionarys('tag')
  }
}

</script>

<style lang='scss' scoped>
</style>
