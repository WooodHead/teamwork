<template>
  <q-page class="flex flex-center">
    <div class="q-mt-md verify-container">
      <div class="relative-position verify-inner">
        <div class="verify-info">
          <p class="q-mb-sm text-h5 text-weight-bold">{{$t(`salary.view.sendDateTips`, {sendDate: `${$route.params.year}年${$route.params.month}月`, type: $t(`salary.salaryType.${$route.params.type}`)}) }}</p>
          <p
            class="q-mb-lg text-grey-5 text-subtitle2"
            v-html="$t(`salary.view.verifyTips`)"
          ></p>
          <div class="flex justify-center dynamic-code">
            <q-input
              outlined
              dense
              autofocus
              v-model="dynamicCode"
              type="tel"
              :placeholder="$t(`salary.inputCode`)"
              @keyup.enter="toCheckOut"
              class="col"
            ></q-input>
            <q-btn
              :disable="!dynamicCode"
              color="primary"
              label="查看"
              @click="toCheckOut"
              class="col-auto q-ml-md q-px-sm"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
// import { date, SessionStorage } from 'quasar'
import { SessionStorage } from 'quasar'
import { mapState, mapActions } from 'vuex'
// const { formatDate } = date
export default {
  name: 'StaffSecurityCode',
  data () {
    return {
      dynamicCode: ''
    }
  },
  computed: {
    ...mapState('salary', ['salaryType'])
  },
  methods: {
    // ...mapActions('salary', ['getMySalary']),
    ...mapActions('salary', ['getSalary']),
    toCheckOut () {
      // 动态码验证
      // 当验证通过后，将工资条状态变更为“已读”
      // this.getMySalary({ code: this.dynamicCode, type: this.$route.params.type, year: +this.$route.params.year, month: +this.$route.params.month })
      this.getSalary({ code: this.dynamicCode, id: +this.$route.params.id, recordNum: this.$route.params.recordNum, isUpdateIsRead: true })
        .then(res => {
          if (res) {
            // 将动态码状态存入sessionStorage
            SessionStorage.set('dynamicCodeVerify', true)
            this.$router.push({
              name: 'salarySecrecyDetail',
              query: {
                type: this.$route.params.type,
                year: this.$route.params.year,
                month: this.$route.params.month,
                id: this.$route.params.id,
                recordNum: this.$route.params.recordNum
              }
            })
          } else {
            this.dynamicCode = ''
          }
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
  max-width: 884px;
  .verify-inner {
    width: 100%;
    padding-bottom: calc((570 / 1295) * 100%);
    background-image: url("/icons/secrecy/verify.png");
    background-repeat: no-repeat;
    background-size: cover;
    .verify-info {
      position: absolute;
      top: 15%;
      left: 50%;
      transform: translateX(-50%);
      width: 35%;
      text-align: center;
    }
  }
}
@media screen and (max-width: 1024px) {
  .verify-container {
    .verify-inner {
      padding-bottom: calc((644 / 750) * 100%);
      background-image: url("/icons/secrecy/verify_m.png");
      .verify-info {
        width: 80%;
        top: 12%;
        left: 50%;
        transform: translateX(-50%);
        .text-subtitle2 {
          font-size: 12px;
        }
        .dynamic-code {
          width: 85%;
          max-width: 300px;
          margin: 0 auto;
        }
      }
    }
  }
  // .dynamic-code {
  //   /deep/ .q-input,
  //   /deep/ .q-btn {
  //     width: 100%;
  //   }
  //   /deep/ .q-btn {
  //     max-width: 250px;
  //     margin-left: 0;
  //     margin-top: 16px;
  //   }
  // }
}
</style>
