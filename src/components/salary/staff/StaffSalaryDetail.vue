<template>
  <q-page
    padding
    class="q-pb-none salary-detail-page"
    ref="salaryDetail"
  >
    <salary-detail
      :model="salaryList"
      class="salary-detail"
      :type="$route.query.type"
    ></salary-detail>
    <q-page-sticky
      position="bottom"
      :offset="[0, 0]"
      class="full-width"
    >
      <div class="flex q-px-md q-py-sm btn-group">
        <q-toggle
          v-model="showZero"
          label="显示数值为 0 的项"
        />
        <q-space />
        <q-btn
          unelevated
          color="primary"
          icon="chat"
          :label="$t('feedback.module')"
          @click="feedback"
        />
      </div>
    </q-page-sticky>
  </q-page>
</template>

<script>
// import { Platform } from 'quasar'
import { SessionStorage } from 'quasar'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'StaffSalaryDetail',
  components: {
    SalaryDetail: () => import('components/salary/SalaryDetail')
  },
  data () {
    return {
      showing: true,
      showZero: false
    }
  },
  computed: {
    ...mapGetters('salary', ['salaryModel']),
    salaryList () {
      if (this.showZero) {
        return this.salaryModel
      } else {
        let model = _.cloneDeep(this.salaryModel)
        model.value = {}
        _.map((this.salaryModel && this.salaryModel.value) || {}, (item, key) => {
          if (item !== 0) {
            model.value[key] = item
          }
        })
        return model
      }
    }
  },
  methods: {
    ...mapMutations('salary', ['setSalaryModel']),
    feedback () {
      this.$router.push({
        name: 'chat',
        params: {
          category: 'person',
          objectID: +this.salaryModel.createByID
        }
      })
    }
  },
  mounted () {
    // 如果SesionStorage中的dynamicCodeVerify为true且model不为空，则正常显示工资条，否则跳转到验证页
    if (!SessionStorage.getItem('dynamicCodeVerify') || !Object.keys(this.salaryModel).length) {
      this.$router.push({
        name: 'salarySecrecyVerify',
        params: {
          type: this.$route.query.type,
          year: this.$route.query.year,
          month: this.$route.query.month,
          id: this.$route.query.id,
          recordNum: this.$route.query.recordNum
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.salary-detail-page {
  padding-bottom: 24px;
}
.salary-detail {
  padding-bottom: 60px;
  // max-width: 500px;
  width: 100%;
  // margin: 0 auto;
  min-height: calc(100vh - 125px);
}
/deep/.q-page-sticky > div {
  width: 100%;
  max-width: 500px;
}
.btn-group {
  max-width: 500px;
  margin: 0 auto;
  background-color: $grey-2;
  /deep/ .q-toggle {
    margin-left: -10px;
  }
}
@media screen and (max-width: 500px) {
  .salary-detail-page {
    padding: 0;
  }
  .salary-detail {
    border: none;
  }
}
</style>

<style>
@media screen and (max-width: 500px) {
  .q-dialog__inner {
    padding: 0;
  }
  .q-dialog__inner.flex-center {
    align-items: flex-end;
  }
}
</style>
