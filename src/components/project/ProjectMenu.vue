<!--
@Name：组件
@Author：陆欢
@date：2021/08/05
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-list class="q-pt-sm full-width print-hide">
    <!-- 标题 -->
    <tw-header-card
      :title="$t('project.module')"
      v-if="$q.platform.is.mobile"
    >
    </tw-header-card>
    <q-item
      v-for="element in options"
      :key="element.key"
      :active="selectItem===element.key"
      :active-class="activeClass"
      clickable
      v-ripple
      @click="element.click"
    >
      <q-item-section avatar>
        <q-icon
          color="primary"
          :name="element.icon"
        />
      </q-item-section>

      <q-item-section>
        {{element.label}}
        <q-popup-proxy
          :breakpoint="100"
          v-if="element.popup==='AddMenusWithTemplate'"
        >
          <add-menus-with-template
            category="project"
            @addingEvent="addingEvent"
          />
        </q-popup-proxy>
      </q-item-section>
    </q-item>
    <q-separator />
    <q-item>
      <q-item-section>
        <q-item-label>我的项目</q-item-label>
      </q-item-section>
    </q-item>
    <!-- 我的项目列表 -->
    <q-scroll-area
      :thumb-style="thumbStyle"
      style="height: 60vh;"
      id="scroll-area-with-virtual-scroll-1"
    >
      <q-virtual-scroll
        :items="myList"
        scroll-target="#scroll-area-with-virtual-scroll-1 > .scroll"
        :virtual-scroll-item-size="32"
      >
        <template v-slot="{ item  }">
          <q-item
            :key="+item.id"
            :active="selectItem===item.id"
            :active-class="activeClass"
            clickable
            v-ripple
            @click="projectDetail(item)"
          >
            <q-item-section avatar>
              <tw-avatar
                size="sm"
                :id="item.leaderID"
              />
            </q-item-section>
            <q-item-section
              :title="item.title"
              class="ellipsis"
            >
              {{item.title}}
            </q-item-section>
          </q-item>
        </template>
      </q-virtual-scroll>
    </q-scroll-area>
  </q-list>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'ProjectMenu',
  data () {
    return {
      myList: [],
      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#cccccc',
        width: '5px',
        opacity: 0.75
      },
      selectItem: '',
      options: [
        {
          key: 'projectAdd',
          icon: 'add',
          label: '新建项目',
          click: () => { },
          popup: 'AddMenusWithTemplate'
        },
        {
          key: 'projectDashboard',
          icon: 'dashboard',
          label: '项目仪表盘',
          click: () => { this.routerTo('projectDashboard') }
        },
        {
          key: 'projectRank',
          icon: 'golf_course',
          label: '项目排行榜',
          click: () => { this.routerTo('projectRank') }
        },
        {
          key: 'projectList',
          icon: 'view_headline',
          label: '项目列表',
          click: () => { this.routerTo('projectList') }
        }
      ],
      activeClass: 'bg-blue-1 text-primary'
    }
  },
  mounted () {
    // 获取我的项目
    let query = [
      { 'Key': 'Members ->\'$.all\'', 'Value': _.toString(this.$myinfo.id), 'Oper': 'search' },
      'and',
      { 'Key': 'Archived', 'Value': 0, 'Oper': 'eq' },
      'and',
      { 'Key': 'IsTemplate', 'Value': 0, 'Oper': 'eq' }
    ]
    this.loadProjects({ query, byPage: false })
      .then(res => {
        this.myList = res
      })
  },
  methods: {
    ...mapActions('project', ['loadProjects']),
    // 仪表盘、排行榜、项目列表点击事件
    routerTo (name, params) {
      let obj = {}
      obj['name'] = name
      if (params) {
        obj['params'] = params
      }
      this.$router.push(obj)
    },
    // 新增项目点击事件
    addingEvent () {
      this.$router.push({
        name: 'projectAdd'
      })
    },
    // 项目详情页点击事件
    projectDetail (model) {
      this.$router.push({
        name: 'projectDetail',
        params: { id: +model.id }
      })
    },
    // 设置选中
    setSelectedItem () {
      if (['projectList', 'projectDashboard', 'projectRank'].includes(this.$route.name)) {
        this.selectItem = this.$route.name
      } else if (this.$route.name === 'projectDetail') {
        let ids = _.map(this.myList, 'id')
        let nowID = this.$route.params.id
        this.selectItem = ids.includes(nowID) ? +nowID : 'projectList'
      } else if (this.$route.name.toLowerCase().includes('add')) {
        this.selectItem = 'projectAdd'
      }
    }
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        this.setSelectedItem()
      }
    }
  },
  components: {
    AddMenusWithTemplate: () => import('components/template/AddMenusWithTemplate'),
    TwAvatar: () => import('components/base/TwAvatar'),
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  }
}
</script>

<style lang='scss' scoped>
/deep/ .q-item__section--avatar {
  min-width: 30px;
  padding-right: 8px;
}
</style>
