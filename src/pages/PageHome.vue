<template>
  <q-page
    style="padding: 0px 0px;"
    :class="{'items-center':!$q.screen.lt.sm}"
  >
    <q-card
      :bordered="false"
      flat
      class="card-grow-in-page bg-primary6"
    >
      <!-- <tw-header
        v-if="$q.platform.is.mobile"
        :title="title"
        noBack
      >
        <template #menu>
          <tw-menu
            :menus="['setHomeLayout']"
            @setHomeLayout="setHomeLayout"
          >
          </tw-menu>
        </template>
      </tw-header> -->
      <!-- 设置工作区 -->
      <q-dialog
        v-model="isShow"
        style="margin-right:0;"
      >
        <q-card
          style="max-width:320px; min-width: 300px;"
          class="q-pa-md workspace-setting"
        >
          <q-card-section class="q-pa-none text-center">
            <q-banner
              dense
              class="text-grey-5 q-pa-none text-left draggable-tip"
            >
              • {{$t(`home.setWorkSpace.draggableTip`)}}
            </q-banner>
            <q-list class="text-left">
              <draggable
                v-model="quickLinksListOfSetting"
                handle=".mover"
                v-bind="dragOptions"
                @start="onStart"
                @end="onEnd"
              >
                <transition-group>
                  <q-item
                    v-for="link in quickLinksListOfSetting"
                    :key="link.name"
                    class="q-px-none"
                  >
                    <q-item-section
                      class="col-auto mover"
                      style="cursor: move"
                    >
                      <q-icon
                        name="menu"
                        size="sm"
                        color="grey-4"
                      ></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-bold">{{link.title}}</q-item-label>
                    </q-item-section>
                    <q-item-section class="col-auto">
                      <q-toggle
                        v-model="toggleQuickLinks"
                        :val="link.name"
                        left-label
                        dense
                      />
                    </q-item-section>
                  </q-item>
                </transition-group>
              </draggable>
            </q-list>
            <q-btn
              dense
              color="primary"
              :label="$t(`label.ok`)"
              class="q-px-md q-mt-md"
              @click="onSubmit"
            ></q-btn>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-card-section v-if="!$q.platform.is.mobile">
        <div class="my-fixed-top-right">
          <!-- 设置工作区 -->
          <home-layout-settings @done="reload" />
        </div>
      </q-card-section>
      <q-card-section :class="{'q-px-none':$q.platform.is.mobile}">
        <div class="row q-col-gutter-sm q-pb-sm">
          <!-- 我的应用 -->
          <div
            class="col-12"
            v-if="$q.platform.is.desktop"
          >
            <my-apps />
          </div>
          <!-- 公告板 -->
          <div class="col-12 col-sm-6">
            <div v-show="companyReady">
              <company
                @hook:mounted="companyMounted"
                :class="{'my-widget-card': !$q.platform.is.mobile}"
              />
            </div>
            <div v-if="!companyReady">
              <card-skeleton />
            </div>
          </div>
          <!-- 我的应用 -->
          <div
            class="col-12"
            v-if="$q.platform.is.mobile"
          >
            <my-apps />
          </div>
          <!-- 我的工具箱 -->
          <div class="col-12 col-sm-6">
            <div v-show="mineReady">
              <my-work-plate
                @hook:mounted="mineMounted"
                :class="{'my-widget-card': !$q.platform.is.mobile}"
              />
            </div>
            <div v-if="!mineReady">
              <card-skeleton />
            </div>
          </div>
        </div>
        <!-- 我的模块 -->
        <my-things />
      </q-card-section>
    </q-card>
    <tw-copyright v-if="!$q.platform.is.mobile" />
  </q-page>
</template>

