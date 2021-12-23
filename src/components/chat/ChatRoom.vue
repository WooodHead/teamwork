<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page chat-card"
  >
    <!-- 面板标题 -->
    <tw-header-card
      ref="dheader"
      :actions="['menu']"
      :title="$q.platform.is.mobile?'':(person&&person.name)||$t('chat.title')"
    >
      <template #menu>
        <tw-menu
          :menus="menus"
          @showAllFiles="showAllFiles"
          @viewGroupMembers="viewGroupMembers"
        />
      </template>
    </tw-header-card>
    <!-- 消息面板 -->
    <q-card-section
      :style="heightStyle"
      :class="['q-py-none',$q.screen.gt.xs&&'q-px-xl']"
    >
      <chat-message
        :objectID="objectID"
        :category="category"
      />
    </q-card-section>

    <q-separator />
    <!--发送消息-->
    <q-card-actions
      ref="bootm"
      :class="['bg-grey-1',$q.screen.gt.xs&&'q-px-xl']"
    >
      <chat-editor
        dense
        :autogrow="true"
        @send="send"
        :objectID="objectID"
        :category="category"
        :person="person"
      />
    </q-card-actions>
  </q-card>
</template>
<script>
import chatsend from '@/mixins/mixins-chat-send'
const config = require('app/app.config.js')
import { mapActions } from 'vuex'
export default {
  name: 'ChatRoom',
  mixins: [chatsend],
  data () {
    return {
      menus: ['showAllFiles']
    }
  },
  computed: {
    person () {
      if (this.category === 'person') {
        return this.$store.state.person.selectPersons[this.objectID]
      } else {
        return null
      }
    },
    heightStyle () {
      let heightStyle = ''
      if (!this.$q.platform.is.mobile) {
        if (this.category === 'person' && ['service', 'consult'].includes(this.$route.query.type)) {
          // 66代表容器的外边距+header的高度，代表twheader的高度，101代表底部editer的高度，40代表面包屑的高度
          heightStyle = this.$q.screen.height - 16 - 50 - 40 - 67 - 60 - 40
        } else {
          heightStyle = this.$q.screen.height - 16 - 50 - 40 - 67 - 60 - 1
        }
      } else {
        if (this.category === 'person' && this.callHeightStyle(this.person)) {
          heightStyle = this.$q.screen.height - 50 - 40 - 57 - 40 - 22
        } else {
          heightStyle = this.$q.screen.height - 50 - 40 - 57 - 22
        }
      }
      return `height:${heightStyle}px`
    },
    callHeightStyle: function () {
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
    TwMenu: () => import('components/base/TwMenu'),
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    ChatEditor: () => import('components/chat/ChatEditor'),
    ChatMessage: () => import('components/chat/ChatMessage')
  },
  methods: {
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs']),
    showAllFiles () {
      this.$router.push({
        name: 'chatFiles',
        params: {
          category: this.category,
          objectID: this.objectID
        }
      })
    },
    viewGroupMembers () {
      this.$router.push({
        name: 'chatMembers',
        params: {
          category: this.category,
          objectID: this.objectID
        }
      })
    }
  },
  mounted () {
    this.setModuleBreadcrumbs()
    if (this.category === 'group') this.menus = [...this.menus, ...['viewGroupMembers']]
  }
}
</script>

<style scoped lang="scss">
.chat-editor {
  border: 2px solid #d9d9d9;
  border-radius: 0.4rem;
  transition: all 30ms ease-out;
}
.chat-card {
  position: relative;
}
</style>
