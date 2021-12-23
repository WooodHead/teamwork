<template>
  <div>
    <widget-layout
      :category="category"
      :id="objectID"
      widget="followup"
      :isEmpty="this.modelList.length === 0"
    >
      <template slot="content">
        <q-list>
          <q-item
            v-for="item in modelList"
            :key="item.id"
          >
            <q-item-section avatar>
              <tw-avatar
                size="md"
                :id="item.follower"
              />
            </q-item-section>

            <q-item-section class="text-left ellipsis">
              <div class="row q-gutter-xs">
                <div>
                  <q-item-label
                    lines="1"
                    class="text-bold"
                  >{{htmlToText(item.content)}}</q-item-label>
                </div>
              </div>
              <q-item-label
                caption
                lines="2"
              >
                {{item.contactForm + ' | ' + item.followupDate}}
              </q-item-label>
            </q-item-section>

          </q-item>
        </q-list>
      </template>
    </widget-layout>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { date } from 'quasar'
import htmlToText from '@/utils/html-to-text'
const { formatDate } = date
export default {
  name: 'WidgetFollowup',
  components: {
    WidgetLayout: () => import('layouts/WidgetLayout'),
    TwAvatar: () => import('components/base/TwAvatar')
  },
  props: {
    category: { type: String, required: true },
    objectID: { type: Number, required: false }
  },
  data () {
    return {
      modelList: []
    }
  },
  methods: {
    ...mapActions('followup', ['loadFollowups']),
    htmlToText
  },
  created () {
    this.modelList = []
    const condition = {
      query: [
        { Key: 'ObjectType', Value: this.category, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: this.objectID, Oper: 'eq' }
      ]
    }
    this.loadFollowups(condition).then(data => {
      data.forEach(item => {
        let followup = {}
        followup.contactForm = item.contactForm
        followup.customerContacter = item.customerContacter
        followup.follower = item.follower
        followup.followupDate = item.followupDate ? formatDate(item.followupDate, 'YYYY-MM-DD') : ''
        followup.content = item.content
        followup.createTime = item.createTime
        followup.createBy = item.createBy
        followup.id = item.id
        this.modelList.push(followup)
      })
    })
  }
}
</script>

<style lang='scss' scoped>
</style>
