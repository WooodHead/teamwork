<template>
  <tw-form
    @primary="onSave"
    :secondary="isShow"
    @secondary="organizeShow"
    :secondaryLabel="$t('action.cancel')"
  >
    <q-input
      filled
      v-model.trim="organizeObj.name"
      @input="$emit('update:title', $event)"
      :label="$t('contacts.organize.name')"
      lazy-rules
      :rules="nameRules"
      ref="title"
    />
    <q-input
      filled
      @input="$emit('update:title', $event)"
      v-model.trim="organizeObj.shortName"
      :label="$t('contacts.organize.simpleName')"
      lazy-rules
      :rules="[val => (val && val.length > 0) || '请输入正确的简介']"
      ref="title"
      class="q-mt-none"
    />
    <q-input
      filled
      v-model.trim="organizeObj.organizeCode"
      :label="$t('contacts.organize.organizeCode')"
      class="q-mt-none"
    />
    <div class="row q-col-gutter-x-md">
      <tw-select-person
        class="col-12 col-sm-6 q-pb-md"
        filled
        v-model="organizeObj.leaderID"
        emit-value
        :label="$t('organize.leader')"
      />
      <tw-select-edit
        class="col-12 col-sm-6"
        withDictKey
        keyToValue
        filled
        module="organize"
        field="organizeType"
        :value="String(organizeObj.type)"
        @input="
            payload => {
              organizeObj.type = payload.dictKey;
            }
          "
        :label="$t('organize.field.label.type')"
      />
    </div>
    <!-- 机构地址 -->
    <location-select
      v-if="$custom.hasOrganizeLocation"
      :class="{ 'q-mt-none': !$q.platform.is.mobile }"
      showSearch
      filled
      :mylocation.sync="organizeObj.organizeAddress"
      :placeholder="$t('contacts.organize.organizeAddress')"
    />
    <q-field
      filled
      :label="$t('auth.acl.acl')"
      stack-label
      color="grey-8"
    >
      <q-option-group
        :options="limits"
        type="radio"
        v-model="organizeObj.acl"
      />
    </q-field>
    <q-dialog v-model="isShowDialog">
      <q-card style="width:25%;">
        <q-card-section>
          <div class="text-h6">确认</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{ $t("organize.messageTip") }}
        </q-card-section>
        <q-card-actions
          align="right"
          class="q-pa-md"
        >
          <q-btn
            flat
            label="不同步"
            color="primary"
            @click="outSyncOrganize"
          />
          <q-btn
            flat
            label="同步"
            color="primary"
            @click="sycnOrganize"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </tw-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Organize from '@/store/organize/model'
export default {
  name: 'OrganizeEdit',
  props: {
    id: {
      type: [String, Number],
      default: 0
    },
    openType: {
      type: String,
      default: 'add'
    },
    isShow: {
      type: Boolean,
      default: false
    },
    node: {
      type: Object,
      required: false,
      default: () => {
        return new Organize()
      }
    }
  },
  watch: {
    id (newId, oldId) {
      if (newId !== oldId) {
        if (newId === 0) {
          this.organizeObj = {
            acl: 1,
            organizeAddress: { type: 'none', value: '' }
          }
        } else {
          this.loadOrganize(newId).then((res) => {
            this.organizeObj = res
            if (this.organizeObj.organizeAddress === null) {
              this.organizeObj.organizeAddress = { type: 'none', value: '' }
            }
          })
        }
      }
    }
  },
  data () {
    return {
      formAction: [{ label: this.$t('action.save'), action: 'save' }],
      organizeObj: new Organize(),
      type: '',
      limits: [
        { label: this.$t('auth.acl.public'), value: 0 },
        { label: this.$t('auth.acl.restrict'), value: 1 },
        {
          label: this.$t('auth.acl.secret', {
            category: this.$t('organize.title')
          }),
          value: 2
        }
      ],
      nextOrganizeAddrs: [], // 下一级机构集合
      isShowDialog: false
    }
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    // 校验机构名称
    nameRules () {
      return [
        (val) =>
          (val && val.split(' ').join('').length !== 0) || '请正确输入机构名称'
      ]
    },
    widgets () {
      return this.$store.getters['resource/initWidgets']('organize')
    },
    options () {
      return this.dictionary['organize']
        ? this.dictionary['organize']['organizeType']
        : []
    }
  },
  components: {
    TwSelectPerson: () => import('components/base/TwSelectPerson.vue'),
    TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit'),
    LocationSelect: () => import('components/location/LocationSelect'),
    TwForm: () => import('components/base/TwForm')
  },
  created () {
    this.organizeObj.type = 1
    // 获取机构类型下拉框字典数据
    this.loadDictionarys('organize')
    // 编辑页获取数据
    if (this.openType === 'edit') {
      this.loadOrganize(+this.id).then((res) => {
        this.organizeObj = _.cloneDeep(res)
        if (!this.organizeObj.organizeAddress) {
          this.organizeObj.organizeAddress = { type: 'none', value: '' } 
        }
      })
    }
    if (Object.keys(this.widgets).length) {
      this.organizeObj.widgets = this.widgets
    } else {
      this.loadCategory('organize').then((category) => {
        this.organizeObj.widgets = this.widgets
      })
    }
  },
  methods: {
    ...mapActions('resource', ['loadCategory']),
    ...mapActions('organize', [
      'loadOrganizes',
      'loadOrganize',
      'updateOrganize',
      'updateOrganizeField'
    ]),
    ...mapActions('dictionary', ['loadDictionarys']),
    // 保存
    onSave () {
      (this.$custom.hasOrganizeLocation && this.openType === 'edit')
        ? (this.isShowDialog = true)
        : this.updateOrg()
    },
    // 不同步
    async outSyncOrganize () {
      this.updateOrg()
      this.isShowDialog = false
    },
    // 同步
    async sycnOrganize () {
      this.nextOrganizeAddrs = []
      this.organizeObj.path = this.organizeObj.path + ','
      let forg = _.filter(this.$store.getters['organize/selectOrganizes'], o => o.path.includes(this.organizeObj.path))
      for (let i = 0; i < forg.length; i++) {
        await this.updateOrganizeField({ id: forg[i].id, organizeAddress: this.organizeObj.organizeAddress })
      }
      this.updateOrg()
      this.isShowDialog = false
    },
    // 更新机构信息
    updateOrg () {
      const titleValidate = this.$refs.title.validate()
      if (titleValidate) {
        if (this.openType === 'add') {
          this.organizeObj.id = this.node.id
          this.organizeObj.parentId = this.node.parentId
          this.organizeObj.path = this.node.path
          this.organizeObj.level = this.node.level
        }
        this.updateOrganize(this.organizeObj).then((res) => {
          this.organizeObj = res
          if (res) {
            this.$router.push({
              name: 'organizeDetail',
              params: { id: res.id }
            })
            this.organizeShow()
          }
        })
      }
    },
    // 取消同一下级,保存表单数据
    deselect () {
      this.updateOrg()
    },
    organizeShow () {
      this.$emit('organizeShow', false)
    }
  }
}
</script>

<style scoped>
</style>
