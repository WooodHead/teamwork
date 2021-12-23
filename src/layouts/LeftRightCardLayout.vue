<!--
@Name：左右卡片布局
@Author：陆欢
@date：2021/08/05
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-splitter
    v-model="splitterModel"
    class="row full-width "
    style="flex-grow: 1;"
    :before-class="{'no-left-splitter':!showLeft}"
  >
    <template v-slot:before>
      <!-- 左侧区域 -->
      <div
        :class="[$q.screen.lt.sm?'col-12':'col-md-2']"
        
      >
        <q-card
          class="full-height"
          flat
        >
          <slot name="left"></slot>
        </q-card>
      </div>
    </template>

    <template v-slot:after>
      <!-- 右侧区域 -->
      <div
        :class="[$q.screen.lt.sm?'col-12':'col-md-10']"
        class="items-center"
        style="margin-left: auto;position: relative;display: flex;flex-flow: column;"
      >
        <slot name="right"></slot>
      </div>
    </template>
  </q-splitter>
</template>

<script>
export default {
  name: 'LeftRightCardLayout',
  props: {
    showLeft: { type: Boolean, default: true },
    showRight: { type: Boolean, default: true }
  },
  data () {
    return {
      splitterModel: 18
    }
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style>
.no-left-splitter{
  display: none !important;
}
</style>
