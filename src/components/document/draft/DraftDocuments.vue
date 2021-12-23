<template>
  <!-- <div :class="['col', {'column items-center':$q.screen.gt.sm}]"> -->
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page q-pa-md"
    :class="{ 'q-px-xl': $q.screen.gt.sm }"
  >
    <q-card-section>
      <q-banner
        rounded
        class="bg-grey-3 text-body1 q-pb-sm"
      >
        <template v-slot:avatar>
          <q-icon
            name="info"
            color="info"
          />
        </template>
        <span> 在你未发布这些草稿之前，只有你能查看，轻点即可编辑~ </span>
      </q-banner>
    </q-card-section>
    <draft-list
      :id="id"
      :category="category"
      :objectID="objectID"
    />
  </q-card>
  <!-- </div> -->
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'DraftDocuments',
  props: {
    id: {
      type: [Number, String],
      default: 0,
      required: false
    },
    category: {
      type: String,
      default: '',
      required: false
    },
    objectID: {
      type: [String, Number],
      required: false,
      default: 0
    }
  },
  created () {
    if (this.category.length > 0 && Number(this.objectID) > 0 && Number(this.id) === 0) {
      this.$store.dispatch(`document/load${capitalize(this.category)}Document`, Number(this.objectID))
        .then(res => {
          callBack && callBack()
        })
    } else {
      this.loadDocument(this.id)
    }
  },
  methods: {
    ...mapActions('document', ['loadDocument'])
  },
  components: {
    'draft-list': () => import('components/document/draft/DraftList')
  }
}
</script>

<style scoped>
</style>
