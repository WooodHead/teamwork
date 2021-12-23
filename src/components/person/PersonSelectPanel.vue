<template>
  <q-card :flat="flat">
    <q-card-section v-if="isSearchSort||multiple">
      <tw-search-sort
        :search.sync="search"
        :sort.sync='sort'
        :options="sortOptions"
        :searchTip="$t('person.SearchForNamesPositionsDepartmentsEtc')"
        v-if="isSearchSort"
        v-show="!selectByGroup"
      />
      <q-item
        class="q-pa-none"
        v-if="multiple"
      >

        <q-item-section
          v-if="isSelectByGroup"
          avatar
        >
          <q-btn
            flat
            dense
            align="left"
            color="primary"
            :icon="selectByGroup?'arrow_back':'group'"
            :label="selectByGroup?$t('label.back'):$t('base.selectGroup')"
            @click="selectByGroup=!selectByGroup"
          />
        </q-item-section>

        <q-item-section>
          <slot></slot>
        </q-item-section>

        <q-item-section
          side
          v-if="quickSelected"
          v-show="!selectByGroup"
        >
          <q-checkbox
            left-label
            :label="quickSelected.title"
            v-model="isQuickSelected"
            keep-color
            color="primary"
          />
        </q-item-section>

        <q-item-section
          side
          v-show="!selectByGroup"
        >
          <q-checkbox
            v-if="persons.length"
            left-label
            v-model="selectAll"
            :label="$t('label.selectAll')"
            keep-color
            color="primary"
            toggle-order="ft"
          />
        </q-item-section>
      </q-item>
    </q-card-section>
    <q-card-section
      v-if="isSelectByGroup"
      v-show="selectByGroup"
      class="select-group-person"
      :class="{'q-pt-none':multiple}"
    >
      <tw-group-person
        :isDialog="false"
        :obj-persons="allPersons"
        @select="selectGroup"
      />
    </q-card-section>
    <q-card-section
      :id="scrollTargetRef"
      v-show="!selectByGroup"
      :class="{
        'q-pt-none':multiple,
        [virtualScrollClass]:isVirtualScroll
      }"
    >
      <tw-banner-no-result v-if="isLoadedFinash
        &&selectedPersonsWapper.length===0" />
      <q-infinite-scroll
        v-if="isVirtualScroll"
        ref="qInfiniteScroll"
        :scroll-target="'#'+scrollTargetRef"
        @load="onLoad"
      >
        <q-list>
          <person-item
            v-for="person in selectedPersonsWapper"
            :key="person.id"
            :person="person"
            :active="selectedPersons.map(p=>p.id).includes(person.id)"
            @click="$emit('select', person)"
          >
            <q-checkbox
              v-if="multiple"
              v-model="selectedPersons"
              :val="person"
              keep-color
              @input="isShowButton||$emit('multiSelect',selectedPersons)"
              color="primary"
            />
          </person-item>
        </q-list>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner
              color="primary"
              name="dots"
              size="2rem"
            />
          </div>
        </template>
      </q-infinite-scroll>

      <q-list v-else>
        <person-item
          v-for="person in showedPersons"
          :key="person.id"
          :person="person"
          @click="$emit('select', person)"
        >
          <q-checkbox
            v-if="multiple"
            v-model="selectedPersons"
            :val="person"
            keep-color
            @input="isShowButton||$emit('multiSelect',selectedPersons)"
            color="primary"
          />
        </person-item>
        <div
          class="row justify-center"
          v-if="morePersons>0"
        >
          <q-btn
            flat
            :label="$t('app.loadMore')"
            color="primary"
            @click="showedPersonNum+=10"
          />
        </div>
      </q-list>
    </q-card-section>

    <q-card-actions
      align="right"
      v-if="multiple && isShowButton"
      v-show="!selectByGroup"
    >
      <q-btn
        dense
        outline
        :label="$q.lang.label.cancel"
        color="primary"
        v-close-popup
      />
      <q-btn
        dense
        :label="$q.lang.label.ok"
        color="primary"
        @click="okSelect"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'PersonSelectPanel',
  props: {
    multiple: {
      type: Boolean,
      required: false,
      default: false,
      description: '是否多选模式'
    },
    initSelectedPersonIDs: {
      type: Array,
      required: false,
      default: function () {
        return []
      },
      description: '初始选中人员ID列表'
    },
    initPersonScope: {
      type: Array,
      required: false,
      default: function () {
        return []
      },
      description: '初始人员选择范围IDs'
    },
    objectType: {
      type: String,
      required: false,
      default: null,
      description: '初始人员选择范围(Members资源类别)'
    },
    objectID: {
      type: [Number, String],
      required: false,
      default: null,
      description: '初始人员选择范围(Members资源ID)'
    },
    memberDutys: {
      type: String,
      required: false,
      default: '',
      ription: '初始人员选择范围(Members的Duty)'
    },
    quickSelected: {
      type: Object,
      required: false,
      default: null,
      description: '快捷选中指定人员 eg：{title:"项目成员",personIDs:[292,1,2]}'
    },
    flat: {
      type: Boolean,
      required: false,
      default: false,
      description: '是否flat模式'
    },
    isSearchSort: {
      type: Boolean,
      required: false,
      default: true,
      description: '是否显示搜索按钮'
    },
    isShowButton: {
      type: Boolean,
      required: false,
      default: true,
      description: '是否显示确定取消按钮'
    },
    isVirtualScroll: {
      type: Boolean,
      required: false,
      default: false,
      description: '是否虚拟滚动'
    },
    isSelectByGroup: {
      type: Boolean,
      required: false,
      default: true,
      description: '是否选择群组'
    },
    specificParam: {
      type: Object,
      required: false,
      default: null,
      description: '特殊筛选时用来传参'
    }
  },
  components: {
    TwSearchSort: () => import('components/base/TwSearchSort'),
    PersonItem: () => import('components/person/PersonItem'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    TwGroupPerson: () => import('components/base/TwGroupPerson')
  },
  data () {
    return {
      isQuickSelected: false,
      selectedPersons: [],
      selectByGroup: false,
      persons: [],
      selectedPersonsWapper: [],
      isLoadedFinash: false,
      // 模糊查询
      search: '',
      // 排序
      sort: 'pinyin',
      // 参与排序的对象列表
      sortOptions: [
        {
          label: '姓名',
          value: 'pinyin'
        },
        {
          label: '职位',
          value: 'dutyName'
        },
        {
          label: '机构',
          value: 'organizeName'
        }
      ],
      showedPersonNum: 10
    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    scrollTargetRef () {
      return 'scrollTargetRef' + new Date().getTime()
    },
    allPersons () {
      return this.selectPersons
    },
    selectAll: {
      get () {
        return this.selectedPersons.length === this.persons.length ? true : this.selectedPersons.length === 0 ? false : null
      },
      set (value) {
        // 全选
        if (value) {
          // 未选中人员列表
          let noSelectedPersons = _.differenceBy(this.persons, this.selectedPersons, 'id')
          // 未选中人员列表
          this.selectedPersons = _.concat(this.selectedPersons, this.personsfiltered(noSelectedPersons))
        } else { // 取消全选
          this.isQuickSelected = false
          // 1. 过滤出的人员
          let filterPersons = this.personsfiltered(this.persons)
          // 2. 已选中的离职或禁用人员
          let tempPersons = _.filter(this.selectedPersons, (p) => !(p.activated === true && +p.isInService === 1 && p.isOutStaff === 0))
          // 去掉选择1和2的人员
          this.selectedPersons = _.differenceBy(this.selectedPersons, _.concat(filterPersons, tempPersons), 'id')
        }
        this.$emit('multiSelectAll', this.selectedPersons)
      }
    },
    virtualScrollClass () {
      let virtualScrollClass = 'person-list'
      if (this.multiple) {
        virtualScrollClass += '-multiple'
      }
      if (this.isSearchSort) {
        virtualScrollClass += '-search'
      }
      if (this.multiple && this.isShowButton) {
        virtualScrollClass += '-btn'
      }
      return virtualScrollClass
    },
    showedPersons () {
      let noSelectedPersons = _.differenceBy(this.persons, this.selectedPersons, 'id')
      noSelectedPersons = this.personsSort(this.personsfiltered(noSelectedPersons))
      let selectedPersons = this.personsSort(this.personsfiltered(this.selectedPersons))
      return _.slice(_.concat(selectedPersons, noSelectedPersons), 0, this.showedPersonNum)
    },
    morePersons () {
      let noSelectedPersons = _.differenceBy(this.persons, this.selectedPersons, 'id')
      noSelectedPersons = this.personsSort(this.personsfiltered(noSelectedPersons))
      let selectedPersons = this.personsSort(this.personsfiltered(this.selectedPersons))
      return _.concat(selectedPersons, noSelectedPersons).length - this.showedPersonNum
    },
    listenChange () {
      const { objectID, objectType, initSelectedPersonIDs, initPersonScope, isQuickSelected, specificParam, search } = this
      return { objectID, objectType, initSelectedPersonIDs, initPersonScope, isQuickSelected, specificParam, search }
    }
  },
  watch: {
    // 快捷选中指定人员
    isQuickSelected: function (val) {
      if (this.quickSelected && this.quickSelected.personIDs.length) {
        let quickSelectedPerons = _.filter(this.persons, person => {
          return _.includes(this.quickSelected.personIDs, person.id) || _.includes(this.quickSelected.personIDs, String(person.id))
        })
        if (val) {
          quickSelectedPerons = _.differenceBy(quickSelectedPerons, this.selectedPersons, 'id')
          this.selectedPersons = _.concat(this.selectedPersons, quickSelectedPerons)
        } else {
          this.selectedPersons = _.differenceBy(this.selectedPersons, quickSelectedPerons, 'id')
        }
      }
    },
    listenChange: {
      deep: true,
      handler () {
        if (this.$refs.qInfiniteScroll) {
          this.$refs.qInfiniteScroll.reset()
          this.$refs.qInfiniteScroll.resume()
          this.$refs.qInfiniteScroll.trigger()
        } else if (!this.isVirtualScroll) {
          this.init()
        }
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    ...mapActions('member', ['loadMembers']),
    ...mapActions('person', ['loadProductDevSelectPersons']),
    ...mapActions('resource', ['loadResourceRelations']),
    onLoad (index, done) {
      if (!_.isEmpty(this.persons)) {
        let noSelectedPersons = _.differenceBy(this.persons, this.selectedPersons, 'id')
        noSelectedPersons = this.personsSort(this.personsfiltered(noSelectedPersons))
        let selectedPersons = this.personsSort(this.personsfiltered(this.selectedPersons))
        let selectAllPersons = _.concat(selectedPersons, noSelectedPersons)
        this.selectedPersonsWapper = _.slice(selectAllPersons, 0, index * 20)
        if (index * 20 >= selectAllPersons.length) {
          this.isLoadedFinash = true
          done(true)
        } else {
          done()
        }
      } else {
        done()
      }
    },
    /**
   *初始化选择面板
   */
    init () {
      // 初始化指定ID人员范围
      if (this.initPersonScope.length) {
        _.union(this.initPersonScope, this.initSelectedPersonIDs)
          .forEach(id => this.allPersons[id] && this.persons.push(..._.differenceBy([this.allPersons[id]], this.persons, 'id')))
        this.initSelectedPersonIDs
          .forEach(id => this.allPersons[id] && this.selectedPersons.push(..._.differenceBy([this.allPersons[id]], this.selectedPersons, 'id')))
      } else if (this.objectType && this.objectID) {
        // 初始化指定资源的人员选择范围
        this.loadMembers({ category: this.objectType, objectID: +this.objectID, types: this.memberDutys }).then(ids => {
          _.union(ids, this.initSelectedPersonIDs)
            .forEach(id => this.allPersons[id] && this.persons.push(..._.differenceBy([this.allPersons[id]], this.persons, 'id')))
          this.initSelectedPersonIDs
            .forEach(id => this.allPersons[id] && this.selectedPersons.push(..._.differenceBy([this.allPersons[id]], this.selectedPersons, 'id')))
        })
      } else if (this.specificParam && this.specificParam.objectType === 'project' && this.specificParam.identify === 'client') {
        this.filterProjectClientMembers(this.specificParam)
      } else {
        // 未指定人员选择范围，默认为全员
        this.persons = Object.values(this.allPersons)
        this.initSelectedPersonIDs
          .forEach(id => this.allPersons[id] && this.selectedPersons.push(..._.differenceBy([this.allPersons[id]], this.selectedPersons, 'id')))
      }
      // 过滤离职或禁用以及外部人员
      this.persons = _.filter(this.persons, p => {
        return p.activated === true && +p.isInService === 1 && +p.isOutStaff === 0
      })
    },
    /**
     * 群组选择
     */
    selectGroup (ids) {
      this.selectByGroup = false
      ids = _.map(ids, id => Number(id))
      ids.forEach(id => {
        this.allPersons[id] && this.persons.push(..._.differenceBy([this.allPersons[id]], this.persons, 'id'))
        this.allPersons[id] && this.selectedPersons.push(..._.differenceBy([this.allPersons[id]], this.selectedPersons, 'id'))
      })
      if (this.$refs.qInfiniteScroll) {
        this.$refs.qInfiniteScroll.reset()
        this.$refs.qInfiniteScroll.resume()
        this.$refs.qInfiniteScroll.trigger()
      }
      this.$emit('selectGroup', this.selectedPersons)
    },
    /**
   * 人员过滤
   */
    personsfiltered (persons) {
      if (this.search) {
        return _.filter(_.values(persons), person =>
          (person.name && person.name.toLowerCase().includes(this.search.toLowerCase())) ||
          (person.pinyin && person.pinyin.toLowerCase().includes(this.search.toLowerCase())) ||
          (person.email && person.email.toLowerCase().includes(this.search.toLowerCase())) ||
          (person.tel && person.tel.includes(this.search)) ||
          (person.jobNumber && person.jobNumber.includes(this.search)) ||
          (person.dutyName && person.dutyName.includes(this.search)) ||
          (person.organizeName && person.organizeName.includes(this.search))
        )
      } else {
        return persons
      }
    },
    /**
   * 人员排序
   */
    personsSort (persons) {
      return _.orderBy(persons, ['dutyLevel', 'activated', this.sort], ['desc', 'desc', 'asc'])
    },
    /**
     * 项目客户人员选择筛选
     */
    filterProjectClientMembers (specificParam) {
      this.loadResourceRelations({
        category1: specificParam.objectType,
        id1: +specificParam.objectID,
        category2: 'customer',
        type: 'correlation',
        fields: 'Select'
      }).then(res => {
        let categoryData = res.categoryData.customer ? res.categoryData.customer : res.categoryData
        let relations = this.$store.getters['resource/resourceRelations']({ category1: specificParam.objectType, id1: +specificParam.objectID, category2: 'customer' })
        let customerIds = _.map(relations, 'selectId')
        if (categoryData) {
          let psonIDS = []
          categoryData.map(customer => {
            if (customerIds.includes(customer.id)) { psonIDS = _.concat(psonIDS, customer.members) }
          })
          this.filterPersons(psonIDS)
          this.filterSelectedPersons(this.initSelectedPersonIDs)
        } else {
          this.persons = Object.values(this.allPersons)
          this.filterSelectedPersons(this.initSelectedPersonIDs)
        }
      })
    },
    filterPersons (ids) {
      ids.forEach(id => this.allPersons[id] && this.persons.push(..._.differenceBy([this.allPersons[id]], this.persons, 'id')))
    },
    filterSelectedPersons (ids) {
      ids.forEach(id => this.allPersons[id] && this.selectedPersons.push(..._.differenceBy([this.allPersons[id]], this.selectedPersons, 'id')))
    },
    okSelect () {
      let tempPersons = _.filter(this.selectedPersons, (p) => {
        return p.activated && p.inService
      })
      if (this.selectedPersons.length && tempPersons.length !== this.selectedPersons.length) {
        this.$q.dialog({
          title: '温馨提示',
          message: `选中的人员中包含${this.$t('person.leaveOffice')}或禁用的人员，是否过滤掉他们？`,
          ok: '是',
          cancel: '否',
          persistent: true
        }).onOk(() => {
          this.$emit('multiSelect', tempPersons)
        }).onCancel(() => {
          this.$emit('multiSelect', this.selectedPersons)
        })
      } else {
        this.$emit('multiSelect', this.selectedPersons)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.person-list
  height: calc(100vh - 60px - 32px)
  overflow: auto
.person-list-search
  height: calc(100vh - 60px - 72px - 32px)
  overflow: auto
.person-list-multiple
  height: calc(100vh - 60px - 80px - 16px)
  overflow: auto
.person-list-multiple-search
  height: calc(100vh - 60px - 120px - 16px)
  overflow: auto
.person-list-multiple-btn
  height: calc(100vh - 60px - 80px - 48px - 16px)
  overflow: auto
.person-list-multiple-search-btn
  height: calc(100vh - 60px - 120px - 48px - 16px - 60px)
  overflow: auto
.select-group-person
  height: calc(100vh - 60px - 32px - 80px - 28px)
  overflow: auto
</style>
