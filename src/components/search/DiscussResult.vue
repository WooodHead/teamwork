<!--
 * @Author: your name
 * @Date: 2020-09-21 15:12:22
 * @LastEditTime: 2020-10-19 08:37:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \teamwork\src\components\search\DiscussResult.vue
-->

<template>
  <div>
    <div
      class="text-primary text-weight-bold cursor-pointer"
      @click="toDetail(discuss)"
    >{{title}}</div>
    <div
      v-html="discuss.content"
      class="q-mt-sm bg-grey-1 tiptap-content editor__content"
    >
    </div>
  </div>
</template>

<script>
import { format } from 'quasar'
const { capitalize } = format,
  module = {
    event: 'schedule',
    answer: 'checkins',
    folder: 'document',
    doc: 'document'
  }
export default {
  props: {
    discuss: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      Object: ''
    }
  },
  computed: {
    title () {
      if (this.Object.title) {
        return '评论: "' + this.Object.title + '"'
      } else if (this.discuss.objectType === 'answer') {
        return '评论: "' + this.Object.modifyBy + '的回答' + '"'
      } else {
        return '评论:"' + this.Object.name + '"'
      }
    }
  },
  methods: {
    toDetail (model) {
      switch (model.objectType) {
        case 'task': {
          this.$router.push({
            name: 'taskDetail',
            params: {
              category: model.module.type,
              objectID: +model.module.id,
              id: +model.objectID
            }
          })
          break
        }
        case 'question': {
          this.$router.push({
            name: 'questionDetail',
            params: {
              category: model.module.type,
              objectID: +model.module.id,
              id: +model.objectID
            }
          })
          break
        }
        case 'answer': {
          this.$router.push({
            name: 'answer',
            params: {
              category: model.module.type,
              objectID: +model.module.id,
              questionID: +this.Object.questionID,
              answerID: +this.Object.id
            }
          })
          break
        }
        case 'file': {
          this.$router.push({
            name: 'fileDetail',
            params: {
              category: model.module.type,
              objectID: +model.module.id,
              id: +model.objectID
            }
          })
          break
        }
        case 'folder': {
          this.$router.push({
            name: 'folderDetail',
            params: {
              category: model.module.type,
              objectID: +model.module.id,
              id: +model.objectID
            }
          })
          break
        }
        case 'doc': {
          this.$router.push({
            name: 'docDetail',
            params: {
              category: model.module.type,
              objectID: +model.module.id,
              id: +model.objectID
            }
          })
          break
        }
        case 'notice': {
          this.$router.push({
            name: 'noticeDetail',
            params: {
              category: model.module.type,
              objectID: +model.module.id,
              id: +model.objectID
            }
          })
          break
        }
        default:
      }
    }
  },
  mounted () {
    let that = this
    this.$store.dispatch(`${module[that.discuss.objectType] || that.discuss.objectType}/load${capitalize('folder,doc,file'.includes(that.discuss.objectType) ? 'document' : that.discuss.objectType)}`, +that.discuss.objectID)
      .then((res) => {
        this.Object = res
      })
  }
}

</script>

<style lang='stylus' scoped></style>
