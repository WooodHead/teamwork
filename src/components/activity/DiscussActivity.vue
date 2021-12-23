<!--
 * @Author: your name
 * @Date: 2020-08-07 08:50:36
 * @LastEditTime: 2020-08-10 08:58:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \teamwork\src\components\activity\DiscussActivity.vue
-->
<!--  -->
<template>
  <!-- 其他 -->
  <div class="col text-body1 text-weight-bold text-left">
    <span>
      {{$t(`activity.${activity.widget.type}.${activity.description}`,{name:activity.actor})}}
    </span>
    <a
      class="text-primary"
      href="javascript:void(0);"
      @click="toDetail(activity)"
      v-html="activity.widget.on.title"
    > </a>
    <div
      v-html="activity.widget.detail"
      class="tiptap-content editor__content text-caption"
    />
  </div>
</template>

<script>
export default {
  name: 'DiscussActivity',
  props: {
    activity: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    answer () {
      if (this.activity.widget.on.type === 'answer') {
        return this.$store.getters['checkins/answer'](+this.activity.widget.on.id)
      } else {
        return {}
      }
    }
  },
  components: {
  },
  methods: {
    toDetail (model) {
      switch (model.widget.on.type) {
        case 'question': {
          this.$router.push({
            name: 'questionDetail',
            params: {
              category: model.objectType,
              objectID: +model.objectId,
              id: +model.widget.on.id
            }
          })
          break
        }
        case 'answer': {
          this.$router.push({
            name: 'answer',
            params: {
              category: model.objectType,
              objectID: +model.objectId,
              questionID: +this.answer.questionID,
              answerID: +model.widget.on.id
            }
          })
          break
        }
        case 'task': {
          this.$router.push({
            name: 'taskDetail',
            params: {
              id: +model.widget.on.id,
              category: model.objectType,
              objectID: +model.objectId
            }
          })
          break
        }
        case 'notice': {
          this.$router.push({
            name: 'noticeDetail',
            params: {
              category: model.objectType,
              objectID: +model.objectId,
              id: +model.widget.on.id
            }
          })
          break
        }
        case 'file': {
          this.$router.push({
            name: `${model.widget.on.type}Detail`,
            params: {
              category: model.objectType,
              objectID: +model.objectId,
              id: +model.widget.on.id
            }
          })
          break
        }
        case 'folder': {
          this.$router.push({
            name: `${model.widget.on.type}`,
            params: {
              category: model.objectType,
              objectID: +model.objectId,
              id: +model.widget.on.id
            }
          })
          break
        }
        case 'doc': {
          this.$router.push({
            name: `${model.widget.on.type}Detail`,
            params: {
              category: model.objectType,
              objectID: +model.objectId,
              id: +model.widget.on.id
            }
          })
          break
        }
        case 'event': {
          this.$router.push({
            name: 'eventDetail',
            params: {
              category: model.objectType,
              objectID: +model.objectId,
              id: +model.widget.on.id
            }
          })
          break
        }
        case 'link': {
          this.$router.push({
            name: `${model.widget.on.type}Detail`,
            params: {
              category: model.objectType,
              objectID: +model.objectId,
              id: +model.widget.on.id
            }
          })
          break
        }
        default:
      }
    }
  }
}

</script>

<style lang='scss' scoped>
/deep/.content {
  font-size: 0.85rem;
}
</style>
