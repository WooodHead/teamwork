<template>
  <div>
    <!-- 验证码输入框 -->
    <dynamic-code-input
      v-if="!isShowPosition"
      @ok="viewPosition"
    />
    <!-- 职级展示 -->
    <position-card
      v-else
      :position="position"
    />
  </div>
</template>

<script>
export default {
  name: 'ViewPosition',
  props: {
    recordNum: {
      type: String,
      require: false,
      default: ''
    },
    positionId: {
      type: String,
      require: false,
      default: '',
      description: '职级ID'
    }
  },
  data () {
    return {
      isShowPosition: false,
      position: {}
    }
  },
  methods: {
    viewPosition (code) {
      let params = this.recordNum && this.positionId ? {
        code,
        recordNum: this.recordNum,
        positionId: this.positionId
      } : {
        code
      }
      let url = this.recordNum && this.positionId ? 'position/getMyPositionInWeChat' : 'position/getMyPosition'
      this.$store.dispatch(url, params).then(res => {
        if (res) {
          // 打开职级卡片
          this.position = res
          this.isShowPosition = true
        }
      })
    }
  },
  components: {
    DynamicCodeInput: () => import('components/position/DynamicCodeInput'),
    PositionCard: () => import('components/position/PositionCard')
  }
}
</script>

<style>
</style>
