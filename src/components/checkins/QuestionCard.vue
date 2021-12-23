<!--
 * @Author: your name
 * @Date: 2020-03-31 14:18:17
 * @LastEditTime: 2020-07-14 19:57:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \teamwork\src\components\checkins\QuestionCard.vue
-->
<template>
  <q-card
    class="cursor-pointer"
    :class="simple?'question-simple-card text-center':'question-card'"
    flat
    bordered
    @click.stop="toQuestion(question.id)"
  >
    <q-card-section>
      <div class="text-subtitle2">
        {{question.cronName}}
      </div>
      <div class="text-h6 text-weight-bold">{{question.content}}</div>
    </q-card-section>
    <q-card-section
      :class="simple?'text-center block':'flex'"
      class="q-gutter-xs"
    >
      <span
        v-for="(id,index) in question.assignedTo"
        :key="index"
      >
        <tw-avatar
          size="md"
          :id="id"
        />
      </span>
    </q-card-section>
  </q-card>
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
    }
  },
  components: {
    'tw-avatar': () => import('components/base/TwAvatar')
  },
  methods: {
    toQuestion (id) {
      this.$router.push({ // 核心语句
        name: 'questionDetail',
        params: {
          category: this.question.objectType,
          objectID: +this.question.objectId,
          id: +id
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.question-card {
  width: 100%;
  height: 100%;
  min-height: 100px;
}
.question-simple-card {
  width: 12rem;
  height: 15rem;
  display: block;
}
</style>
