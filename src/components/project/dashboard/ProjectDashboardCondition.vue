<!--
@Name：项目统计图条件
@Author：陆欢
@date：2021/07/23
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <div class="row q-gutter-y-md">
    <!-- 时间范围 -->
    <div class="col-12 q-px-xs">
      <tw-select-year
        label="时间范围"
        @selectYear="selectYear"
        :init="newModel?newModel.SelectYear:''"
      ></tw-select-year>
    </div>
    <!-- 项目等级 -->
    <div class="col-12">
      <tw-select-edit
        withDictKey
        filled
        clearable
        module="project"
        field="ProjLevel"
        :value="newModel.ProjLevel"
        :editable="!!$myinfo.auth.role.isSystemAdministrator"
        @input="updateModel('ProjLevel',$event.dictValue)"
        :label="$t('project.levelNotes')"
      />
    </div>
    <!-- 项目类型 -->
    <div class="col-12">
      <tw-select-edit
        clearable
        filled
        withDictKey
        module="project"
        field="ProjType"
        :editable="!!$myinfo.auth.role.isSystemAdministrator"
        :value=" newModel.ProjType"
        @input="updateModel('ProjType',$event.dictValue)"
        :label="$t('project.typeNotes')"
      />
    </div>
    <!-- 机构 -->
    <div class="col-12 q-mb-md project-border">
      <div
        class="q-pt-sm text-caption text-grey-7"
        style="padding-left:12px;"
      >{{$t('auth.fields.organize')}}</div>
      <div style="padding:0px 5px;">
        <q-option-group
          :options="options"
          type="radio"
          v-model="newModel.OrganizeRange"
          @input="setOptionGroup"
        />
        <div
          class="q-pl-md q-pb-md"
          v-if="selectedNames.length&&newModel.OrganizeRange==='definedSelf'"
          @click="isShowDialog=true"
        ><span class="cursor-pointer text-primary text-italic">自定义机构有：</span>{{selectedNames}}</div>
      </div>
      <q-dialog v-model="isShowDialog">
        <tw-tree
          :nodes="selectOrganizesTree"
          node-key="id"
          label-key="name"
          tickStrategy="strict"
          multiple
          :ticked="selectedIds.length==0?null:selectedIds"
          @selected-event="getSelected"
        />
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'
import { mapGetters } from 'vuex'
export default {
  name: 'ProjectDashboardCondition',
  props: {
    type: {
      type: Object,
      required: true,
      description: '选择具体某一种图表'
    },
    model: {
      type: Object,
      require: true,
      description: '条件model'
    }
  },
  data () {
    return {
      newModel: { OrganizeRange: 'allOrganize' },
      selectedIds: [],
      selectedNames: '',
      isShowDialog: false,
      options: [
        { label: this.$t('project.dashboard.organizeSelect.my'), value: 'myOrganize' },
        { label: this.$t('project.dashboard.organizeSelect.all'), value: 'allOrganize' },
        { label: this.$t('project.dashboard.organizeSelect.definedSelf'), value: 'definedSelf' }
      ]
    }
  },
  mounted () {
    this.newModel = Object.assign({}, this.newModel, this.model)
    if (this.newModel.hasOwnProperty('OrganizeIDs')) {
      this.selectedIds = this.newModel.OrganizeIDs.split(',')
      this.selectedIds = _.map(this.selectedIds, s => { return +s })
      this.selectedNames = this.newModel.OrganizeNames
    }
    this.$emit('update:model', this.newModel)
  },
  computed: {
    ...mapGetters('organize', ['selectOrganizesTree'])
  },
  methods: {
    setOptionGroup (value) {
      value === 'definedSelf' && (this.isShowDialog = true)
      if (value !== 'definedSelf') {
        this.newModel = _.omit(this.newModel, ['OrganizeIDs', 'OrganizeNames'])
        this.$emit('update:model', this.newModel)
      }
    },
    // 获取选择的项目
    getSelected (selectedOrganizes) {
      selectedOrganizes = _.filter(selectedOrganizes, function (o) { return o })
      this.selectedIds = _.map(selectedOrganizes, 'id')
      this.selectedNames = _.map(selectedOrganizes, 'name').toString()
      this.newModel.OrganizeIDs = this.selectedIds.toString()
      this.newModel.OrganizeNames = this.selectedNames
      this.$emit('update:model', this.newModel)
      this.isShowDialog = false
    },
    // 更新条件
    updateModel (type, value) {
      // 更新条件
      let obj = {}
      obj[type] = value || null
      this.newModel = Object.assign({}, this.newModel, obj)
      this.$emit('update:model', this.newModel)
    },
    optionsFn (d) {
      return d <= date.formatDate(Date.now(), 'YYYY/MM/DD')
    },
    selectYear (payload) {
      if (Object.values(payload).length) {
        this.updateModel('StartDate', payload.StartDate)
        this.updateModel('EndDate', payload.EndDate)
        this.updateModel('SelectYear', payload.SelectYear)
      } else {
        this.newModel = _.omit(this.newModel, ['StartDate', 'EndDate', 'SelectYear'])
        this.$emit('update:model', this.newModel)
      }
    }
  },
  components: {
    TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit'),
    'TwTree': () => import('components/base/TwTree'),
    TwSelectYear: () => import('components/base/TwSelectYear')
  }
}
</script>

<style scoped>
  .project-border {
    border: solid 1px lightgray;
    border-radius: 4px;
  }
</style>
