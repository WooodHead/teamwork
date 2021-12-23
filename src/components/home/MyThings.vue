<template>
  <div class="q-gutter-y-sm">
    <q-card
      flat
      :bordered="!$q.platform.is.mobile"
      v-for="link in quickLinksCanSee"
      :key="link.name"
      class="q-pa-md quick-card"
    >
      <!-- 列表标题 -->
      <q-card-section class="q-pa-none q-mb-md">
        <p class="q-ma-none text-h2-g">{{link.name==='team'?$t('home.myOrganize'):$t('home.mine')+$t(`${link.name}.title`)}}</p>
      </q-card-section>

      <!-- 列表内容 -->
      <div
        v-if="(link.modelList&&link.modelList.length>0)||(link.name==='team'&&myOrganizes.length>0)"
        class="row q-gutter-y-md"
      >
        <template v-if="link.name==='team'&&myOrganizes.length>0">
          <resource-card
            v-for="org in myOrganizes"
            :key="`organize${org.id}`"
            category="organize"
            :model="org"
          />
        </template>

        <resource-card
          v-for="model in link.modelList"
          :key="`${link.name}${model.id}`"
          :category="link.name"
          :model="model"
        />
      </div>
      <div
        v-else
        class="q-py-md"
      >
        <div
          v-html="link.notes"
          :class="[{'text-center':!$q.screen.lt.sm},'text-grey-6']"
        ></div>
        <div class="text-center">
          <router-link
            tag="span"
            class="text-primary cursor-pointer"
            :to="link.toAdd"
          >{{$t('action.add')}}</router-link>
          <span class="text-grey-6">{{$t(`${link.name}.title`)}}</span>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
import { format, LocalStorage } from 'quasar'
import { mapState, mapGetters, mapMutations } from 'vuex'
const { capitalize } = format
export default {
  name: 'MyThings',
  components: {
    ResourceCard: () => import('components/resource/ResourceCard')
  },
  data () {
    return {
      myself: LocalStorage.getItem('myself')
    }
  },
  computed: {
    ...mapGetters('organize', ['filterOrganizesByContactsAcl']),
    ...mapState('home', ['apps']),
    ...mapState('organize', ['selectOrganizes']),
    ...mapState('settings', ['settings']),
    ...mapState('person', ['myQuickLinksDefault', 'selectPersons']),
    quickLinksCanSee () {
      // 我的部门/团队、我的项目、我的产品显示列表
      if (this.myself.settings.setWorkSpace && this.myself.settings.setWorkSpace.quickLinksHowToShow.length) {
        let quickLinksList = []
        this.myself.settings.setWorkSpace.quickLinksHowToShow.forEach(item => {
          if (item.show) {
            quickLinksList.push(_.filter(this.apps, q => q.name === item.name)[0])
          }
        })
        return quickLinksList
      } else {
        let quickLinksList = []
        this.myQuickLinksDefault.forEach(item => {
          if (item.show) {
            quickLinksList.push(_.filter(this.apps, q => q.name === item.name)[0])
          }
        })
        return quickLinksList
      }
    },
    homeOrganize () {
      return this.selectOrganizes[this.settings.company.id] || {}
    },
    myOrganizeIds () {
      // 处理organizeIds为undefined的情况，为空时默认是直属部门
      // 找出所有所属机构及上属机构
      let that = this
      let allRelationOrganizeIds = []

      let idsRange = this.myself.organizeIds && this.myself.organizeIds.split(',').map(Number)
      if (idsRange && this.myself) idsRange.push(this.myself.organizeId)
      idsRange = _.uniq(idsRange)

      _.forEach(
        _.filter(that.selectOrganizes, org => idsRange.includes(org.id)),
        org2 => {
          allRelationOrganizeIds = _.concat(allRelationOrganizeIds, org2.path.split(',').map(Number))
        }
      )

      return !_.isEmpty(this.homeOrganize) ? _.filter(_.uniq(allRelationOrganizeIds), o => o >= this.homeOrganize.id) : _.uniq(allRelationOrganizeIds)
    },
    myOrganizes () {
      let that = this
      return _.sortBy(
        _.forEach(
          _.cloneDeep(_.filter(that.filterOrganizesByContactsAcl(_.values(that.selectOrganizes)), item => that.myOrganizeIds.includes(item.id))),
          item2 => {
            item2.title = item2.shortName || item2.name
            item2.members = _.map(
              _.filter(that.selectPersons, p => {
                let curPersonOrganize = that.selectOrganizes[p.organizeId]
                if (p.organizeId > 0 && curPersonOrganize) {
                  return new RegExp(`^${item2.path}(,.*)?$`).test(curPersonOrganize.path)
                }
                return false
              })
              , 'id')
          }), ['level'])
    },
    myOrganizeLinkId () {
      return (this.myOrganizeIds.length > 0 && this.myOrganizeIds[0]) ||
        this.homeOrganize.Id ||
        this.myself.organizeId
    }
  },
  methods: {
    ...mapMutations('team', ['emptyTeams']),
    ...mapMutations('productDev', ['emptyProductDevs']),
    ...mapMutations('project', ['emptyProjects'])
  },
  created () {
    let that = this
    let conditions = {
      team: {
        query: [
          { 'Key': 'Members ->\'$.all\'', 'Value': _.toString(this.myself.id), 'Oper': 'search' },
          'and',
          { 'Key': 'Archived', 'Value': 0, 'Oper': 'eq' },
          'and',
          { 'Key': 'IsDelete', 'Value': 0, 'Oper': 'eq' }
        ],
        byPage: false
      },
      productDev: {
        query: [
          { 'Key': 'Members ->\'$.all\'', 'Value': _.toString(this.myself.id), 'Oper': 'search' },
          'and',
          { 'Key': 'Archived', 'Value': 0, 'Oper': 'eq' },
          'and',
          { 'Key': 'IsDelete', 'Value': 0, 'Oper': 'eq' },
          'and',
          { 'Key': 'forManagement', 'Value': 1, 'Oper': 'eq' },
          'and',
          { 'Key': 'IsTemplate', 'Value': 0, 'Oper': 'eq' }
        ],
        byPage: false
      },
      project: {
        query: [
          { Key: 'Archived', Value: 0, Oper: 'eq' }
        ],
        filter: { Status: 'myFocus' },
        byPage: false
      }
    }

    // 获取我的团队、产品、项目等信息
    _.forEach(_.filter(this.apps, ql => ['team', 'productDev', 'project'].includes(ql.name)), link => {
      // 清空历史列表
      that.$store.commit(`${link.name}/empty${capitalize(link.name)}s`)
      // 按需获取列表
      that.$store.dispatch(`${link.name}/load${capitalize(link.name)}s`, conditions[link.name]).then(res => {
        that.$set(link, 'modelList', res)
      })
    })
  }
}
</script>

<style lang='scss' scoped>
.quick-card.q-card--bordered {
  border: 1px solid $primary7;
}
</style>
