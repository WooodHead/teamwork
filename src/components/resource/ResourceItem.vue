<template>
  <q-item
    clickable
    @click="$emit('click',resource)"
    :class="{'q-px-none':$q.screen.lt.sm}"
  >
    <q-item-section
      avatar
      :style="$q.screen.gt.sm?'':'min-width:0px'"
    >
      <tw-avatar
        size="md"
        :id="resource[owner[category]||'owner']"
      />
    </q-item-section>
    <q-item-section>
      <q-item-label style="word-wrap: break-word;">{{ resource.title||resource.name}}
        <q-badge
          v-if="category==='person'&&!resource.inService"
          color="orange"
          :label="$t('person.leaveOffice')"
          outline
        />
        <q-badge
          v-if="category==='person'&&!resource.activated&&resource.inService"
          color="orange"
          label="禁用"
          outline
        />
      </q-item-label>
      <q-item-label
        lines="1"
        caption
      >
        {{ htmlToText(resource.notes)||(category==='person'?`${resource.dutyName} • ${resource.orgShortName}`:'')}}
      </q-item-label>
    </q-item-section>
    <slot>
    </slot>
  </q-item>
</template>

<script>
import { mapActions } from 'vuex'
import { format } from 'quasar'
import htmlToText from '@/utils/html-to-text'
const { capitalize } = format
export default {
  name: 'ResourceItem',
  props: {
    category: {
      type: String,
      required: false,
      default: 'person'
    },
    id: {
      type: Number,
      required: false,
      default: 0
    },
    resource: {
      type: Object,
      required: false,
      default: () => null
    }
  },
  data () {
    return {
      owner: {
        project: 'leaderID',
        organize: 'leaderID',
        person: 'id',
        team: 'leaderID',
        productDev: 'leaderID'
      }
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar')
  },
  mounted () {
    if (!this.resource) {
      const category = this.loadCategory(this.category)
      if (category.custom) {
        this.loadCustomCategoryOfItem(this.category, this.id)
          .then(item => { this.resource = item })
      } else {
        this.$store.dispatch(`${this.category}/load${capitalize(this.category)}`, this.id)
          .then(item => { this.resource = item })
      }
    }
  },
  methods: {
    ...mapActions('resource', ['loadCategory', 'loadCustomCategoryOfItem']),
    htmlToText
  }
}
</script>
<style></style>
