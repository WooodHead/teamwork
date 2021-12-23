<!-- 设置工作区组件 -->
<template>
  <q-btn
    flat
    dense
    color="blue-grey"
    icon="settings"
    :label="$t('home.setWorkSpace.setQuickLinks')"
    @click="workspaceList()"
  >
    <q-popup-proxy>
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
    </q-popup-proxy>
  </q-btn>
</template>

<script>
import { i18n } from '@/boot/i18n'
import { mapState, mapActions } from 'vuex'
import { LocalStorage } from 'quasar'
import { showSuccessMessage } from '@/utils/show-message'
import draggable from 'vuedraggable'
import Person from '../store/person/model'

export default {
  name: 'HomeLayoutSettings',
  data () {
    return {
      myself: LocalStorage.getItem('myself'),
      toggleQuickLinks: [], // 用来存储设置工作区开关配置
      sortQuickLinks: [], // 用来存储设置工作区排序配置
      quickLinksList: [] // 设置工作区列表
    }
  },
  computed: {
    ...mapState('person', ['myQuickLinksDefault']),
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
  },
  methods: {
    ...mapActions('person', ['updatePersonField']),
    // 开始拖拽
    onStart () {
      this.drag = true
    },
    // 结束拖拽
    onEnd () {
      this.drag = false
    },
    // 设置工作区列表
    workspaceList () {
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
          title: item === 'team' ? i18n.t('home.mine') + i18n.t('organize.title') + ' / ' + i18n.t(`${item}.title`) : i18n.t('home.mine') + i18n.t(`${item}.title`)
        })
      })
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
        this.$emit('done', res)
      })
    }
  },
  components: {
    draggable
  }
}

</script>

<style lang='scss' scoped>
.workspace-setting /deep/ .q-item {
  min-height: 2.2rem;
}
.draggable-tip /deep/ .text-body2 {
  font-size: 12px;
}
</style>
