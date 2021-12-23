<template>
  <q-page class="flex flex-center">
    <q-card class="relative-position flex flex-center q-pa-lg q-ma-md verify-container">
      <!-- 选择年月 -->
      <p class="text-h6 text-grey-8 text-weight-bold q-mb-lg">申请动态码</p>
      <q-form class="q-gutter-y-md full-width">
        <q-select
          :value="model.type"
          dense
          outlined
          :options="salaryTypes"
          @input="model.type = $event"
          options-dense
          emit-value
          map-options
        >
          <template v-slot:before>
            <div
              class="text-subtitle1"
              :class="$q.screen.gt.sm?'q-mr-md':'q-mr-sm'"
            >{{$t('salary.salaryTypeSelect')}}</div>
          </template>
        </q-select>
        <!-- <div :class="$q.screen.gt.sm?'row items-center q-mb-xl':'q-gutter-y-md'"> -->
        <div class="row items-center q-mb-md">
          <div class="col-8">
            <q-select
              dense
              outlined
              :value="model.year"
              :options="salaryYear"
              @input="model.year = $event"
              options-dense
              emit-value
              map-options
            >
              <template v-slot:before>
                <div
                  class="text-subtitle1"
                  :class="$q.screen.gt.sm?'q-mr-md':'q-mr-sm'"
                >{{$t('salary.salaryTimeSelect')}}</div>
              </template>
            </q-select>
          </div>
          <div :class="['col', $q.screen.gt.sm?'q-ml-md':'q-ml-sm']">
            <q-select
              dense
              outlined
              :value="model.month"
              :options="salaryMonth"
              @input="model.month = $event"
              options-dense
              emit-value
              map-options
            >
            </q-select>
          </div>
        </div>
        <span class="block q-mb-xl text-caption text-grey-6">{{$t(`salary.applyTip`)}}</span>
        <q-btn
          size="md"
          @click="applySalaryCode()"
          :label="$t(`salary.applyBtnLabel`)"
          color="green"
          style="display: block; margin: 0 auto;"
        />
      </q-form>
      <div
        v-if="showTip"
        class="flex flex-center q-pa-md apply-tips"
      >
        <div
          class="text-h6 text-grey-8 text-center"
          v-html="$t(`salary.finishApplyTip`, {year: model.year, month: model.month, type: $t(`salary.salaryType.${model.type}`)})"
        ></div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { date } from 'quasar'
// import { SessionStorage } from 'quasar'
import { mapState, mapActions } from 'vuex'
import { showWarningMessage } from '@/utils/show-message'
// import { showConfirm } from '@/utils/show-confirm'
export default {
  name: 'StaffApplySalary',
  data () {
    return {
      model: { year: +date.formatDate(Date.now(), 'YYYY'), month: +date.formatDate(Date.now(), 'M'), type: 'salary' },
      showTip: false
    }
  },
  computed: {
    ...mapState('salary', ['salaryTypes', 'salaryYear', 'salaryMonth'])
  },
  methods: {
    ...mapActions('salary', ['applyMyCode']),
    applySalaryCode () {
      this.applyMyCode(this.model)
        .then((res) => {
          if (res) {
            this.showTip = true
          } else {
            showWarningMessage('请重试')
          }
        }).catch((err) => {
          console.log(err)
        })
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
.verify-container {
  width: 100%;
  max-width: 500px;
}
.apply-tips {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
}
@media screen and (max-width: 500px) {
}
</style>
