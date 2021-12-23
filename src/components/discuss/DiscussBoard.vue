<template>
  <q-card flat>
    <discuss-header
      class="q-mb-lg"
      :length="comments().length"
      :type="type"
    />
    <q-list class="q-gutter-md">
      <discuss-item
        v-for="comment in comments()"
        :key="comment.id"
        :comment="comment"
        :editable="editable"
        :objectTitle="objectTitle"
      ></discuss-item>
    </q-list>
    <div class="row">
      <tw-avatar
        v-if="!showEditor"
        :id="$myinfo.id"
        :name="$myinfo.name"
        class="q-mt-md"
        size="xl"
      />
      <q-input
        v-if="!showEditor"
        class="q-mt-md col"
        type="text"
        :placeholder="`${$t(`discuss.notes.${type}`)}...`"
        filled
        Readonly
        @click="showEditor=true"
      />
      <discuss-editor
        v-if="addable&&showEditor"
        class="q-mt-md"
        :objectID="+objectID"
        :objectType="objectType"
        :objectTitle="objectTitle"
        :type="type"
        @submit="showEditor=false"
        @submitFinished="submitFinished"
      />
    </div>
  </q-card>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'DiscussBoard',
  props: {
    editable: {
      type: Boolean,
      default: true,
      description: '是否显示可编辑按钮。如果是true，则默认显示可编辑、删除按钮'
    },
    type: {
      type: String,
      default: 'discuss',
      description: '标题显示。比如：discuss、communication'
    },
    addable: {
      type: Boolean,
      default: true,
      description: '是否可增加讨论。比如：有的详情页只显示讨论记录，不需要增加功能'
    },
    objectID: {
      type: Number,
      required: true
    },
    objectType: {
      type: String,
      required: true
    },
    objectTitle: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showEditor: false
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    'discuss-header': () => import('components/discuss/DiscussHeader'),
    'discuss-item': () => import('components/discuss/DiscussItem'),
    'discuss-editor': () => import('components/discuss/DiscussEditor')
  },
  computed: {
    ...mapGetters('discuss', ['comments']),
    listenChange () {
      const { objectID, objectType } = this
      return { objectID, objectType }
    }
  },
  methods: {
    ...mapMutations('discuss', ['setObjectID', 'setObjectType']),
    ...mapActions('discuss', ['loadComents']),
    ...mapActions('boost', ['loadBoosts']),
    init () {
      this.setObjectID(this.objectID)
      this.setObjectType(this.objectType)
      this.loadComents({ objectID: this.objectID, objectType: this.objectType }).then(res => {
        if (res) {
          const discussIds = res.map(r => { return r.id })
          if (discussIds && discussIds.length) {
            const query = [
              { Key: 'ObjectType', Value: 'discuss', Oper: 'eq' },
              'and',
              { Key: 'ObjectID', Value: discussIds.join(','), Oper: 'in' }]
            this.loadBoosts({ query })
          }
        }
      })
    },
    /***
     *通知调用者，提交处理完毕
     */
    submitFinished (val) {
      this.$emit('submitFinished', val)
    }
  },
  watch: {
    listenChange () {
      this.init()
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
</style>
