<template>
 <div></div>
</template>

<script>
export default {
  name: 'AssessArchived',
  props: {
    // 资源类型
    category: {
      type: String,
      default: '',
      required: false
    },
    objectID: {
      type: [Number, String],
      default: '',
      required: false
    }
  }
}
</script>

<style>

</style>
