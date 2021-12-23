<template>
  <div v-if="currentModel.acl===2">
    <q-banner
      rounded
      class="bg-grey-3 text-subtitle1"
    >
      <template v-slot:avatar>
        <q-icon name="img:icons/secrecy/secrecy.png" />
      </template>
      <div class="row items-center">
        <span
          v-if="!currentModel.whiteList.length"
          class="q-pr-sm"
        >只有白名单里的人可访问</span>
        <resource-team-view
          size="md"
          fontSize="0.7rem"
          buttonLabel="设置白名单"
          :initPersonScope="ScopeAll?[]:(parentModel.acl===2?parentModel.whiteList:[])"
          :showButton="showSetWhiteButton||$myinfo.name===currentModel.createBy"
          :members="currentModel.whiteList"
          @updateMembers="updateMembers"
        />
        <q-space />
        <q-btn
          flat
          rounded
          color="primary"
          label="解除保密"
          v-if="$myinfo.name===currentModel.createBy&&isDispatchCategory"
          @click.native="cancelSecrecy"
        />
      </div>
    </q-banner>
  </div>
</template>

<script>
import { format } from 'quasar'
const { capitalize } = format
export default {
  name: 'TwSecrecyArea',
  props: {
    category: {
      type: String,
      required: false,
      default: 'document'
    },
    currentModel: {
      type: Object,
      required: true,
      default: () => { return { acl: 0, whiteList: [], createBy: '' } }
    },
    parentModel: {
      type: Object,
      required: false,
      default: () => { return { acl: 0, whiteList: [], createBy: '' } }
    },
    ScopeAll: {
      type: Boolean,
      required: false,
      default: false
    },
    isDispatchCategory: {
      type: Boolean,
      required: false,
      default: true,
      description: '是否直接更新后台，若不是则将model传出'
    },
    showSetWhiteButton: {
      type: Boolean,
      required: false,
      default: false,
      description: '是否显示设置白名单按钮。如果否不显示则会走权限只有自己可以设置'
    }
  },
  data () {
    return {}
  },
  methods: {
    // 设置白名单
    updateMembers (ids) {
      let createPerson = _.find(this.$store.getters['person/selectPersonsSorted'], p => p.name === this.currentModel.createBy)
      let createByID = createPerson ? createPerson.id : 0
      createByID && !(ids.includes(createByID)) && ids.push(createByID)
      this.currentModel.whiteList = ids
      if (this.isDispatchCategory) {
        this.$store.dispatch(`${this.category}/update${capitalize(this.category)}`, this.currentModel)
          .then(res => {
            this.$q.notify({ message: '设置成功！', icon: 'check', color: 'positive' })
          })
      } else {
        this.$emit('update:currentModel', this.currentModel)
      }
    },
    // 取消保密
    cancelSecrecy () {
      if (this.parentModel.acl === 2) {
        this.$q.notify({ message: '无法解除保密，请先设置父级文件夹为公开状态！', icon: 'check', color: 'purple' })
        return
      }
      this.$q.dialog({
        title: '温馨提示',
        message: '确定要公开该内容？',
        cancel: true,
        persistent: true
      }).onOk(() => {
        if (this.category === 'task') {
          this.$store.dispatch('task/unsecrecyTask', this.currentModel.id)
            .then(res => {
              this.$q.notify({ message: '解除成功！', icon: 'check', color: 'positive' })
            })
        } else {
          this.currentModel.acl = 0
          this.$store.dispatch(`${this.category}/update${capitalize(this.category)}`, this.currentModel)
            .then(res => {
              this.$q.notify({ message: '解除成功！', icon: 'check', color: 'positive' })
            })
        }
      }).onCancel(() => { })
    }
  },
  components: {
    ResourceTeamView: () => import('components/resource/ResourceTeamView')
  }
}
</script>

<style scoped lang="scss">
</style>
