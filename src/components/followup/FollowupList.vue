<template>
  <div>
    <q-list class="full-width row q-col-gutter-x-md">
      <div
        v-for="followup in followupList"
        :key="followup.id"
        :class="followupList.length>1?'col-6':'col-12'"
      >
        <followup-card
          class="q-mt-sm"
          :model="followup"
        ></followup-card>
      </div>
    </q-list>
    <div
      class="col-12"
      v-if="followupList.length===0"
    >
      <tw-banner-no-result
        class="q-mt-md"
        :info="$t('followup.noFollowups')"
      />
    </div>
  </div>
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
    }
  },
  components: {
    FollowupCard: () => import('components/followup/FollowupCard'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult')
  },
  data () {
    return {
      fromNotice: {}
    }
  },
  computed: {
    ...mapGetters('followup', ['followups']),
    followupList () {
      return (
        this.followups({
          objectID: this.objectID,
          objectType: this.category
        }) || []
      )
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
      this.loadFollowups(this.condition)
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
