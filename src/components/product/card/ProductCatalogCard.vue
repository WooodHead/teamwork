<template>
  <q-card
    class="cursor-pointer text-center widget-card"
    style="overflow:hidden"
  >
    <div class="widget-card-section">

      <!-- 内容区 -->
      <div @click="showCardDetail">
        <q-card-section
          class="q-pt-lg"
          style="margin: 1em 0em 0em;"
        >
          <q-img
            clickable
            :src="element.icon"
            :ratio="4/3"
            class="rounded-borders"
          />
        </q-card-section>
        <q-separator inset />
        <!-- 标题区 -->
        <q-card-section :class="['q-pb-none q-pt-sm',{'q-pt-sm':$q.screen.lt.sm}]">
          <div
            style="overflow: inherit;"
            class="text-h6"
          >
            {{element.title}}
          </div>
        </q-card-section>
      </div>
    </div>
  </q-card>
</template>

<script>
export default {
  name: 'ProductCaseCard',
  props: {
    element: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  methods: {
    showCardDetail () {
      // 选型案例库 执行不同逻辑
      if (this.element.level === 1 && this.element.classification === 'usecase') {
        this.$router.push({ name: 'productCaseHome' })
      } else {
        this.$router.push({ name: 'productDetail', params: { id: this.element.id } })
      }
    }
  },
  components: {
  }
}
</script>

<style lang="scss" scoped>
  .widget-card {
    background-size: cover;
    width: 100%;
  }
  .widget-card:before {
    content: "";
    display: block;
    padding-top: 128% !important;
  }
  @media (min-width: $breakpoint-xs-max) {
    .widget-card {
      width: 11rem !important;
      display: block;
    }
  }
</style>
