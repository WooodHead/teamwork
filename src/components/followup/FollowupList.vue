<template>
  <q-list class="full-width">
    <div
        v-for="followup in followupList"
        :key="followup.id"
      >
        <followup-card
          class="q-mt-sm"
          :model="followup"
        ></followup-card>
      </div>
  </q-list>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'FollowupList',
  props: {
    // 资源类型
    category: {
      type: String,
      default: '',
      required: false
    },
    // 资源ID
    objectID: {
      type: [Number, String],
      default: '',
      required: false
    },
    openType: {
      type: String,
      default: 'add'
    }
  },
  components: {
    'FollowupCard': () => import('components/followup/FollowupCard')
  },
  data () {
    return {
      fromNotice: {}
    }
  },
  computed: {
    ...mapGetters('followup', ['followups']),
    followupList () {
      return this.followups({ objectID: this.objectID, objectType: this.category }) || []
    },
    condition () {
      return {
        query: [
          { Key: 'ObjectType', Value: this.category, Oper: 'eq' },
          'and',
          { Key: 'ObjectID', Value: this.objectID, Oper: 'eq' }
        ],
        returnData: false
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions('followup', ['loadFollowups']),
    init () {
      this.loadFollowups(this.condition).then(data => {
        console.log(data)
      })
    }
  }
}
</script>

<style scoped>
.ghost {
  border-radius: 4px;
  background-color: #ecf9fd;
}
.chosen {
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12);
}
</style>
