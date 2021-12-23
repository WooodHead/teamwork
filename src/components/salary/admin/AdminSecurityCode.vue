<!--
@Name：管理员输入验证码界面
@Author：陆欢
@date：2021/04/26
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-card style="min-width: 350px">
    <slot></slot>
    <q-card-section>
      <q-input
        ref="myInput"
        dense
        outlined
        autofocus
        v-model="adminSecurityCode"
        @keyup.enter="emitAdminSecurity"
        :hint="inputHint()"
        :rules="[val => !!val || $t('salary.adminSecurityCodeRules')]"
      >
      </q-input>
      <div
        v-if="$q.platform.is.mobile"
        class="row q-gutter-md q-mt-lg justify-center"
      >
        <q-btn
          color="primary"
          :label="$q.lang.label.ok"
          @click="emitAdminSecurity"
        />
        <q-btn
          v-if="$route.name !== 'applySalary'"
          color="primary"
          :label="$q.lang.label.cancel"
          @click="$emit('close')"
          outline
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'AdminSecurityCode',
  props: {
    uploadSalary: {
      type: Object,
      required: false,
      default: () => { return {} },
      description: '上传工资条的年月类型信息。包含：salaryYear、salaryMonth、type属性'
    }
  },
  data () {
    return {
      adminSecurityCode: ''
    }
  },
  computed: {
    ...mapState('salary', ['currentDateAndType'])
  },
  mounted () {
  },
  methods: {
    inputHint () {
      const type = this.$t(`salary.salaryType.${this.uploadSalary.type || this.currentDateAndType.type}`)
      return this.$t('salary.adminSecurityCodeRemind',
        {
          salaryYear: this.uploadSalary.salaryYear || this.currentDateAndType.salaryYear,
          salaryMonth: this.uploadSalary.salaryMonth || this.currentDateAndType.salaryMonth,
          type: type
        }
      )
    },
    emitAdminSecurity () {
      if (this.$refs.myInput.validate()) {
        this.$emit('input', this.adminSecurityCode)
      }
    }
  }
}
</script>

<style scoped>
</style>
