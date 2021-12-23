<template>
  <q-item
    v-ripple
    class="cursor-pointer"
    @click.native="$emit('click-item', model)"
  >
    <q-item-section v-if="showAvatar" avatar :class="{ ['q-pr-none']: dense }">
      <tw-avatar :size="dense ? 'md' : 'xl'" :id="leaderId"/>
    </q-item-section>

    <q-item-section class="text-left">
      <q-item-label lines="1" :class="{ 'text-subtitle2': dense }">
        <span class="text-bold">
          {{ title }}
        </span>
        <q-avatar
          v-if="model && model.assessCounts > 0"
          color="primary"
          text-color="white"
          size="xs"
          >{{ model.assessCounts }}</q-avatar
        >
      </q-item-label>
      <q-item-label caption :lines="dense ? 1 : 2">
        {{
          formatDate(
            model.createTime && model.createTime.replace(/-/g, "/"),
            "YYYY-MM-DD"
          )
        }}
        <span
          v-html="
            model.assessRequire && model.assessRequire.replace(/<\/?.+?>/g, '')
          "
        ></span>
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-badge align="top" class="q-pa-xs q-mr-md" :color="result.color">
        {{result.label}}
        </q-badge>
    </q-item-section>
  </q-item>
</template>

<script>
import { date } from 'quasar'
import Assess from '@/store/assess/model'
const { formatDate } = date
export default {
  props: {
    category: {
      type: String
    },
    model: {
      type: Object,
      default: new Assess(),
      required: true
    },
    dense: {
      type: Boolean,
      default: false,
      required: false
    },
    showAvatar: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      leaderId: 0,
      title: ''
    }
  },
  computed: {
    result () {
      if (this.model.result && this.model.result !== 0) {
        return this.model.result === 1
          ? { color: 'positive', label: '能做' }
          : { color: 'orange', label: '不能做' }
      } else {
        return { color: 'indigo', label: '待评估' }
      }
    }
  },
  mounted () {
    // 从商机页面打开评估，展示生产单位的信息
    if (this.category === 'opportunity') {
      this.leaderId = this.model.manufacturerLeaderID || this.model.createByID
      this.title = this.model.manufacturerName
    } else {
      // 展示商机的信息
      this.leaderId = this.model.leaderID
      this.title = this.model.title
    }
  },
  methods: {
    formatDate
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar')
  }
}
</script>

<style scoped>
.q-item__section--avatar {
  min-width: 38px;
}
</style>
