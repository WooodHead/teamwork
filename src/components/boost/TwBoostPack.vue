<template>
  <div class="bg-blue-grey-1 boost-pack row">
    <tw-boost
      v-for="boost in boosts"
      :key="boost.id"
      :model="boost"
    />
    <q-btn
      v-if="!adding"
      round
      size="9.335px"
      class="q-ma-xs"
      color="white"
      v-ripple
      @click="adding=true"
    >
      <img
        style="max-width: 2em;"
        alt="boost img"
        src="~assets/boost.svg"
      />
    </q-btn>

    <tw-boost-add
      v-else
      @ok="onOk"
      @cancel="adding=false"
    />
  </div>
</template>

<script>
import { LocalStorage } from 'quasar'
import { mapActions } from 'vuex'
export default {
  components: {
    TwBoost: () => import('components/boost/TwBoost'),
    TwBoostAdd: () => import('components/boost/TwBoostAdd')
  },
  props: {
    objectID: {
      type: [Number, String],
      required: true,
      description: '获赞资源ID'
    },
    objectType: {
      type: String,
      required: true,
      description: '获赞资源类型'
    },
    boostTo: {
      type: String,
      required: true,
      default: '曹冠雄',
      description: '获赞人名字'
    },
    messageTitle: {
      type: String,
      required: true,
      description: '资源对应的 message 标题'
    },
    messageType: {
      type: String,
      required: false,
      default: 'boost',
      description: '对应 message.state 中的 messageType'
    },
    messageTag: {
      type: String,
      required: false,
      default: 'Boost',
      description: '对应 i18n 中的 tag'
    },
    subTitle: {
      type: String,
      required: false,
      default: '',
      description: '获赞内容,'
    }
  },
  data () {
    return {
      adding: false,
      myInfo: LocalStorage.getItem('myself')
    }
  },
  computed: {
    boosts () {
      return this.$store.getters['boost/boostsOfObject'](this.objectID, this.objectType)
    }
  },
  methods: {
    ...mapActions('boost', ['addBoost', 'loadBoostsByObject']),
    onOk (boost) {
      // 设置 boost 对象
      boost.receiveBy = this.boostTo
      boost.senderID = this.myInfo.id
      boost.senderName = this.myInfo.name
      boost.senderImg = this.myInfo.img
      boost.objectID = this.objectID
      boost.objectType = this.objectType
      boost.boostPlate = this.getBoostPlate() // 设置 boostPlate 接口属性,
      this.addBoost(boost).then(res => {
        this.adding = false
      })
    },
    getBoostPlate () {
      let plate = {
        objectID: this.objectID,
        objectType: this.objectType,
        route: this.$route,
        senderID: this.myInfo.id,
        senderName: this.myInfo.name,
        senderImg: this.myInfo.img,
        type: this.messageType,
        tag: this.messageTag,
        title: this.messageTitle,
        subTitle: this.subTitle,
        receiveBy: this.boostTo
      }
      return plate
    }
  },
  created () {
    this.loadBoostsByObject({
      objectID: this.objectID,
      objectType: this.objectType
    })
  }
}
</script>

<style lang="scss" scoped>
  .boost-pack {
    border-radius: 16px;
    display: inline-flex;
    flex-wrap: wrap;
    max-width: 100%;
    position: relative;
  }
</style>
