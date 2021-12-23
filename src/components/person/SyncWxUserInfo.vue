<template>
  <q-card>
    <q-card-section>
      <div class="text-h6 text-bold">{{$t('wexin.syncWxUserInfo')}}</div>
    </q-card-section>
    <q-linear-progress
      rounded
      :query="!isDone&&isStart"
      size="10px"
      :track-color="isDone?'positive':'primary'"
      :color="isDone?'positive':'primary'"
    />
    <q-card-section
      style="min-height:250px;max-height: 50vh"
      class="scroll q-py-none"
    >
      <!-- 同步过程 -->
      <div v-if="isStart">
        <div class="q-pb-md">
          <q-banner>
            <template v-slot:avatar>
              <q-icon
                :name="isDone?'done':'compare_arrows'"
                :color="isDone?'positive':'primary'"
              />
            </template>
            <div :class="isDone?'text-bold text-subtitle1 text-positive':'text-bold text-subtitle1 text-primary'">
              {{isDone?$t('wexin.SyncWXOk',{count}):$t('wexin.SyncWXingMessage')}}
            </div>
          </q-banner>
          <p>{{updateUsers}}</p>
        </div>
        <div v-if="hasErrorUser">
          <q-banner class="text-bold">
            <template v-slot:avatar>
              <q-icon
                name="error_outline"
                color="negative"
              />
            </template>
            <div class="text-bold text-subtitle1 text-negative">{{$t('wexin.hasErrorUser')}}</div>
          </q-banner>
          <p>{{lastUpdateUsers}}</p>
        </div>
      </div>
      <!-- 同步前提示 -->
      <div v-else>
        <q-banner>
          <template v-slot:avatar>
            <q-icon
              name="info"
              color="info"
            />
          </template>
          <div class="text-bold text-subtitle1">
            {{$t('wexin.startSyncWxUserInfo')}}
          </div>
        </q-banner>
        <q-list class="text-body2 q-px-sm">
          <q-item>
            <q-item-section side>
              <q-icon
                color="blue-grey-4"
                name="lens"
                size="xs"
              />
            </q-item-section>
            <q-item-section>{{$t('wexin.confirmSyncWXMessageTips_1')}}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section side>
              <q-icon
                color="blue-grey-4"
                name="lens"
                size="xs"
              />
            </q-item-section>
            <q-item-section>{{$t('wexin.confirmSyncWXMessageTips_2')}}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section side>
              <q-icon
                color="blue-grey-4"
                name="lens"
                size="xs"
              />
            </q-item-section>
            <q-item-section>{{$t('wexin.confirmSyncWXMessageTips_3')}}</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn
        :outline="!isDone"
        :label="isDone?'确定':'取消'"
        :color="isDone?'positive':'primary'"
        @click="closeOrCancel"
      />
      <q-btn
        v-if="!isStart"
        label="开始"
        color="primary"
        @click="startSyncWX"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import request from '@/boot/axios'
export default {
  name: 'SyncWxUserInfo',
  data () {
    return {
      updateUsers: '',
      lastUpdateUsers: '',
      hasErrorUser: false,
      isDone: false,
      count: 0,
      isStart: false
    }
  },
  methods: {
    // 开始同步
    startSyncWX () {
      this.isStart = true
      this.syncWX()
    },
    // 关闭或取消处理
    closeOrCancel () {
      // 停止同步
      this.isDone = true
      // 关闭弹框
      this.$emit('closeDialog')
    },
    // 同步信息
    syncWX () {
      let that = this
      if (that.isDone) return
      // 后台同步请求
      request.get('wechat/syncwxuserinfo').then(res => {
        if (+res.data.updateCount === 0) {
          that.isDone = true
        } else if (res.data.updateUserInfo === that.lastUpdateUsers) {
          that.hasErrorUser = true
          that.isDone = true
        } else {
          that.updateUsers += (that.updateUsers === '' ? '' : '、') + res.data.updateUserInfo
          that.lastUpdateUsers = res.data.updateUserInfo
          that.count += res.data.updateCount
          that.syncWX()
        }
      }).catch((error) => {
        // 记录请求错误信息
        console.log(error)
        that.isDone = true
      })
    }
  }
}
</script>

<style>
</style>
