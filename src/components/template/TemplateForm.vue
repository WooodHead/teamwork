<!--
@Name：添加模板
@Author：陆欢
@date：2021/06/10
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <tw-form @primary="onSave">
    <!-- 标题 -->
    <q-input
      filled
      v-model="model.title"
      input-class="text-center text-h5"
      :placeholder="$t('document.field.placeholder.title')"
      lazy-rules
      :rules="[val => !!val.trim() || $t('template.formCerifyRule.title')]"
      autofocus
      debounce="500"
    />
    <!-- 描述 -->
    <q-input
      v-model="model.notes"
      type="textarea"
      :placeholder="$t('template.description')"
      filled
    />
    <tw-select-edit
      v-if="category==='project'"
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
    <div
      class="row justify-center"
      v-if="!showMoreInfoNotes"
      @click="showMoreInfoNotes=!showMoreInfoNotes"
    >
      <q-btn
        color="primary"
        icon-right="keyboard_arrow_down"
        flat
        :label="$t('template.moreInfoNotes')"
      />
    </div>
    <template v-else>
      <tw-select-edit
        withDictKey
        filled
        :module="category"
        :field="type[category]"
        :editable="$myinfo.auth.role.isSystemAdministrator"
        :value="model.type"
        @input="(payload)=>{model.type=payload.dictValue}"
        lazyRules
        :label="$t('template.typeNotes')"
      />
      <div
        class="row q-col-gutter-x-md"
        :class="{'q-gutter-y-md':$q.platform.is.mobile}"
      >
        <tw-select-person
          filled
          class="col-12 col-sm-6 q-mt-none"
          v-model="model.leaderID"
          emit-value
          :label="$t('template.leader')"
          lazy-rules
        />
        <tw-select-tree
          filled
          class="col-12 col-sm-6"
          emit-value
          :nodes="selectOrganizesTree"
          isOrganize
          :model.sync="model.organizeID"
          node-key="id"
          label-key="name"
          position="bottom"
          :label="$t('base.resourceOrganize')"
          lazy-rules
        />
      </div>
      <!-- 权限 -->
      <q-field
        filled
        :label="$t('auth.acl.acl')"
        stack-label
        color="grey-8"
      >
        <template v-slot:control>
          <q-option-group
            :options="options"
            type="radio"
            v-model="model.acl"
            class="col-12"
          />
          <q-card-section
            v-if="model.isTemplate"
            class="col"
          >
            <tw-secrecy-area
              :category="category"
              :isDispatchCategory="false"
              :currentModel.sync="model"
              showSetWhiteButton
            />
          </q-card-section>
        </template>
      </q-field>
    </template>
  </tw-form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import { date } from 'quasar'
// import { showWarningMessage } from '@/utils/show-message'
export default {
  name: 'TemplateForm',
  props: {
    id: {
      type: [String, Number],
      default: 0
    },
    openType: {
      type: String,
      default: 'add'
    },
    category: {
      type: String,
      default: '',
      required: false,
      description: '模块类型'
    }
  },
  data () {
    return {
      showMoreInfoNotes: false,
      model: {},
      options: [
        { label: this.$t('auth.acl.public'), value: 0 },
        { label: this.$t('auth.acl.restrict'), value: 1 },
        { label: this.$t('auth.acl.secretSelectPson'), value: 2 }
      ],
      type: { project: 'ProjType', team: 'Type', productDev: 'Type' }
    }
  },
  mounted () {
    let CategoryM = require(`src/store/${this.category === 'productDev' ? 'product-dev' : this.category}/model.js`).default
    this.model = new CategoryM({ isTemplate: true })
    // 此处主要是为了项目等级的默认值为2不正确，需要存成对应的值，否则使用模板时会报错
    // 编辑页获取数据
    let that = this
    if (this.openType === 'edit') {
      this.showMoreInfoNotes = true
      this.loadTemplate({ id: Number(this.id), category: this.category }).then(res => {
        if (res) {
          that.model = Object.assign({}, that.model, res)
          if (!that.model.type) {
            that.model.type = undefined
          }
          // that.model = _.cloneDeep(res)
          that.model.whiteList.push(this.$myinfo.id)
          that.model.whiteList = _.uniq(that.model.whiteList)
        }
      })
    } else {
      this.loadCategory(this.category)
    }
  },
  computed: {
    ...mapGetters('organize', ['selectOrganizesTree']),
    widgets () {
      let wi = this.$store.getters['resource/initWidgets'](this.category)
      // wi = _.pick(wi, ['task', 'document', 'notice', 'checkins'])
      return wi
    }
  },
  methods: {
    uniq: _.uniq,
    ...mapActions('template', ['loadTemplate', 'addTemplate', 'updateTemplate']),
    ...mapActions('resource', ['loadCategory']),
    onSave () {
      Object.assign(this.model, { status: '' })
      if (this.openType === 'add') {
        this.model.widgets = this.widgets
        this.addTemplate({ template: this.model, category: this.category }).then(res => {
          if (Object.keys(res).length > 0) {
            this.routeToDetail(res.id)
          }
        })
      } else {
        this.updateTemplate({ template: this.model, category: this.category }).then(res => {
          if (Object.keys(res).length > 0) {
            this.routeToDetail(res.id)
          }
        })
      }
    },
    routeToDetail (id) {
      this.$router.push({
        name: `${this.category}Detail`,
        params: { id: Number(id) }
      })
    },
    dateInput (value) {
      this.$refs.qDateProxy.hide()
      this.model.predictEndDate = value
    }
  },
  components: {
    TwSelectPerson: () => import('components/base/TwSelectPerson.vue'),
    TwSelectTree: () => import('components/base/TwSelectTree'),
    TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit'),
    TwSecrecyArea: () => import('components/base/TwSecrecyArea'),
    TwForm: () => import('components/base/TwForm')
  }
}
</script>

<style scoped>
</style>
