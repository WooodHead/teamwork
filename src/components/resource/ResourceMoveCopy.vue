<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page q-px-xxl"
  >
    <q-card-section />
    <q-card-section>
      <div class="row q-gutter-lg">
        <div
          v-if="$q.screen.gt.sm"
          class="col-shrink q-pt-md"
        >
          <slot name="content">
            <q-card :class="cardStyle+'-card'">
              <q-card-section>
                <component
                  v-if="ids!==''"
                  :is="`${capitalize(type)}IntroBatch`"
                  :ids="ids"
                  :category="category"
                  :objectID="objectID"
                />
                <component
                  v-else
                  :is="`${capitalize(type)}Intro`"
                  :param="{id: +id, category: category, objectID: objectID}"
                  :id="+id"
                />
              </q-card-section>
            </q-card>
          </slot>
        </div>
        <div class="col-grow column q-gutter-y-md">
          <div class="text-h5">
            {{$t('action.actionThis',{action:$t(`action.${action}`),resource:$t(`${type}.title`)})}}
          </div>
          <div v-if="category">
            <div class="text-subtitle1">
              {{$t('action.chooseWhereTo',{action:$t(`action.${action}`)})}}
            </div>
            <q-select
              v-model="resCategory"
              @input="selectItem(true)"
              :options="resCategorys"
              option-value="name"
              option-label="label"
              emit-value
              map-options
              outlined
              rounded
              dense
              class="q-pb-md"
            />
            <q-select
              v-model="resItem"
              use-input
              @input="selectItem(false)"
              @filter="filterFn"
              :options="options"
              :label="$t('action.ChooseResourceItem',{resource:$t(`${resCategory}.title`)})"
              emit-value
              map-options
              outlined
              rounded
              dense
            />
          </div>
          <div>
            <slot name="subSelectPosition1"></slot>
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <slot
        name="subSelect"
        :id="subId"
      >
        <!-- 用于资源内部子项的选择，如任务清单，文件夹等 -->

      </slot>
      <div
        v-if="!disableDefaultBtns"
        class="row q-gutter-md justify-center"
      >
        <q-btn
          color="primary"
          :label="$q.lang.label.ok"
          @click="save"
        />
        <q-btn
          color="primary"
          :label="$q.lang.label.cancel"
          @click="cancel"
          outline
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { format } from 'quasar'
import { showWarningMessage, showSuccessMessage } from '@/utils/show-message'
const { capitalize } = format,
  module = {
    event: 'schedule',
    question: 'checkins',
    answer: 'checkins'
  }
