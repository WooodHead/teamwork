
<template>
  <div>
    <a
      class="text-primary text-weight-bold "
      href="javascript:void(0);"
      @click="toDetail(question)"
      v-html="content"
    ></a>
    <div class="q-mt-sm">
      {{question.cronName}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    question: {
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
    content () {
      return '问题: "' + this.question.content + '"'
    }
  },
  components: {
  },
  methods: {
    toDetail (model) {
      this.$router.push({
        name: 'questionDetail',
        params: {
          category: model.objectType,
          objectID: +model.objectId,
          id: +model.id
        }
      })
    }
  },
  mounted () {
  }
}

</script>

<style lang='stylus' scoped></style>
