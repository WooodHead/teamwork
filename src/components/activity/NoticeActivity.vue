<!-- 公告、文档发送动态 -->
<template>
  <!-- 标题 -->
  <div class="col text-body1 text-weight-bold text-left">
    <span>
      {{$t(`activity.${activity.widget.type}.${activity.description}`,{name:activity.actor})}}
    </span>
    <a
      class="text-primary"
      href="javascript:void(0);"
      @click="toDetail(activity)"
      v-html="activity.widget.title"
    > </a>
    <!-- 接收人列表 -->
    <div class="q-ml-sm text-weight-regular text-caption flex">
      <span> {{$t(`activity.${activity.widget.type}.SendTo`)}}</span>
      <div
        v-for="person in personList"
        :key="person.id"
      >
        <tw-avatar
          :id="person.id"
          :name="person.name"
          :img="person.img"
          size="xs"
        />
        {{person.name}}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'NoticeActivity',
  props: {
    activity: {
      type: Object,
      required: true
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar')
  },
  data () {
    return {
      persons: {}
    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    personList () {
      return (this.selectPersons && this.activity && this.activity.widget && this.activity.widget.detail && _.filter(this.selectPersons, f => _.indexOf(this.activity.widget.detail, f.id) >= 0)) || {}
    }
  },
  methods: {
    toDetail (model) {
      this.$router.push({
        name: model.widget.type === 'document' ? `${model.widget.on.type}Detail` : `${model.widget.type}Detail`,
        params: {
          category: model.objectType,
          objectID: +model.objectId,
          id: model.widget.type === 'document' ? +model.widget.on.id : +model.widget.id
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
