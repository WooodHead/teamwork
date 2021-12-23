<template>
  <q-card
    class="q-pa-md"
    flat
    bordered
  >
    <q-form
      @submit.prevent="onSubmit"
      @reset="onReset"
    >
      <q-input
        dense
        outlined
        v-model="person.name"
        label="姓名"
        lazy-rules
        :rules="[ val => val && val.length > 0 || '请输入姓名']"
        :hint="$t('member.hint.name')"
      />
      <q-input
        dense
        outlined
        class="q-mt-md"
        v-model="person.phone"
        label="手机号"
        :hint="$t('member.hint.phone')"
        lazy-rules
        :rules="mobilePhoneRules"
      />
      <q-input
        dense
        outlined
        class="q-mt-md"
        v-model="person.email"
        label="邮箱"
        :hint="$t('auth.hint.email')"
      />
      <div class="q-mt-md">
        <tw-editor
          :init-content.sync="person.description"
          :placeholder="`职责`"
        ></tw-editor>
      </div>
      <!--保存操作按钮-->
      <div class="q-mt-md row justify-end">
        <q-btn
          outline
          :label="$q.lang.label.cancel"
          type="reset"
          color="primary"
        />
        <q-btn
          :label="$q.lang.label.ok"
          type="submit"
          color="primary"
          class="q-ml-md"
        />
      </div>
    </q-form>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
import { format } from 'quasar'
const { capitalize } = format
import Person from '@/store/person/model'
import { showSuccessMessage } from '@/utils/show-message'
import { mobilePhoneRules } from '@/utils/form-rules'
export default {
  name: 'MemberForm',
  props: {
    category: {
      type: String,
      required: true
    },
    objectID: {
      type: [String, Number],
      required: true
    },
    psonID: {
      type: Number,
      require: true,
      default: 0
    },
    psonIDs: {
      type: Array,
      require: true,
      default: () => []
    }
  },
  data () {
    return {
      person: new Person()
    }
  },
  computed: {
    mobilePhoneRules,
    model () {
      return this.$store.getters[`${this.category}/${this.category}`](+this.objectID)
    }
  },
  created () {
    this.init()
  },
  mounted () {

  },
  watch: {

  },
  methods: {
    ...mapActions('person', ['loadPerson']),
    init () {
      this.$store.dispatch(`${this.category}/load${capitalize(this.category)}`, this.objectID)
      if (['customer'].includes(this.category)) {
        if (this.psonID > 0) {
          this.$store.state.person.persons = _.omit(this.$store.state.person.persons, [this.psonID])
          this.loadPerson(this.psonID).then(person => {
            this.person = _.clone(person)
          })
        }
      } else {

      }
    },
    // 提交表单
    onSubmit () {
      // 添加方法
      if (this.psonID === 0) {
        this.person.listOrganizeDuty = [{ organizeId: this.model.selfOrganizeID, dutyId: 0 }]
        this.person.isOutStaff = 1
        this.$store.dispatch(`person/updatePerson`, this.person).then(res => {
          if (res) {
            showSuccessMessage('添加成功')
            // 添加成功后，更新成员、关闭添加表单
            let newPsons = _.map(this.psonIDs, id => { return { id } })
            newPsons.push({ id: res.id })
            this.$emit('ok', newPsons)
          }
        })
      } else {
        this.$store.dispatch(`person/updatePerson`, this.person).then(res => {
          if (res) {
            showSuccessMessage('编辑成功')
            // 添加成功后，关闭添加表单
            this.$emit('cancel')
          }
        })
      }
    },
    // 取消提交
    onReset () {
      this.$nextTick(() => {
        this.$emit('cancel')
      })
    }
  },
  components: {
    TwEditor: () => import('components/base/TwEditor')
  }
}
</script>

<style scoped lang="scss">
</style>
