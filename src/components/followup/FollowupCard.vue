<template>
  <q-card
    flat
    bordered
    class="followup-card"
    :class="{'archived':model.archived}"
    style="overflow:hidden"
    @click="!expanded"
  >
    <q-item>
      <q-item-section>
        <div class="row q-gutter-xs">
          <q-icon
            :name="iconName"
            :color="iconColor"
            size="sm"
          />
          <span class="text-subtitle2">{{model.contactForm}}跟进</span>
        </div>

      </q-item-section>
      <q-space />
      <q-item-section side>
        <q-item-label caption>
          {{timeAgo({ dateTime: model.modifyTime})}}
        </q-item-label>
      </q-item-section>
      <q-item-section
        top
        side
        v-if="isEditable"
      >
        <q-btn
          v-if="!isEditComment"
          round
          icon="more_horiz"
          flat
          dense
        >
          <q-menu
            auto-close
            cover
          >
            <q-list v-ripple>
              <q-item
                clickable
                @click="promptToEdit()"
              >
                <q-item-section>
                  <div class="row my-icon-word">
                    <q-icon
                      class="q-mr-xs"
                      size="xs"
                      name="edit"
                    />
                    {{$t('followup.edit')}}
                  </div>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                @click="promptToDelete(model.id)"
              >
                <q-item-section>
                  <div class="row my-icon-word">
                    <q-icon
                      class="q-mr-xs"
                      size="xs"
                      name="delete"
                    />
                    {{$t('followup.delete')}}
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
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
      v-if="isEditComment"
    >
      <followup-edit
        :category="model.objectType"
        :objectID="+model.objectID"
        openType="edit"
        :id="+model.id"
        @ok="onOk"
        @cancel="onCancel"
      />
    </q-card-section>
    <q-card-section
      class="q-py-none"
      v-if="!isEditComment"
    >
      <div class="text-caption">
        <!-- 跟进内容 -->
        <span title="跟进内容" v-html="model.content"></span>
      </div>
    </q-card-section>
    <!-- 跟进人 -->
    <q-card-section class="row q-py-none no-wrap q-gutter-xs">
      <template>
        <tw-avatar
          :key="`followup_${model.id}_${model.follower}`"
          :id="model&&model.follower"
          size="sm"
        />
      </template>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { date, LocalStorage } from 'quasar'
import Followup from '@/store/followup/model'
import htmlToText from '@/utils/html-to-text'
import timeAgo from '@/utils/time-ago'
import { showConfirm } from '@/utils/show-confirm'
const { formatDate } = date
export default {
  name: 'FollowupCard',
  props: {
    model: {
      type: Object,
      default: new Followup()
    }
  },
  data () {
    return {
      expanded: false,
      isEditComment: false,
      myself: LocalStorage.getItem('myself')
    }
  },
  computed: {
    ...mapGetters('member', ['membersFilterInService']),
    title () {
      // if (Object.keys(this.model).length) {
      //   return this.membersFilterInService(this.model.members, this.model.leaderID)
      // } else {
      //   return this.model.members
      // }
      return ''
    },
    isEditable: {
      get () {
        return this.myself.id === this.model.createByID
      }
    },
    currContactForm () {
      return _.filter(this.$store.state.followup.contactForm, { 'val': this.model.contactForm })[0]
    },
    iconName () {
      return this.currContactForm.iconName || ''
    },
    iconColor () {
      return this.currContactForm.iconColor || 'green'
    }
  },
  mounted () {

  },
  methods: {
    ...mapActions('followup', ['deleteFollowup']),
    formatDate,
    timeAgo,
    htmlToText,
    promptToDelete (id) {
      var that = this
      showConfirm(this.$t('action.reallyDelete'), () => {
        that.deleteFollowup(id)
      })
    },
    promptToEdit () {
      this.isEditComment = true
    },
    // 编辑确认按钮
    onOk () {
      this.isEditComment = false
    },
    onCancel () {
      this.isEditComment = false
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    'followup-edit': () => import('components/followup/FollowupEdit')
  }
}
</script>

<style scoped lang="scss">
.followup-card:before {
  content: '';
  display: block;
  padding-top: 0px !important;
}
.followup-card:after {
  content: '';
  display: block;
}
@media (min-width: $breakpoint-xs-max) {
  .followup-card {
    width: 100% !important;
    padding: 6px;
    display: block;
  }
}
</style>
