<template>
  <q-card
    flat
    bordered
    class="q-pa-md"
    :style="{'width': '35vw', 'max-height': $q.screen.lt.sm ? '60vh' : '80vh'}"
  >
    <q-card-section
      class="q-pa-none history-list"
      v-if="recentList"
    >
      <div class='q-mb-xs text-subtitle2 text-weight-bold'>{{$t(`home.history`)}}</div>
      <q-item
        v-for="(history, index) in recentList"
        :to="{name: history.name, params: history.params}"
        :key="index"
        class="q-pa-sm items-center history-item"
      >
        <q-item-label class="col-auto q-mr-sm items-center category-icon">
          <q-icon
            :name="history.icon"
            size="xs"
            class="text-primary"
          ></q-icon>
        </q-item-label>
        <q-item-label
          class="q-my-none text-grey-8 text-subtitle2 history-title"
          style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 0;"
        >
          {{history.title}}
        </q-item-label>
        <q-item-section
          v-if="history.subTitle"
          class="col-auto q-ml-sm q-my-none text-left text-grey-5 text-caption history-category"
        >
          - {{history.subTitle}}
        </q-item-section>
      </q-item>
    </q-card-section>
    <q-card-section
      class="q-pa-none history-list"
      v-for="link in appsCanSee"
      :key="link.name"
    >
      <!-- {{link.modelList}} -->
      <div
        class='q-mb-xs text-subtitle2 text-weight-bold'
        v-if="link.modelList && link.modelList.length > 0"
      >
        <span v-if="link.name==='team'">{{$t('home.mine')}}{{$t('organize.title')}} / </span>
        {{link.name==='team'?'':$t('home.mine')}}{{$t(`${link.name}.title`)}}
      </div>
      <div v-if="link.name==='team' && myOrganizes.length>0">
        <q-item
          v-for="org in myOrganizes"
          class="q-pa-sm"
          :key="org.id"
          :to="{name: `organizeDetail`, params: { id: `${Number(org.id)}`}}"
        >
          <q-item-label class="col-auto q-mr-sm items-center category-icon">
            <q-icon
              size="xs"
              class="text-primary"
              name="business"
            ></q-icon>
          </q-item-label>
          <q-item-label
            class="col-auto text-left text-grey-8 text-subtitle2"
            style="margin-top: 0;"
          >{{org.title}}</q-item-label>
        </q-item>
      </div>
      <q-item
        v-for="model in link.modelList"
        class="q-pa-sm history-item"
        :key="model.id"
        :to="{name: `${link.name}Detail`, params: { id: `${Number(model.id)}`}}"
      >
        <q-item-label class="col-auto q-mr-sm items-center category-icon">
          <q-icon
            size="xs"
            class="text-primary"
            :name="link.icon"
          ></q-icon>
        </q-item-label>
        <q-item-label
          class="col-auto text-left text-grey-8 text-subtitle2"
          style="margin-top: 0;"
        >{{model.title}}</q-item-label>
      </q-item>
    </q-card-section>
    <q-card-section class="q-pa-none history-list">
      <div class='q-mb-xs text-subtitle2 text-weight-bold'>{{$t('home.myWorkPlate.title')}}</div>
      <q-item
        v-for="item in mineListCanSee"
        class="q-pa-sm history-item"
        :key="item.name"
        :to="item.to"
      >
        <q-item-label class="col-auto q-mr-sm items-center category-icon">
          <q-icon
            :name="item.icon"
            size="xs"
            class="text-primary"
          ></q-icon>
        </q-item-label>
        <q-item-label
          class="col-auto text-left text-grey-8 text-subtitle2"
          style="margin-top: 0;"
        >{{item.notes}}</q-item-label>
      </q-item>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { format, LocalStorage } from 'quasar'
const { capitalize } = format
export default {
  name: 'HistoryList',
  data () {
    return {
      myself: LocalStorage.getItem('myself')
    }
  },
  computed: {
    ...mapState('home', ['apps', 'tools']),
    ...mapState('organize', ['organizes']),
    recentList () {
      return JSON.parse(LocalStorage.getItem('recent-history/' + LocalStorage.getItem('myself').id))
    },
    mineListCanSee () {
      return _.filter(this.tools, item => item.show && item.name !== 'history')
    },
    appsCanSee () {
      return _.filter(this.apps, ql => ['team', 'productDev', 'project'].includes(ql.name))
    },
    homeOrganize () {
      let setting = _.find(this.settings, { id: 1 }) || {}
      return _.find(this.organizes,
        { id: setting.settings && setting.settings.organizeId }) || {}
    },
    myOrganizeIds () {
      // 处理organizeIds为undefined的情况，为空时默认是直属机构
      // 如果所属机构是左上角设置的公告机构【目前是西安研发中心1.18】，或者是公告机构的父级机构，则筛除
      let ids = (this.myself.organizeIds && this.myself.organizeIds.split(',').map(Number)) ||
        [this.myself.organizeId]
      let exceptIds = (this.homeOrganize.path && this.homeOrganize.path.split(',').map(Number)) || []
      return _.difference(ids, exceptIds)
    },
    myOrganizes () {
      return _.forEach(
        _.cloneDeep(_.filter(this.organizes, item => this.myOrganizeIds.includes(item.id))),
        item2 => { item2.title = item2.shortName || item2.name })
    }
  },
  methods: {
    ...mapActions('organize', ['loadOrganize'])
  },
  mounted () {
    // 处理我的团队/机构、我的项目，我的产品没有modelList的情况
    if (!_.every(this.appsCanSee, item => item.modelList)) {
      let that = this
      let conditions = {
        team: {
          query: [
            { 'Key': 'Members ->\'$.all\'', 'Value': _.toString(this.myself.id), 'Oper': 'search' },
            'and',
            { 'Key': 'Archived', 'Value': 0, 'Oper': 'eq' },
            'and',
            { 'Key': 'IsDelete', 'Value': 0, 'Oper': 'eq' }
          ]
        },
        productDev: {
          query: [
            { 'Key': 'Members ->\'$.all\'', 'Value': _.toString(this.myself.id), 'Oper': 'search' },
            'and',
            { 'Key': 'Archived', 'Value': 0, 'Oper': 'eq' },
            'and',
            { 'Key': 'IsDelete', 'Value': 0, 'Oper': 'eq' },
            'and',
            { 'Key': 'forManagement', 'Value': 1, 'Oper': 'eq' }
          ]
        },
        project: {
          query: [
            { Key: 'Archived', Value: 0, Oper: 'eq' }
          ],
          filter: { Status: 'myFocus' },
          byPage: false
        }
      }
      // 获取我的机构信息
      _.forEach(this.myOrganizeIds, id => {
        that.loadOrganize(id)
      })

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
}
</script>

<style lang='scss' scoped>
.history-list /deep/ .q-item {
  min-height: auto;
}
// .history-title {
//   // display: inline-block;
//   // max-width: 65%;
//   // vertical-align: middle;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
// }
// .history-category {
//   // display: inline-block;
//   vertical-align: middle;
// }
.history-item:last-child {
  margin-bottom: 14px;
}
.history-list:last-child .history-item:last-child {
  margin-bottom: 0;
}
</style>
