<template>
  <div>
    <q-timeline color="secondary">
      <q-item-label>
        <span class="text-body1">审批流程</span>
      </q-item-label>
      <q-timeline-entry
        :subtitle="`审批人${approver.length>1?'  依次审批  ':''}（必选）`"
        icon="person"
      >
        <div>
          <template v-for="(appro,index) in approver">
            <q-avatar
              rounded
              :key="'approver_avatar'+ appro.userid"
            >
              <img :src="appro.avatar" />
              <q-badge
                class="cursor-pointer"
                @click="()=>approver.splice(index,1)"
                rounded
                color="dark"
                floating
              >X</q-badge>
            </q-avatar>
            <q-icon
              class="q-mx-xs"
              name="more_horiz"
              size="1.5vw"
              color="grey"
              :key="'approver_more_horiz'+appro.userid"
            />
          </template>
          <q-avatar
            class="cursor-pointer"
            @click="openWechatUserPanel(approver)"
            rounded
            color="blue-grey-2"
            title="请选择审批人"
            text-color="white"
            icon="add_box"
          />
        </div>
      </q-timeline-entry>
      <q-timeline-entry
        subtitle="抄送人"
        icon="near_me"
      >
        <div>
          <template v-for="(notif,index) in notifyer">
            <q-avatar
              rounded
              :key="'notifyer_avatar'+notif.userid"
            >
              <img :src="notif.avatar" />
              <q-badge
                class="cursor-pointer"
                @click="()=>notifyer.splice(index,1)"
                rounded
                color="dark"
                floating
              >X</q-badge>
            </q-avatar>
            <q-icon
              class="q-mx-xs"
              name="more_horiz"
              size="1.5vw"
              color="grey"
              :key="'notifyer_more_horiz'+notif.userid"
            />
          </template>
          <q-avatar
            class="cursor-pointer"
            @click="openWechatUserPanel(notifyer)"
            rounded
            color="blue-grey-2"
            title="请选择抄送人"
            text-color="white"
            icon="add_box"
          />
        </div>
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>

<script>
export default {
  name: 'ApproverUserlistPanel',
  props: {
    approver: {
      type: Array,
      require: true,
      default: () => []
    },
    notifyer: {
      type: Array,
      require: true,
      default: () => []
    }
  },
  methods: {
    openWechatUserPanel (selected) {
      this.$q.dialog({
        component: () => import('components/contacts/wechat/SelectWechatDeptUserlist'),
        parent: this,
        disable: _.map(selected, 'userid')
      }).onOk(user => {
        selected.push(user)
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
