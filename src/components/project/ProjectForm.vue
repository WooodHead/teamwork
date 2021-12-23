 <!--
 @Name：项目编辑界面
 @Author：陆欢
 @date：2020/06/03
 @modify:
 @modifyTime:
 -->
<template>
  <tw-form
    @primary="onSubmit"
    :inset="addFromTemplate"
  >
    <q-input
      v-model="model.title"
      input-class="text-center text-h5"
      :placeholder="$t('document.field.placeholder.title')"
      lazy-rules
      :rules="[val => !!val.trim() || $t('project.formCerifyRule.title')]"
      autofocus
      debounce="500"
      filled
    />
    <q-input
      v-model="model.notes"
      type="textarea"
      :placeholder="$t('project.field.placeholder.description')"
      filled
    />
    <div class="row q-col-gutter-x-md">
      <tw-select-edit
        class="col-12 col-sm-6"
        withDictKey
        filled
        module="project"
        field="ProjLevel"
        :value="model.projLevel"
        :editable="$myinfo.auth.role.isSystemAdministrator"
        @input="(payload)=>{model.projLevel=payload.dictValue}"
        :label="$t('project.levelNotes')"
        lazyRules
        :rules="[val =>val&&val.length  || $t('project.editCerify.level')]"
      />
      <tw-select-edit
        class="col-12 col-sm-6"
        withDictKey
        filled
        module="project"
        field="ProjType"
        :editable="$myinfo.auth.role.isSystemAdministrator"
        :value=" model.type"
        @input="(payload)=>{model.type= payload.dictValue}"
        :label="$t('project.typeNotes')"
        lazyRules
        :rules="[val =>val&&val.length  || $t('project.editCerify.type')]"
      />
    </div>
    <div
      class="row justify-center"
      v-if="!showMoreInfoNotes"
      @click="showMoreInfoNotes=!showMoreInfoNotes"
    >
      <q-btn
        color="primary"
        icon-right="keyboard_arrow_down"
        flat
        :label="$t('project.moreInfoNotes')"
      />
    </div>
    <template v-else>
      <div class="row q-col-gutter-x-md q-mt-none">
        <tw-select-person
          class="col-12 col-sm-6"
          filled
          v-model="model.leaderID"
          emit-value
          :label="$t('project.leader')"
          lazy-rules
          :rules="[val => val>0 || $t('project.formCerifyRule.leader')]"
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

      <q-field
        class="q-mt-none"
        color="grey-8"
        filled
        :label="$t('project.projectSource')"
        stack-label
      >
        <template v-slot:control>
          <div class="self-center full-width no-outline q-gutter-y-md q-py-sm">
            <tw-select-tree
              :borderless="noBorder"
              :clear="clear"
              :nodes="selectOrganizesTree"
              :model.sync="model.projSource.organize"
              node-key="id"
              label-key="name"
              is-organize
              position="bottom"
              label="来源内部机构"
              lazy-rules
              @reset="clearOrgSource"
            >
            </tw-select-tree>
            <q-select
              borderless
              :options="customers"
              v-model="model.projSource.customer"
              option-value="id"
              option-label="title"
              emit-value
              map-options
              clearable
              label="来源外部客户"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    {{$t('base.noResults')}}
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </template>
      </q-field>
      <q-input
        input-class="text-center"
        v-model="model.predictEndDate"
        filled
        :label="$t('project.predictEndDate')"
        mask="date"
      >
        <template v-slot:append>
          <q-icon
            name="event"
            class="cursor-pointer"
          >
            <q-popup-proxy
              ref="qDateProxy"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                :value="model.predictEndDate"
                @input="dateInput($event)"
                minimal
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
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
import { mapState, mapGetters, mapActions } from 'vuex'
import Project from '@/store/project/model'
import Guide from '@/store/guide/model'
import { date } from 'quasar'
import { showWarningMessage } from '@/utils/show-message'
export default {
  name: 'ProjectForm',
  props: {
    id: {
      type: [String, Number],
      default: 0
    },
    openType: {
      type: String,
      default: 'add'
    },
    addFromTemplate: {
      type: Boolean,
      default: false,
      description: '是否从模板中添加文档'
    },
    noBorder: {
      type: Boolean,
      default: true
    },
    clear: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      formAction: [{ label: this.$t('action.save'), action: 'save' }],
      model: new Project(),
      guideModel: new Guide(),
      showMoreInfoNotes: false,
      options: [
        { label: this.$t('auth.acl.public'), value: 0 },
        { label: this.$t('auth.acl.restrict'), value: 1 },
        { label: this.$t('auth.acl.secret', { category: this.$t('project.title') }), value: 2 }
      ],
      customers: []
    }
  },
  mounted () {
    this.loadSelectCustomers().then(res => {
      this.customers = _.cloneDeep(res)
    })
    // 编辑页获取数据
    let that = this
    if (this.openType === 'edit') {
      this.showMoreInfoNotes = true
      this.loadProject(Number(this.id)).then(res => {
        if (res) {
          that.model = _.cloneDeep(res)
          if (!that.model.type) {
            that.model.type = undefined
          }
          if (this.addFromTemplate) {
            Object.assign(that.model, { title: '', acl: 1, whiteList: [], isTemplate: 0 })
          }
          if (that.model.widgets.customer) { // 同步更新【关联客户】卡片的数据至项目编辑页中的【来源客户】
            // 获取当前项目的关联客户
            let relations = this.$store.getters['resource/resourceRelations']({ category1: 'project', id1: +that.id, category2: 'customer' })
            if (relations && relations.length) {
              let mapIds = relations.map(r => r.selectId)
              this.model.projSource.customer = mapIds && mapIds[0]
            }
          }
        }
      })
    }
    if (Object.keys(this.widgets).length) {
      this.model.widgets = this.widgets
    } else {
      let that = this
      this.loadCategory('project').then(category => {
        that.model.widgets = that.widgets
      })
    }
  },
  computed: {
    ...mapGetters('organize', ['selectOrganizesTree']),
    ...mapGetters('project', ['needApply']),
    ...mapState('project', ['projectLevel', 'projectType']),
    widgets () {
      return this.$store.getters['resource/initWidgets']('project')
    }
    // orgsAndChild () {
    //   return this.$store && this.$store.getters['organize/selectOrganizesChildTreeByOrganizeIds'](this.isSysOrSeniorManager ? '1' : this.$myinfo.organizeIds)
    // }
  },
  methods: {
    ...mapActions('project', ['loadProject', 'addProject', 'updateProject']),
    ...mapActions('resource', ['loadCategory', 'loadResourceRelations']),
    ...mapActions('guide', ['addGuide']),
    ...mapActions('customer', ['loadSelectCustomers']),
    onSubmit () {
      // 如果项目类型是P:，则无状态
      const isNeedApply = this.needApply(this.model.type)
      if (!isNeedApply) {
        Object.assign(this.model, { status: '' })
      } else if (isNeedApply && !this.model.status) {
        Object.assign(this.model, { status: 'wait' })
      }

      let diff = date.getDateDiff(new Date(this.model.predictEndDate ? this.model.predictEndDate.replace(/-/g, '/') : new Date()), new Date(), 'days')
      let diffBeginData = date.getDateDiff(new Date(this.model.predictEndDate
        ? this.model.predictEndDate.replace(/-/g, '/') : new Date()), new Date(this.model.beginDate ? this.model.beginDate.replace(/-/g, '/') : new Date()), 'days')
      if (this.model.beginDate && diffBeginData < 0) {
        showWarningMessage(this.$t('project.error.approvalNodes'))
      } else {
        if (this.openType === 'add') {
          if (diff < 0) {
            showWarningMessage(this.$t('project.error.dateError'))
          } else {
            Object.assign(this.model, { notes: this.model.notes.trim(), title: this.model.title.trim() })
            this.addProject(this.model).then(res => {
              if (Object.keys(res).length > 0) {
                Object.assign(this.guideModel, { objectID: res.id, objectType: 'project', owner: res.leaderID })
                this.addGuide(this.guideModel)
                this.routeToDetail(res.id)
                // 同步更新资源关系
                this.$store.state.resource.categorys = {}
                this.$store.state.resource.resourceRelations = this.$store.state.resource.resourceRelations.filter(r => r.category1 !== 'project' || r.id1 !== +res.id)
                this.loadResourceRelations({ category1: 'project', id1: +res.id, category2: 'customer', type: 'correlation', fields: 'Select' })
              }
            })
          }
        } else {
          this.addFromTemplate && (this.model.templateID = this.id)
          Object.assign(this.model, { notes: this.model.notes.trim(), title: this.model.title.trim() })
          this.$store.dispatch(`project/${this.addFromTemplate ? 'addProjectFromTemplate' : 'updateProject'}`, this.model)
            .then(res => {
              if (Object.keys(res).length > 0) {
                this.routeToDetail(res.id)
              }
              // 同步更新资源关系
              this.$store.state.resource.categorys = {}
              this.$store.state.resource.resourceRelations =
                this.$store.state.resource.resourceRelations.filter(r => r.category1 !== 'project' || r.id1 !== +res.id)
              this.loadResourceRelations({ category1: 'project', id1: +res.id, category2: 'customer', type: 'correlation', fields: 'Select' })
            })
        }
      }
    },
    routeToDetail (id) {
      this.$router.push({
        name: 'projectDetail',
        params: { id: Number(id) }
      })
    },
    dateInput (value) {
      this.$refs.qDateProxy.hide()
      this.model.predictEndDate = value
    },
    clearOrgSource () {
      // 清空选择的来源机构
      this.model.projSource.organize = ''
    }
  },
  components: {
    TwSelectPerson: () => import('components/base/TwSelectPerson.vue'),
    TwSelectTree: () => import('components/base/TwSelectTree'),
    TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit'),
    TwForm: () => import('components/base/TwForm')
  }
}
</script>

<style scoped>
</style>
