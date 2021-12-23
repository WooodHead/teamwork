<template>
  <div>
    <!-- 工程服务快捷方式定义 -->
    <service-chat-quick-entry
      v-if="$route.query.type==='service'"
      :objectID="objectID"
      :category="category"
      :person="person"
    />
    <consult-chat-quick-entry
      v-else-if="$route.query.type==='consult'"
      :person="person"
    />
    <!-- ...其他模块快捷服务定义 -->

    <!-- 通用的聊天窗口快捷方式 -->
    <div
      v-else-if="!$q.screen.gt.xs&&isOpenCall(person)"
      class="q-pb-sm q-gutter-x-sm"
    >
      <q-btn
        dense
        rounded
        outline
        color="primary"
        label="打电话"
        type="a"
        :href="(person&&person.phone!='')?'tel:'+person.phone:'javascript:void(0);'"
      />
    </div>
  </div>
</template>

<script>
const config = require('app/app.config.js')
export default {
  props: {
    objectID: {
      type: [String, Number],
      required: true,
      default: 0
    },
    category: {
      type: String,
      required: true,
      default: 'person'
    },
    person: {
      type: Object,
      required: false,
      default: null
    }
  },
  computed: {
    isOpenCall: function () {
      return person => {
        if (person && person.dutyLevel && person.dutyLevel > 0) {
          if (config.dutyLevelProtection) {
            return person.dutyLevel >= config.dutyLevelProtection
          } else {
            return person.dutyLevel >= 6
          }
        } else {
          return false
        }
      }
    }
  },
  components: {
    ServiceChatQuickEntry: () => import('components/service/ServiceChatQuickEntry'),
    ConsultChatQuickEntry: () => import('components/consult/ConsultChatQuickEntry')
  }
}
</script>

<style scoped lang="scss">
</style>
