<template>
  <div class="row">
    <tw-avatar
      v-if="$q.platform.is.desktop"
      :id="comment.createByID"
      :name="comment.createBy"
      class="q-mt-md"
      size="xl"
    />
    <q-card
      class="bg-grey-1 col"
      flat
    >
      <q-item>
        <q-item-section
          v-if="$q.platform.is.mobile"
          avatar
        >
          <tw-avatar
            size="md"
            :id="comment.createByID"
            :name="comment.createBy"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{comment.createBy}}</q-item-label>
        </q-item-section>
        <q-space />
        <q-item-section side>
          <q-item-label caption>
            {{timeAgo({ dateTime: comment.modifyTime})}}
          </q-item-label>
        </q-item-section>
        <q-item-section
          top
          side
          v-if="isEditable"
        >
          <tw-menu
            v-if="!isEditComment"
            flat
            :menus="['edit','delete']"
            @edit="promptToEdit"
            @delete="promptToDelete"
          />
          <q-btn
            v-else
            round
            icon="close"
            flat
            dense
            @click="onCancel"
          />
        </q-item-section>
      </q-item>
      <q-card-section
        class="content"
        v-if="!isEditComment"
      >
        <div
          v-html="comment.content"
          class="tiptap-content editor__content"
          style="word-wrap: break-word;text-align: initial;"
        ></div>
        <tw-boost-pack
          class="q-mt-sm"
          :objectID="comment.id"
          objectType="discuss"
          messageType="discuss"
          messageTag="Re"
          :messageTitle="objectTitle"
          :subTitle="comment.content"
          :boostTo="comment.createBy"
        />
      </q-card-section>

      <q-card-section
        class="content"
        v-else
      >
        <discuss-editor
          :content="comment.content"
          :id="comment.id"
          @close="onCancel"
          :editable="true"
          :objectID="+comment.objectID"
          :objectType="comment.objectType"
          :objectTitle="objectTitle"
        ></discuss-editor>
      </q-card-section>
    </q-card>
  </div>

</template>
<script>
import { mapActions } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
import timeAgo from '@/utils/time-ago'
import getCategory from '@/mixins/mixins-get-category'
export default {
  name: 'DiscussItem',
  mixins: [getCategory],
  props: {
    comment: {
      type: Object,
      default: null
    },
    editable: {
      type: Boolean,
      default: true,
      description: '是否显示可编辑按钮。如果是true，则默认显示可编辑、删除按钮'
    },
    objectTitle: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isEditComment: false
    }
  },
  components: {
    TwBoostPack: () => import('components/boost/TwBoostPack'),
    TwAvatar: () => import('components/base/TwAvatar'),
    TwMenu: () => import('components/base/TwMenu'),
    DiscussEditor: () => import('components/discuss/DiscussEditor')
  },
  computed: {
    isEditable: {
      get () {
        return this.editable &&
          [+this.categoryModel && this.categoryModel.leaderID, +this.comment.createByID].includes(+this.$myinfo.id)
      }
    },
    objectID () {
      return this.$route.params.objectID || 0
    },
    category () {
      return this.$route.params.category || ''
    }
  },
  methods: {
    timeAgo,
    ...mapActions('discuss', ['deleteComment']),
    ...mapActions('task', ['updateTaskCommentCount']),
    ...mapActions('checkins', ['updateAnswerCommentCount']),
    ...mapActions('notice', ['updateNoticeCommentCount']),
    promptToDelete () {
      var that = this
      showConfirm(this.$t('action.reallyDelete'), () => {
        that.deleteComment(+that.comment.id)
        if (that.comment.objectType === 'task') {
          this.updateTaskCommentCount({
            id: that.comment.objectID,
            isAdd: false
          })
        }
        if (that.comment.objectType === 'answer') {
          this.updateAnswerCommentCount({
            id: that.comment.objectID,
            isAdd: false
          })
        }
        if (that.comment.objectType === 'notice') {
          this.updateNoticeCommentCount({
            id: that.comment.objectID,
            isAdd: false
          })
        }
      })
    },
    promptToEdit () {
      this.isEditComment = true
    },
    onCancel () {
      this.isEditComment = false
    }
  }
}
</script>

<style lang="scss" scoped>
.q-card {
  border-radius: 1rem;
}
.q-item__section--avatar {
  min-width: 40px;
  padding-right: 8px;
}
.content {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
