<template>
  <tw-form @primary="onSubmit">
    <q-input
      filled
      v-model="model.title"
      input-class="text-center text-h5"
      :placeholder="$t('productDev.field.placeholder.title')"
      lazy-rules
      :rules="[val => !!val.trim() || $t('productDev.editCerify.title')]"
    />
    <q-input
      v-model="model.notes"
      type="textarea"
      :placeholder="$t('productDev.field.placeholder.notes')"
      filled
    />
    <tw-select-edit
      withDictKey
      filled
      module="productDev"
      field="Type"
      :editable="$myinfo.auth.role.isSystemAdministrator"
      :value="model.type"
      @input="(payload)=>{model.type=payload.dictValue}"
      :label="$t('productDev.type')"
      lazyRules
      :rules="[val =>val&&val.length  || $t('productDev.editCerify.type')]"
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
        :label="$t('productDev.moreInfo')"
      />
    </div>
    <template v-else>
      <div class="row q-col-gutter-x-md q-mt-none">
        <tw-select-person
          class="col-12 col-sm-6"
          filled
          v-model="model.leaderID"
          emit-value
          :label="$t('productDev.leader')"
          lazy-rules
          :rules="[val => val>0 || $t('productDev.editCerify.leader')]"
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

      <q-input
        class="q-mt-none"
        input-class="text-center"
        v-model="model.predictEndDate"
        filled
        :label="$t('productDev.predictEndDate')"
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
                v-model="model.predictEndDate"
                @input="() => $refs.qDateProxy.hide()"
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
import ProductDev from '@/store/product-dev/model'
import { mapGetters, mapActions } from 'vuex'
import { date } from 'quasar'
const { formatDate } = date
export default {
  name: 'ProductDevForm',
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
      model: new ProductDev(),
      moreInfo: false,
      options: [
        { label: this.$t('auth.acl.public'), value: 0 },
        { label: this.$t('auth.acl.restrict'), value: 1 },
        { label: this.$t('auth.acl.secret', { category: this.$t('productDev.title') }), value: 2 }
      ]
    }
  },
  mounted () {
    // 编辑页获取数据
    let that = this
    if (this.openType === 'edit') {
      this.moreInfo = true
      this.loadProductDev(Number(this.id)).then(res => {
        if (res) {
          that.model = _.cloneDeep(res)
          if (this.addFromTemplate) {
            Object.assign(that.model, { title: '', acl: 1, whiteList: [], isTemplate: 0, status: 'wait' })
          }
        }
      })
    } else if (this.openType === 'add') {
      this.loadSettings().then(settings => {
        let devSetting = settings.devSystem
        this.model.forManagement = devSetting.forManagement
        this.model.forDeclaration = devSetting.forDeclaration
      })
    }
    if (Object.keys(this.widgets).length) {
      this.model.widgets = this.widgets
    } else {
      let that = this
      this.loadCategory('productDev').then(category => {
        that.model.widgets = that.widgets
      })
    }
  },
  computed: {
    ...mapGetters('organize', ['selectOrganizesTree']),
    widgets () {
      return this.$store.getters['resource/initWidgets']('productDev')
    }
  },
  components: {
    TwSelectPerson: () => import('components/base/TwSelectPerson.vue'),
    TwSelectTree: () => import('components/base/TwSelectTree'),
    TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit'),
    TwForm: () => import('components/base/TwForm')
  },
  methods: {
    ...mapActions('productDev', ['loadProductDev', 'addProductDev', 'updateProductDev']),
    ...mapActions('resource', ['loadCategory']),
    ...mapActions('settings', ['loadSettings']),
    optionsFn (date) {
      return this.openType === 'edit' ? date >= formatDate(this.model.beginDate, 'YYYY/MM/DD') : date >= formatDate(new Date(), 'YYYY/MM/DD')
    },
    onSubmit () {
      let actionFunName = 'addProductDev'
      if (this.openType === 'edit' && this.addFromTemplate) {
        actionFunName = 'addProductDevFromTemplate'
      } else if (this.openType === 'edit' && !this.addFromTemplate) {
        actionFunName = 'updateProductDev'
      }
      this.openType === 'edit' && this.addFromTemplate && (this.model.templateID = this.id)
      this.$store.dispatch(`productDev/${actionFunName}`, this.model).then(res => {
        if (res) {
          this.$router.push({
            name: 'productDevDetail',
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

<style lang="scss" scoped>
</style>