<script>
import { i18n } from '@/boot/i18n'
import { mapState, mapActions } from 'vuex'
import { LocalStorage } from 'quasar'
import draggable from 'vuedraggable'
import Person from '../store/person/model'
import { showSuccessMessage } from '@/utils/show-message'
export default {
  name: 'PageHome',
  inject: ['reload'],
  components: {
    CardSkeleton: () => import('components/home/CardSkeleton'),
    Company: () => import('components/home/Company'),
    MyWorkPlate: () => import('components/home/MyWorkPlate'),
    MyApps: () => import('components/home/MyApps'),
    MyThings: () => import('components/home/MyThings'),
    HomeLayoutSettings: () => import('layouts/HomeLayoutSettings'),
    TwCopyright: () => import('components/base/TwCopyright'),
    // TwHeader: () => import('components/base/TwHeader'),
    // TwMenu: () => import('components/base/TwMenu'),
    draggable
  },
  data () {
    return {
      companyReady: false,
      mineReady: false,
      myself: LocalStorage.getItem('myself'),
      isShow: false,
      toggleQuickLinks: [], // 用来存储设置工作区开关配置
      sortQuickLinks: [], // 用来存储设置工作区排序配置
      quickLinksList: [], // 设置工作区列表
      title: this.$myinfo.name
    }
  },
  methods: {
    ...mapActions('person', ['updatePersonField']),
    companyMounted () {
      this.companyReady = true
    },
    mineMounted () {
      this.mineReady = true
    },
    setHomeLayout () {
      // 配置工作区
      this.isShow = true
      let setting = this.myself.settings.setWorkSpace
      this.toggleQuickLinks = []
      this.sortQuickLinks = []
      if (setting && setting.quickLinksHowToShow.length) {
        setting.quickLinksHowToShow.forEach(item => {
          this.sortQuickLinks.push(item.name)
          if (item.show) {
            this.toggleQuickLinks.push(item.name)
          }
        })
      } else {
        this.myQuickLinksDefault.forEach(item => {
          this.sortQuickLinks.push(item.name)
          if (item.show) {
            this.toggleQuickLinks.push(item.name)
          }
        })
      }
      this.quickLinksList = []
      this.sortQuickLinks.forEach(item => {
        this.quickLinksList.push({
          name: item,
          title: item === 'team'
            ? i18n.t('home.mine') + i18n.t('organize.title') + ' / ' + i18n.t(`${item}.title`)
            : i18n.t('home.mine') + i18n.t(`${item}.title`)
        })
      })
    },
    // 开始拖拽
    onStart () {
      this.drag = true
    },
    // 结束拖拽
    onEnd () {
      this.drag = false
    },
    // 提交工作区设置的数据
    onSubmit () {
      let setList = []
      this.sortQuickLinks.forEach(item => {
        if (this.toggleQuickLinks.includes(item)) {
          setList.push({
            name: item,
            show: true
          })
        } else {
          setList.push({
            name: item,
            show: false
          })
        }
      })
      this.myself.settings.setWorkSpace = this.myself.settings.setWorkSpace || {}
      this.myself.settings.setWorkSpace.quickLinksHowToShow = setList
      let toPerson = Person.to(this.myself)
      this.updatePersonField({
        id: this.myself.id,
        fieldName: 'settings',
        value: JSON.stringify(toPerson.Settings)
      }).then(res => {
        LocalStorage.set('myself', res)
        showSuccessMessage(i18n.t(`settings.settingSucceed`))
        this.reload()
      })
    }
  },
  computed: {
    ...mapState('home', ['quickLinks']),
    ...mapState('person', ['myQuickLinksDefault']),
    ...mapState('layout', ['footerVisible']),
    // 拖拽时设置工作区列表变化
    quickLinksListOfSetting: {
      get () {
        return this.quickLinksList
      },
      set (newVal) {
        this.sortQuickLinks = []
        newVal.forEach((item, index) => {
          this.sortQuickLinks.push(item.name)
        })
        this.quickLinksList = newVal
      }
    },
    dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.my-fixed-top-right {
  position: fixed;
  right: 0px;
  top: 60px;
  z-index: 1;
  text-align: right;
}
.my-widget-card {
  height: 270px;
  overflow: hidden;
}
.workspace-setting /deep/ .q-item {
  min-height: 2.2rem;
}
.draggable-tip /deep/ .text-body2 {
  font-size: 12px;
}
</style>
