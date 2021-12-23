<!-- 面试官头像，姓名展示 -->
<template>
  <div class="text-center q-pr-sm relative-position">
    <tw-avatar
      size="md"
      :id="id"
    />
    <div class="text-grey-9">{{name}}</div>
    <q-btn
      v-if="removable"
      dense
      rounded
      icon="clear"
      size="xs"
      color="grey-8"
      class="absolute-top-right"
      @click="onDeleteID()"
    />
  </div>
</template>

<script>
export default {
  name: 'ResumeInterviewerAvatar',
  props: {
    id: {
      type: [String, Number],
      required: true,
      default: 0
    },
    removable: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
    }
  },
  computed: {
    name () {
      if (+this.id === 0) {
        return '未指定'
      } else {
        let person = this.$store.state.person.selectPersons[+this.id]
        if (person) {
          return person.name || '错误数据（无姓名）'
        } else {
          return '禁用'
        }
      }
    }
  },
  methods: {
    onDeleteID () {
      this.$emit('remove', this.id)
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar')
  }
}

</script>

<style lang='scss' scoped>
</style>
