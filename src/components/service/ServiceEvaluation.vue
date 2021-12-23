<template>
  <tw-form
    ref="myForm"
    @primary="onSubmit"
  >
    <div class="row q-col-gutter-lg">
      <div class="col-12 q-gutter-y-md text-center">
        <tw-avatar
          v-if="connector"
          :id="connector.id"
          :name="connector.name"
          :img="connector.img"
          :popupCard="true"
        />
        <div>{{ model.title }}</div>
        <q-rating
          no-reset
          v-model="model.evaluation.rating"
          size="3.5em"
          color="grey"
          :color-selected="ratingColors"
        />
        <q-input
          label="请您对本次服务进行评价，以便于我们为您提供更好的服务。"
          outlined
          filled
          type="textarea"
          v-model="model.evaluation.feedback"
        ></q-input>
      </div>
    </div>
    <q-dialog
      v-model="seamless"
      position="standard"
    >
      <q-card style="width: 350px;">
        <q-card-section class="q-pa-md row items-center no-wrap">
          <q-rating
            no-reset
            v-model="model.evaluation.rating"
            size="2em"
            color="grey"
            :color-selected="ratingColors"
          />
          <q-space />
          <q-btn
            color="primary"
            dense
            label="确定"
            @click.stop="dialogConfirm"
          />
          <q-btn
            class="primary on-right text-primary"
            @click.stop="dialogCancel"
            dense
            outline
            label="稍后再来评价"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </tw-form>
</template>

<script>
import { mapActions } from 'vuex'
import { i18n } from '@/boot/i18n'
import { showSuccessMessage } from '@/utils/show-message'
export default {
  name: 'ServiceEvaluation',
  props: {
    objectID: {
      type: [String, Number],
      required: true,
      default: 0
    },
    category: {
      type: String,
      required: true,
      default: 'service'
    }
  },
  data () {
    return {
      ratingColors: [
        'light-green-3',
        'light-green-6',
        'green',
        'green-9',
        'green-10'
      ],
      connector: null,
      seamless: false
    }
  },
  computed: {
    model: {
      get () {
        let service = this.$store.getters['service/service'](+this.objectID)
        if (
          !service.evaluation ||
          service.evaluation === {} ||
          JSON.stringify(service.evaluation) === '{}'
        ) {
          Object.assign(service, {
            evaluation: {
              rating: 0,
              feedback: ''
            }
          })
        }
        return service
      }
    }
  },
  created () {
    this.$nextTick(() => {
      this.objectID &&
        this.$store.dispatch('service/loadService', this.objectID).then(res => {
          this.$store
            .dispatch('person/loadPerson', res.connectorId)
            .then(res1 => {
              this.connector = res1
            })
        })
    })
  },
  mounted () { },
  watch: {},
  methods: {
    ...mapActions('service', ['updateActivity', 'updateStatus']),
    onSubmit () {
      if (this.model.evaluation.rating === 0) {
        this.seamless = true
        return false
      } else {
        this.updateStatus({
          id: this.model.id,
          widgets: this.model.widgets,
          evaluation: this.model.evaluation,
          status: 'confirmed'
        }).then(res => {
          showSuccessMessage(i18n.t(`service.evaluation.submitSuccess`))
          // 保存成功后跳转至工程服务详情页
          this.$router.push({
            name: 'serviceDetail',
            params: { id: this.objectID }
          })
        })
        this.updateActivity({ status: 'connectorSure', id: this.model.id })
      }
    },
    onReset () {
      this.$nextTick(() => {
        this.$router.push({
          name: 'serviceDetail',
          params: { id: this.objectID }
        })
      })
    },
    dialogConfirm () {
      if (this.model.evaluation.rating === 0) {
        this.seamless = true
        return false
      }
      this.updateStatus({
        id: this.model.id,
        widgets: this.model.widgets,
        evaluation: this.model.evaluation,
        status: 'confirmed',
        state: 'connectorSure',
        ConnectorID: this.model.connectorId
      }).then(res => {
        showSuccessMessage(i18n.t(`service.evaluation.submitSuccess`))
        // 保存成功后跳转至工程服务详情页
        this.$router.push({
          name: 'serviceDetail',
          params: { id: this.objectID }
        })
      })
    },
    dialogCancel () {
      this.$nextTick(() => {
        this.$router.push({
          name: 'serviceDetail',
          params: { id: this.objectID }
        })
      })
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    TwForm: () => import('components/base/TwForm')
  }
}
</script>

<style scoped lang="scss">
  .card-grow-in-page {
    position: relative;
  }
</style>
