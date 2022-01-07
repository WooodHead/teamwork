<template>
  <q-card
    flat
    bordered
    class="followup-card cursor-pointer"
    style="overflow: hidden"
    @click="openFollowupDetail"
  >
    <q-item>
      <div>
        <q-item-section>
          <div class="row items-center">

            <div
              style="display:inline;width:300px;"
              class="q-pl-sm"
            >
              <!-- 标题 -->
              <span
                title="标题"
                class="text-h6 ellipsis-2-lines"
              >{{model.title}}</span>
            </div>
            <!-- 跟进方式 -->
            <div
              style="display:inline;"
              class="q-ml-sm q-mx-none"
            >
              <q-badge
                class="q-mx-none q-px-sm"
                :color="iconColor"
                align="bottom"
              >
                <span>
                  {{ model.contactForm }}
                </span>
              </q-badge>
            </div>

          </div>

        </q-item-section>

      </div>
      <q-space />
      <q-item-section side>
        <q-item-label caption>
          {{formatDate(model.followupDate,'YYYY-MM-DD')}}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-card-section class="q-py-none">
      <!-- 跟进内容 -->
      <div
        class="text-caption ellipsis-2-lines q-pl-sm"
        v-html="htmlToText(model &&model.content)"
        :title="htmlToText(model &&model.content)"
      >
      </div>
    </q-card-section>
    <!-- 跟进人 -->
    <div class="q-pl-sm">
      <q-card-section class="row q-py-none no-wrap q-gutter-xs">
        <template>
          <tw-avatar
            :key="`followup_${model.id}_${model.leaderID}`"
            :id="model && model.leaderID"
            size="sm"
          />
        </template>
      </q-card-section>
    </div>
  </q-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { date } from 'quasar'
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
    return {}
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
    currContactForm () {
      return _.filter(this.$store.state.followup.contactForm, {
        val: this.model.contactForm
      })[0]
    },
    iconName () {
      return this.currContactForm.iconName || ''
    },
    iconColor () {
      return this.currContactForm.iconColor || 'green'
    }
  },
  mounted () {},
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
    promptToEdit () {},
    openFollowupDetail () {
      this.$router.push({
        name: 'followupDetail',
        params: {
          category: this.model.objectType,
          objectID: +this.model.objectID,
          id: +this.model.id
        }
      })
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar')
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
