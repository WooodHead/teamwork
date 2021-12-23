<template>
  <div class="text-left">
    <div class="text-subtitle2">
      {{question.cronName}}
    </div>
    <div class="text-subtitle2 text-weight-bold ">{{question.content}}</div>
    <div
      v-if="!assignedTo"
      class="row q-gutter-xs"
    >
      <span
        v-for="personID in question.assignedTo"
        :key="personID"
      >
        <tw-avatar
          size="md"
          :id="personID"
        />
      </span>
    </div>
    <div
      class="q-gutter-xs"
      v-else
    >
      <span
        v-for="person in assignedTo"
        :key="person.id"
      >
        <tw-avatar
          size="md"
          :id="person.id"
          :name="person.name"
          :img="person.img"
          :popupCard="false"
        />
      </span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    question: {
      type: Object,
      required: false,
      default: null
    },
    simple: {
      type: Boolean,
      required: false,
      default: false
    },
    // 分享时使用的问题指派人数据
    assignedTo: {
      type: Array,
      required: false
    }
  },
  components: {
    'tw-avatar': () => import('components/base/TwAvatar')
  }
}
</script>
<style lang="scss" scoped>
</style>
