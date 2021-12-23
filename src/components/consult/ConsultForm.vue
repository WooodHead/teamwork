<template>
  <tw-form @primary="onSubmit">
    <slot name="header"></slot>
    <div class="row items-center justify-center">
      <!-- 只能编辑自己的 -->
      <tw-avatar
        :id="$myinfo.id"
        :size="$q.screen.lt.sm?'md':''"
      />
      <q-icon
        class="q-px-sm"
        name="trending_flat"
        size="md"
        color="grey-7"
      ></q-icon>

      <tw-avatar
        :id="openType==='add'?transactorId:model.transactorID"
        :size="$q.screen.lt.sm?'md':''"
      />
    </div>
    <div
      class="row justify-center q-pt-sm text-title"
      style="word-wrap: break-word;"
      :title="consultItem&&consultItem.title"
    >{{consultItem&&consultItem.title}}
    </div>
      <div class="q-gutter-y-md">
        <quasar-editor
          :value="content"
          @input="(val)=>{model.content=val}"
          folder="consult"
          :applied="goIntoAction"
          :placeholder="`${$t('consult.consultAdd.content')}...`"
        ></quasar-editor>
        <!-- 移动端显示 -->
        <q-input
          v-if="$q.screen.lt.sm"
          class="q-ml-none"
          input-class="text-center"
          v-model="model.exceptFinishTime"
          type="date"
          filled
          :label="$t('consult.consultAdd.dueDate')"
        />
        <!-- PC端显示 -->
        <q-input
          v-else
          class="q-ml-none"
          input-class="text-center"
          v-model="model.exceptFinishTime"
          filled
          :label="$t('consult.consultAdd.dueDate')"
          mask="date"
        >
          <template v-slot:append>
            <q-icon
              name="event"
              class="cursor-pointer"
            >
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  :options="optionsFn"
                  :value="model.exceptFinishTime"
                  @input="dateInput($event)"
                  minimal
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
  </tw-form>
</template>

<script>
import Model from '@/store/consult/model'
import { mapState, mapActions } from 'vuex'
import { date, debounce } from 'quasar'
import { showWarningMessage } from '@/utils/show-message'
import htmlToText from '@/utils/html-to-text'
const { formatDate } = date, Consult = Model.Consult
export default {
  name: 'ConsultForm',
  props: {
    openType: {
      type: String,
      required: true,
      default: 'add'
    },
    id: {
      type: [String, Number],
      default: 0
    },
    transactorId: {
      type: [String, Number],
      required: false,
      default: 0
    },
    itemId: {
      type: [String, Number],
      required: false,
      default: 0
    }
  },
  data () {
    return {
      model: new Consult(),
      content: '',
      goIntoAction: false
    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    transactor () {
      let psonId = this.openType === 'add' ? +this.transactorId : +this.model.transactorID
      return (psonId && this.selectPersons[+psonId]) || []
    },
    consultItem () {
      let itemId = this.openType === 'add' ? +this.itemId : +this.model.itemID
      itemId && this.loadConsultItem(+itemId)
      return (itemId && this.$store.getters['consult/consultItem'](+itemId)) || []
    }
  },
  mounted () {
    if (this.openType === 'edit') {
      this.loadConsult(+this.id).then(res => {
        if (res) {
          this.model = _.cloneDeep(res)
          this.content = res.content
        }
      })
    }
  },
  components: {
    QuasarEditor: () => import('components/base/q-editor/QuasarEditor'),
    TwAvatar: () => import('components/base/TwAvatar'),
    TwForm: () => import('components/base/TwForm')
  },
  methods: {
    ...mapActions('consult', ['addConsult', 'loadConsult', 'loadConsultItem', 'updateConsultField']),
    optionsFn (date) {
      return this.openType === 'edit' ? date >= formatDate(this.model.startTime, 'YYYY/MM/DD') : date >= formatDate(new Date(), 'YYYY/MM/DD')
    },
    dateInput (value) {
      this.$refs.qDateProxy.hide()
      this.model.exceptFinishTime = value
    },
    // 通过防抖函数防止表单短时间内重复提交
    onSubmit: debounce(function () {
      this.submitData()
    }, 3000, true),
    submitData () {
      this.goIntoAction = true
      let status = 1, msgProps = null
      if (htmlToText(this.model.content).trim()) {
        if (this.openType === 'add') {
          msgProps = {
            id: +this.itemId,
            title: this.consultItem.title,
            content: this.model.content.trim(),
            receiveBy: +this.transactorId,
            action: 'submit',
            modelContent: this.model.content.trim()
          }
          Object.assign(this.model, {
            itemID: +this.itemId,
            status: status,
            consultantID: this.$myinfo.id,
            transactorID: +this.transactorId
          })
          this.addConsult({ consult: this.model, msgProps: msgProps }).then(res => {
            if (res && Object.keys(res).length > 0) {
              this.openDetail(res.id)
            }
          })
        } else {
          msgProps = {
            id: +this.model.itemID,
            title: this.consultItem.title,
            content: this.model.content.trim(),
            receiveBy: +this.model.transactorID
          }
          this.updateConsultField({ id: +this.model.id, content: this.model.content.trim(), exceptFinishTime: this.model.exceptFinishTime, msgProps: msgProps }).then(res => {
            if (res && Object.keys(res).length > 0) {
              this.openDetail(res.id)
            }
          })
        }
        this.$emit('cancel')
      } else {
        showWarningMessage(this.$t('consult.consultAdd.contentIsNotNull'))
      }
    },
    openDetail (id) {
      this.$router.push({
        name: 'consultDetail',
        params: { id: +id }
      })
    }
  }
}
</script>

<style scoped>
</style>
