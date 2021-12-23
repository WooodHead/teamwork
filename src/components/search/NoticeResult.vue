<template>
  <div>
    <div>
      <a
        class="text-primary text-weight-bold "
        href="javascript:void(0);"
        @click="toDetail(notice)"
        v-html="title"
      ></a>
      <div
        class="q-mt-sm tiptap-content bg-grey-1 editor__content"
        v-html="notice.content"
      >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    notice: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    title () {
      return '公告："' + this.notice.title + '"'
    }
  },
  components: {
  },
  methods: {
    toDetail (model) {
      this.$router.push({
        name: 'noticeDetail',
        params: {
          category: model.objectType,
          objectID: +model.objectID,
          id: +model.id
        }
      })
    }
  },
  mounted () {
  }
}

</script>

<style>
</style>
