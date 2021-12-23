<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 标题 -->
    <tw-header-card :title="$t('chat.members')"></tw-header-card>
    <!-- 成员显示 -->
    <q-card-section>
      <q-infinite-scroll
        ref="qInfiniteScroll"
        :style="`height:${$q.screen.height-201}px;`"
        class="scroll"
        @load="onLoad"
      >
        <div class="row justify-evenly">
          <person-card
            class="q-my-sm"
            v-for="member in members"
            :key="member.id"
            :id="member.id"
          ></person-card>
        </div>
        <template v-slot:loading>
          <div class="row justify-center q-py-md">
            <q-spinner-dots
              color="primary"
              size="40px"
            />
          </div>
        </template>
      </q-infinite-scroll>
      <tw-banner-no-result v-if="members.length==0" />
    </q-card-section>
</q-card>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
export default {
  name: 'chatMembers',
  props: {
    category: {
      type: String,
      default: '',
      required: false
    },
    objectID: {
      type: [String, Number],
      default: '0',
      required: false
    }
  },
  data () {
    return {

    }
  },
  computed: {
    members () {
      return this.$store.getters['person/personsOfGroup'](this.objectID)
    }
  },
  created () {
    this.loadGroup(this.objectID)
  },
  mounted () {

  },
  watch: {

  },
  methods: {
    ...mapActions('person', ['loadPersons']),
    ...mapActions('group', ['loadGroup']),
    ...mapMutations('person', ['setGroupId', 'initPage']),
    onLoad (index, done) {
      if (index === 1) {
        this.setGroupId(this.objectID)
        this.initPage()
      }
      // 获取用户列表信息
      this.loadPersons({ byPage: true, moduleName: this.category }).then(() => {
        if (this.$store.state.person.page.nextPageToken > -1) {
          done()
        } else {
          done(true)
        }
      })
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    PersonCard: () => import('components/person/PersonCard'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult')
  }
}
</script>

<style scoped lang="scss">

</style>
