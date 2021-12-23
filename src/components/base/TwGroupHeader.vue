<template>
  <div class="row items-center">
    <q-btn
      v-if="align==='center'&&leftBtn"
      rounded
      unelevated
      no-caps
      :icon="leftBtn.icon"
      :size="leftBtn.size"
      :color="leftBtn.color"
      :label="leftBtn.label"
      @click="leftBtn.click"
      class="absolute float-right"
    />
    <q-separator
      v-if="align==='center'"
      class="col"
    />
    <slot name="title">
      <div
        class="q-px-sm"
        :class="titleClass"
      >{{title}}</div>
    </slot>
    <q-separator class="col" />
    <q-btn
      v-if="rightBtn"
      rounded
      unelevated
      no-caps
      :icon="rightBtn.icon"
      :size="rightBtn.size"
      :color="rightBtn.color"
      :label="rightBtn.label"
      @click="rightBtn.click"
      class="float-left absolute"
    />
  </div>
</template>

<script>
export default {
  name: 'TwGroupHeader',
  props: {
    title: {
      type: String,
      required: false,
      description: '该属性不使用时，需指定插槽title'
    },
    titleClass: {
      type: String,
      required: false
    },
    align: {
      type: String,
      required: false,
      default: 'center' // center,left
    },
    leftBtn: {
      type: Object,
      required: false,
      default: null,
      description: '左侧按钮对象，如{color:"positive",size:"sm",icon:"add",label:"add",click:add}'
    },
    rightBtn: {
      type: Object,
      required: false,
      default: null,
      description: '右侧按钮对象，如{color:"dark",size:"sm",icon:"menu",label:"menu",click:menu}'
    }
  }
}
</script>

<style>
</style>
