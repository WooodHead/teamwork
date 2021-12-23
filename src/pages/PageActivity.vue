<template>
  <q-page>
    <!-- 面包屑区域 -->
    <tw-breadcrumbs
      moduleSwitchable
      @switchTo="switchTo"
    ></tw-breadcrumbs>
    <q-card
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page"
    >
      <q-card-section class="q-px-xxl">
        <tw-person-activity
          v-if="category==='person'"
          :id="+objectID"
        ></tw-person-activity>
        <tw-activity
          v-else
          :category="category"
          :objectID="+objectID"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { LocalStorage } from 'quasar'
export default {
  name: 'PageActivity',
  props: {
    category: {
      type: String,
      required: false,
      default: 'person'
    },
    objectID: {
      type: [Number, String],
      required: false,
      default: () => {
        return LocalStorage.getItem('myself').id
      }
    }
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwPersonActivity: () => import('components/activity/TwPersonActivity'),
    TwActivity: () => import('components/activity/TwActivity')
  },
  computed: {
    ...mapState('widget', ['widgets']),
    resource () {
      let { category, objectID } = this
      return { category, objectID }
    }
  },
  watch: {
    resource: {
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        this.setModuleBreadcrumbs()
      }
    }
  },
  methods: {
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs']),
    switchTo (resource) {
      this.$router.replace({
        name: 'activity',
        params: { category: resource.category.name, objectID: +resource.id }
      })
      window.scrollTo(0, 0)
    }
  }
}
</script>
<style scoped></style>