export default {
  name: 'ResourceMoveCopy',
  props: {
    type: {
      type: String,
      default: function () {
        return this.$route.name.replace('Move', '').replace('Copy', '')
      },
      required: false
    },
    action: {
      type: String,
      default: function () {
        return this.$route.path.split('/').slice(-1)[0]
      },
      required: false
    },
    id: {
      type: [Number, String],
      required: false,
      default: 0
    },
    subId: {
      type: [Number, String],
      required: false,
      default: 0,
      description: '子级联动选择数据时，父级传递给自己的数据'
    },
    category: {
      type: String,
      default: '',
      required: false
    },
    objectID: {
      type: [Number, String],
      default: '',
      required: false
    },
    cardStyle: {
      type: String,
      default: 'torn', // whole
      required: false,
      description: '撕边/完整卡片'
    },
    disableDefaultBtns: {
      type: Boolean,
      default: false,
      required: false,
      description: '取消通用确认/取消按钮'
    },
    ids: {
      type: String,
      required: false,
      default: '',
      description: '批量移动和复制的ids'
    }
  },
  components: {
    EventIntro: () => import('components/calendar/EventIntro'),
    TaskIntro: () => import('components/task/TaskIntro'),
    TaskIntroBatch: () => import('components/task/TaskIntroBatch'),
    QuestionIntro: () => import('components/checkins/QuestionIntro'),
    ProductIntro: () => import('components/product/ProductIntro')
  },
  data () {
    return {
      resCategory: this.category,
      resItem: +this.objectID,
      resItems: [],
      options: []
    }
  },
  computed: {
    ...mapState('resource', ['categorys']),
    resCategorys () {
      return module[this.type] === 'schedule'
        ? Object.values(this.categorys)
          .sort((a, b) => {
            if (a.orderNumber < b.orderNumber) return -1
            return 1
          })
        : Object.values(this.categorys)
          .filter(c => !(c.custom || c.name === 'person'))
          .sort((a, b) => {
            if (a.orderNumber < b.orderNumber) return -1
            return 1
          })
    }
  },
  watch: {
    resCategory: function (val) {
      this.resItem = null
      this.setItems(val)
    }
  },
  mounted () {
    this.loadCategorys().then(data => {
      this.setItems(this.resCategory)
    })
  },

  methods: {
    ...mapActions('resource', ['loadCategorys', 'loadCustomCategoryOfItems']),
    capitalize,
    setItems (category) {
      if (this.categorys[category] && this.categorys[category].custom) {
        this.loadCustomCategoryOfItems(
          {
            query: [{ 'Key': 'Category', 'Value': category, 'Oper': 'eq' }],
            category: category,
            byPage: false,
            fields: 'Select'
          })
          .then(items => {
            this.resItems = _.map(items, item => {
              return {
                value: item.id,
                label: item.title
              }
            })
            this.options = this.resItems
          })
      } else {
        this.$store.dispatch(`${category}/load${capitalize(category)}s`, { byPage: false, fields: 'Select' })
          .then(items => {
            this.resItems = _.map(items, item => {
              return {
                value: item.id,
                label: item.title || item.name
              }
            })
            this.options = this.resItems
          })
      }
    },
    save () {
      // 文档，移动/复制时,需要对目标子项进行校验
      if (this.type === 'document' && !this.subId) {
        showWarningMessage('请选择目标位置')
        return
      }
      this.$store.dispatch(`${module[this.type] || this.type}/${this.action}${capitalize(this.type)}`, {
        // 当前操作项的 id，如任务 id
        ID: +this.id,
        To: {
          ObjectID: +this.resItem,
          ObjectType: this.resCategory,
          // 资源内部子项的 id，如任务清单 id，文件夹 id
          TargetID: this.subId
        }
      }).then(res => {
        if (this.type === 'document') {
          let mes = this.$t(`action.${this.action}成功`)
          showSuccessMessage(res.acl === 2 ? '该文档是保密文档，可设置白名单' : mes)
          this.$router.push({
            name: res.classify === 'folder' ? 'folder' : `${res.classify}Detail`,
            params: {
              category: res.objectType,
              objectID: res.objectID,
              id: +res.id
            }
          })
        } else {
          this.$router.push({
            name: `${this.type}Detail`,
            params: { category: this.resCategory, objectID: this.resItem, id: +res.id || +this.id }
          })
        }
      })
    },
    cancel () {
      if (this.type === 'document') {
        const model = this.$store.getters[`document/currentModel`](+this.id || 0)
        this.$router.push({
          name: model.classify === 'folder' ? 'folder' : `${model.classify}Detail`,
          params: {
            category: model.objectType,
            objectID: model.objectID,
            id: model.id
          }
        })
      } else if (this.type === 'question') {
        this.$router.push({
          name: 'checkins',
          params: {
            category: this.resCategory,
            objectID: this.resItem,
            id: +this.id
          }
        })
      } else {
        this.$router.push({
          name: `${this.type}Detail`,
          params: { category: this.resCategory, objectID: this.resItem, id: +this.id }
        })
      }
    },
    selectItem (isNotSpecific) {
      this.$emit('selectItem', { category: this.resCategory, objectID: this.resItem, isNotSpecific: isNotSpecific })
    },
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.options = this.resItems
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.resItems.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
