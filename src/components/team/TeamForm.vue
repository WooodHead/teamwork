<template>
  <tw-form @primary="onSubmit">
    <q-input
      v-model="model.title"
      input-class="text-center text-h5"
      :placeholder="$t('team.field.placeholder.title')"
      lazy-rules
      :rules="[val => !!val.trim() || $t('team.editCerify.title')]"
      filled
      debounce="500"
    />
    <q-input
      v-model="model.notes"
      type="textarea"
      :placeholder="$t('team.field.placeholder.notes')"
      outlined
      filled
    />
    <div
      class="row justify-center"
      v-if="!moreInfo"
      @click="moreInfo=!moreInfo"
    >
      <q-btn
        color="primary"
        icon-right="keyboard_arrow_down"
        flat
        :label="$t('team.moreInfo')"
      />
    </div>
    <template v-else>
      <div class="row q-col-gutter-x-md">
        <tw-select-person
          class="col-12 col-sm-6"
          v-model="model.leaderID"
          emit-value
          :label="$t('team.leader')"
          lazy-rules
          :rules="[val => val>0 || $t('team.editCerify.leader')]"
          filled
        />
        <tw-select-tree
          class="col-12 col-sm-6"
          filled
          emit-value
          :nodes="selectOrganizesTree"
          isOrganize
          :model.sync="model.organizeID"
          node-key="id"
          label-key="name"
          position="bottom"
          :label="$t('base.resourceOrganize')"
          lazy-rules
          :rules="[val => val && val.length > 0 || $t('base.resourceCerifyOrganize')]"
        />
      </div>
      <div
        class="row q-col-gutter-x-md q-mt-none"
        :class="{'q-gutter-y-md':$q.platform.is.mobile}"
      >
        <q-input
          class="col-12 col-sm-6 q-mt-none"
          filled
          v-model="model.code"
          input-class="text-subtitle1"
          :placeholder="$t('team.code')"
        />
        <tw-select-edit
          withDictKey
          class="col-12 col-sm-6"
          filled
          module="team"
          field="Type"
          :value="model.type"
          :editable="$myinfo.auth.role.isSystemAdministrator"
          @input="(payload)=>{model.type= payload.dictValue}"
          :label="$t('team.type')"
        />
      </div>
      <q-field
        filled
        :label="$t('auth.acl.acl')"
        stack-label
        color="grey-8"
      >
        <q-option-group
          :options="options"
          type="radio"
          v-model="model.acl"
        />
      </q-field>
    </template>
  </tw-form>
</template>

<script>
import Team from '@/store/team/model'
import Guide from '@/store/guide/model'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'TeamForm',
  props: {
    openType: {
      type: String,
      default: 'add'
    },
    id: {
      type: [String, Number],
      default: 0
    },
    addFromTemplate: {
      type: Boolean,
      default: false,
      description: '是否从模板中添加文档'
    }
  },
  data () {
    return {
      model: new Team(),
      guideModel: new Guide(),
      moreInfo: false,
      options: [
        { label: this.$t('auth.acl.public'), value: 0 },
        { label: this.$t('auth.acl.restrict'), value: 1 },
        { label: this.$t('auth.acl.secret', { category: this.$t('team.title') }), value: 2 }
      ]
    }
  },
  mounted () {
    // 编辑页获取数据
    let that = this
    if (this.openType === 'edit') {
      this.moreInfo = true
      this.loadTeam(Number(this.id)).then(res => {
        if (res) {
          that.model = _.cloneDeep(res)
          if (this.addFromTemplate) {
            Object.assign(that.model, { title: '', acl: 1, whiteList: [], isTemplate: 0 })
          }
        }
      })
    }
    if (Object.keys(this.widgets).length) {
      this.model.widgets = this.widgets
    } else {
      let that = this
      this.loadCategory('team').then(category => {
        that.model.widgets = that.widgets
      })
    }
  },
  computed: {
    ...mapGetters('organize', ['selectOrganizesTree']),
    widgets () {
      return this.$store.getters['resource/initWidgets']('team')
    }
  },
  components: {
    TwSelectPerson: () => import('components/base/TwSelectPerson.vue'),
    TwSelectTree: () => import('components/base/TwSelectTree'),
    TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit'),
    TwForm: () => import('components/base/TwForm')
  },
  methods: {
    ...mapActions('team', ['loadTeam', 'addTeam', 'updateTeam']),
    ...mapActions('resource', ['loadCategory']),
    ...mapActions('guide', ['addGuide']),
    onSubmit () {
      let actionFunName = 'addTeam'
      if (this.openType === 'edit' && this.addFromTemplate) {
        actionFunName = 'addTeamFromTemplate'
      } else if (this.openType === 'edit' && !this.addFromTemplate) {
        actionFunName = 'updateTeam'
      }
      this.openType === 'edit' && this.addFromTemplate && (this.model.templateID = this.id)

      this.$store.dispatch(`team/${actionFunName}`, this.model).then(res => {
        if (res) {
          if (actionFunName === 'addTeam') {
            Object.assign(this.guideModel, { objectID: res.id, objectType: 'team', owner: res.leaderID })
            this.addGuide(this.guideModel)
          }
          this.$router.push({
            name: 'teamDetail',
            params: {
              id: res.id
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.team-border {
  border: solid 1px lightgray;
  border-radius: 4px;
}
.marginStyle {
  margin-top: 0 !important;
}
</style>
