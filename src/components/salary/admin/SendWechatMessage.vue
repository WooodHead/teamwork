<!--
@Name：批量发送企业微信消息
@Author：牛荷燕
@date：2021/05/07
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-card>
    <q-card-section style="min-width:400px;max-width:600px;margin:0px auto;">
      <!-- <div
        class="text-orange text-center text-subtitle2"
        v-if="!isDone"
      >正在发送消息中，请勿随意刷新页面！</div> -->
      <!-- 各个发送状态数量 -->
      <div class="row q-col-gutter-sm text-center items-center">
        <q-btn
          class="col-3"
          stack
          flat
        >
          <template>
            <div class="text-bold text-h4 text-warning">{{!everyTypeCount.all?'...':everyTypeCount.all-everyTypeCount.sended}}</div>
            <div class="q-mt-sm text-grey-10 text-bold">未发送</div>
          </template>
        </q-btn>
        <q-btn
          class="col-3"
          stack
          flat
        >
          <template>
            <div class="text-bold text-h4 text-primary">{{!everyTypeCount.all?'...':everyTypeCount.sended}}</div>
            <div class="q-mt-sm text-grey-10 text-bold">已发送</div>
          </template>
        </q-btn>
        <q-btn
          class="col-3"
          stack
          flat
        >
          <template>
            <div class="text-bold text-h4 text-positive">{{!everyTypeCount.all?'...':everyTypeCount.success}}</div>
            <div class="q-mt-sm text-grey-10 text-bold">发送成功</div>
          </template>
        </q-btn>
        <q-btn
          class="col-3"
          stack
          flat
        >
          <template>
            <div class="text-bold text-h4 text-negative">{{!everyTypeCount.all?'...':everyTypeCount.error}}</div>
            <div class="q-mt-sm text-grey-10 text-bold">发送异常</div>
          </template>
        </q-btn>
      </div>
      <div class="q-py-lg text-center">
        <q-knob
          readonly
          :max="everyTypeCount.all"
          v-model="send"
          size="200px"
          show-value
          :thickness="0.3"
          color="primary"
          track-color="blue-3"
          class="text-primary q-ma-md"
        >
          <div>
            <div class="block text-grey-8 text-subtitle1 text-weight-bold">正在发送中...</div>
            <div class="block">{{!everyTypeCount.all?'...':parseInt(everyTypeCount.sended/everyTypeCount.all*100)}}%</div>
          </div>
        </q-knob>
      </div>
      <div
        class="text-center"
        v-if="everyTypeCount.all-everyTypeCount.sended"
      >
        <q-btn
          class="q-px-xxl"
          label="终止发送"
          color="primary"
          @click="stopSend"
          size="1.2rem"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'SendWechatMessage',
  props: {
    type: {
      type: String,
      require: false,
      default: 'salary',
      description: '消息类型，默认为薪资条（salary），可选职级变更（position）'
    },
    everyTypeCount: {
      type: Object,
      require: true,
      description: '状态数量对象'
    }
  },
  computed: {
    send () {
      return this.everyTypeCount.sended
    }
  },
  methods: {
    stopSend () {
      this.$store.dispatch(`${this.type}/stopSend`)
    }
  }
}
</script>

<style>
</style>
