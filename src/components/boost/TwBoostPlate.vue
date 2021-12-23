<template>
  <div
    class="flex items-start emoji-font"
    :class="{ 'no-wrap' : $q.platform.is.desktop,'emoji-font':$q.platform.is.win}"
    style="color:#283c46;"
  >
    <!-- 左侧点赞内容 -->
    <div
      class="boost-content cursor-pointer"
      :style="$q.platform.is.desktop ? '' : 'width:100%;'"
      @click="toPage(boostPlate.route)"
    >
      <!-- 头像 -->
      <div
        class="absolute"
        style="top:0.2rem;left:0.2rem;"
      >
        <tw-avatar
          :id="person.id"
          :name="person.name"
          :img="person.img"
          size="md"
        >
          <template>
            <q-badge
              floating
              :color="messageType[boostPlate.type].color"
            >
              <q-icon
                color="white"
                class="rounded-borders"
                :name="messageType[boostPlate.type].icon"
                size="0.6rem"
              />
            </q-badge>
          </template>
        </tw-avatar>
      </div>
      <!-- 内容 -->
      <div class="text-left flex-grow-none">
        <q-item-label
          class="ellipsis text-bold"
          :title="htmlToText(boostPlate.title)"
        >
          {{boostPlate.tag ? $t(`message.tag.${boostPlate.tag}`) : ''}}{{boostPlate.title}}
        </q-item-label>
        <q-item-label
          class="message_content editor__content ellipsis"
          :title="htmlToText(boostPlate.subTitle)"
        >
          {{htmlToText(boostPlate.subTitle)}}
        </q-item-label>
      </div>
    </div>
    <!-- 右侧点赞列表 -->
    <div
      class="boost-container flex items-start"
      :style="$q.platform.is.desktop ? 'margin: 2.3rem 0 0 -1.3rem;':'margin: -1rem 0 0 2rem;'"
    >
      <tw-boost
        v-for="boost in boosts"
        :key="boost.id"
        :model="boost"
      />
    </div>
  </div>
</template>

<script>
import { LocalStorage } from 'quasar'
import { mapState, mapActions } from 'vuex'
import htmlToText from '@/utils/html-to-text'
export default {
  name: 'TwBoostPlate',
  components: {
    TwBoost: () => import('components/boost/TwBoost'),
    TwAvatar: () => import('components/base/TwAvatar')
  },
  props: {
    objectID: {
      type: Number,
      default: 0,
      required: true
    },
    objectType: {
      type: String,
      default: '',
      required: true
    },
    id: {
      type: Number,
      default: 0,
      required: false
    },
    model: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      person: LocalStorage.getItem('myself')
    }
  },
  computed: {
    ...mapState('message', ['messageType']),
    boostPlate () {
      return this.model || this.$store.getters['boost/boostPlate'](+this.id)
    },
    boosts () {
      return this.$store.getters['boost/boostsOfObject'](this.objectID, this.objectType)
    }
  },
  methods: {
    htmlToText,
    ...mapActions('boost', ['loadBoostPlate', 'loadBoostsByObject', 'deleteBoostPlate']),
    toPage (route) {
      this.$router.push({
        name: route.name,
        params: route.params
      })
    }
  },
  created () {
    if (!this.model && this.id !== 0) {
      this.loadBoostPlate(this.id)
    }
    this.loadBoostsByObject({
      objectID: this.objectID,
      objectType: this.objectType
    })
  }
}

</script>

<style lang='scss' scoped>
  .q-badge--floating {
    top: 0;
    right: -0.7rem;
  }
  .q-badge {
    padding: 4px;
    border-radius: 50%;
  }
  .boost-content {
    position: relative;
    width: 20rem;
    min-width: 14.3rem;
    line-height: 1.3;
    border-radius: 1rem;
    border: 1px solid #e5e5e5;
    padding: 2.5rem 1.3rem 1.3rem 2.5rem;
  }
  .boost-container {
    padding: 0.5rem;
    background: #faf8f7;
    z-index: 1;
    border-radius: 2rem;
    border-top-left-radius: 0;
    margin: 2.3rem 0 0 -1.3rem;
  }
  /deep/.message_content h1 {
    line-height: 1.5rem;
  }
</style>
