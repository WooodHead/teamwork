<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <q-card-section>
      <span>邮件服务</span>
      <hr />
    </q-card-section>

    <form @submit.prevent="SubmitForm">
      <q-list>
        <q-item class="item">
          <q-item-section class="item-section">
            <q-input
              dense
              outlined
              label="SMTP服务器"
              placeholder="如:smtp.163.com"
              v-model="emailToSubmit.server"
              ref="emailName"
              input-style="font-size:12px"
            />
          </q-item-section>
        </q-item>

        <q-item class="item">
          <q-item-section class="item-section">
            <q-input
              outlined
              dense
              label="SMTP端口号"
              placeholder="一般为25或465"
              v-model="emailToSubmit.portNumber"
              input-style="font-size:12px"
            />
          </q-item-section>
        </q-item>

        <q-item class="item">
          <q-item-section class="item-section">
            <q-input
              dense
              outlined
              label="发件人邮箱"
              v-model="emailToSubmit.senderMailbox"
              placeholder="xianxin@quasar.com"
              input-style="font-size:12px"
            />
          </q-item-section>
        </q-item>

        <q-item class="item">
          <q-item-section class="item-section">
            <q-input
              dense
              outlined
              label="发件人昵称"
              v-model="emailToSubmit.senderNickname"
              placeholder="精雕"
              input-style="font-size:12px"
            />
          </q-item-section>
        </q-item>

        <q-item class="item">
          <q-item-section class="item-section">
            <q-input
              dense
              outlined
              label="邮箱登录密码"
              v-model="emailToSubmit.emailPassword"
              placeholder="......"
              input-style="font-size:12px"
            />
          </q-item-section>
        </q-item>

        <q-item class="item">
          <q-item-section
            avatar
            class="item-section"
            style="padding:0px;"
          >
            <q-btn
              label="确认提交"
              color="primary"
              type="submit"
              style="width:100%"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </form>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      emailToSubmit: {
        server: '',
        portNumber: '',
        senderMailbox: '',
        senderNickname: '',
        emailPassword: ''
      }
    }
  },

  methods: {
    ...mapActions('emailus', ['addEmailData']),
    SubmitForm () {
      this.$refs.emailName.validate()
      if (!this.$refs.emailName.hasError) {
        this.submitemail()
      }
    },
    submitemail () {
      this.addEmailData(this.emailToSubmit)
    }
  }
}
</script>
<style lang="scss" scoped>
.item {
  display: flex;
  justify-content: center;
  .item-section {
    width: 60%;
    flex: unset;
  }
}
</style>
