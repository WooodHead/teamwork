<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <tw-header-detail
      :title="task&&task.name"
      :noMenu="!!type"
    >
      <template #menu>
        <tw-menu
          v-if="task&&task.id"
          :menus="['edit', 'delete', { group: ['history'] }]"
          @edit="onEdit"
          @delete="onDelete"
          @history="onHistory"
        />
      </template>
    </tw-header-detail>
    <div
      v-if="task&&task.id"
      class="q-px-xxl"
    >
      <q-list>
        <div
          v-for="(item,index) in taskItem"
          :key="index"
        >
          <q-item>
            <q-item-section side>
              <q-icon
                v-if="item.icon"
                :name="item.icon"
              />
              <q-btn
                v-if="item.typeIcon"
                class="work-type-font"
                :label="workTypeIcon"
                outline
                size="sm"
                round
              />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{item.title}}</q-item-label>
              <q-item-label
                v-if="item.vHtml"
                class="tiptap-content editor__content"
                v-html="item.value"
              />
              <q-item-label v-else>
                {{item.value}}
                <span v-if="item.append">{{item.append}}</span>
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator
            spaced
            inset
          />
        </div>
      </q-list>
    </div>
  </q-card>
</template>
<script>
import { mapActions } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
export default {
  name: 'WorkRecordDetail',
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    type: {
      type: String,
      required: false,
      default: '',
      description: '(calendar|list|person-calendar)'
    }
  },
  data () {
    return {
    }
  },
  computed: {
    workTypeIcon () {
      return this.task && this.task.businessType && this.task.businessType.split('—') ? this.task.businessType.split('—')[0].trim() : 'sort_by_alpha'
    },
    task () {
      return this.$store.getters['task/task'](+this.id)
    },
    taskItem () {
      return [
        {
          icon: 'star_border',
          title: this.$t('workRecord.selectSource'),
          value: this.task.source
        },
        {
          typeIcon: true,
          title: this.$t('workRecord.workType'),
          value: this.task.businessType
        },
        {
          icon: 'content_paste',
          title: this.$t('workRecord.content'),
          value: this.task.name
        },
        {
          icon: 'location_on',
          title: this.$t('workRecord.address'),
          value: this.task.address && this.addressName(this.task.address)
        },
        {
          icon: 'schedule',
          title: this.$t('task.publicDateRange'),
          value: this.task.beginTime + '  ~  ' + this.task.finishedTime
        },
        {
          icon: 'timer',
          title: this.$t('workRecord.workHour'),
          value: this.task.workHour,
          append: this.$t('date.hour')
        },
        {
          icon: 'local_taxi',
          title: this.$t('workRecord.onRoadHour'),
          value: this.task.onRoadHour,
          append: this.$t('date.hour')
        },
        {
          icon: 'insert_drive_file',
          title: this.$t('workRecord.description'),
          value: this.task.description,
          vHtml: true
        }
      ]
    }
  },
  mounted () {
    this.loadTask(+this.id)
  },
  methods: {
    ...mapActions('task', ['loadTask', 'deleteTask']),
    addressName (value) {
      if (value.type === 'none') {
        return ''
      } else if (value.type === 'cityname') {
        return value.value
      } else {
        return value.value.name
      }
    },
    onDelete () {
      showConfirm(this.$t('action.reallyDelete'), () => {
        this.deleteTask(+this.task.id)
        this.$router.push({ name: 'workRecordHome' })
      })
    },
    onHistory () {
      this.$router.push({
        name: 'workRecordHistory',
        params: {
          id: +this.task.id
        }
      })
    },
    onEdit () {
      this.$router.push({
        name: 'workRecordEdit',
        params: { id: +this.task.id }
      })
    }
  },
  components: {
    TwMenu: () => import('components/base/TwMenu'),
    TwHeaderDetail: () => import('components/base/TwHeaderDetail')
  }
}
</script>
