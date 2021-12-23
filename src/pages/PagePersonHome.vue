<template>
  <q-page>
    <q-card
      class="card-grow-in-page"
      :flat="$q.screen.lt.sm"
    >
      <div class="glossy-315">

        <tw-header :noMenu="menuList.length===0">
          <template #menu>
            <tw-menu
              :menus="menuList"
              @edit="editPerson"
              @setWidgets="setWidgets"
              @delete="delPerson"
            />
          </template>
        </tw-header>
        <q-card-section class="q-px-xl">
          <div class="row items-center justify-center">
            <div
              class="col-xs-12 col-sm-6 text-center"
              :class="{'q-pb-md':!$q.screen.gt.xs}"
            >
              <tw-avatar
                size="120px"
                font-size="2rem"
                :id="id"
                class="no-pointer-events shadow-5"
              />
              <div class="text-grey text-center ellipsis-3-lines q-px-md q-mt-md">
                {{ person.description }}
              </div>
            </div>
            <div class="col-xs-12 col-sm-6">

              <q-list class="tw-list text-right">
                <q-item-label
                  header
                  class="text-h5"
                  :class="$q.screen.gt.xs?'text-left':'text-center'"
                >
                  {{ person.name}}
                  <q-icon
                    name="person"
                    :color="person.sex === '女'?'purple-4':'indigo-4'"
                    :size="lg"
                    :title="person.sex"
                  />
                </q-item-label>
                <q-item>
                  <q-item-section
                    side
                    class="text-grey-9"
                  >{{$t('auth.fields.jobNumber')}}</q-item-section>
                  <q-item-section class="text-grey">{{ person.jobNumber }}</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section
                    side
                    class="text-grey-9"
                  >职位</q-item-section>
                  <q-item-section class="text-grey">{{ person.dutyName }}</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section
                    side
                    class="text-grey-9"
                  >机构</q-item-section>
                  <q-item-section class="text-grey">{{ person.organizeName }}</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  tag="a"
                  :href="'tel:'+person.phone"
                >
                  <q-item-section
                    side
                    class="text-grey-9"
                  >电话</q-item-section>
                  <q-item-section class="text-grey">{{ person.phone }}</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  tag="a"
                  :href="'mailto:'+person.email"
                >
                  <q-item-section
                    side
                    class="text-grey-9"
                  >邮箱</q-item-section>
                  <q-item-section class="text-grey">{{ person.email }}</q-item-section>
                </q-item>

              </q-list>
            </div>
          </div>
          <template v-if="$custom.hsaPersonMoreInfo">
            <div
              class="row text-right"
              v-if="showPersonMore"
            >
              <div class="col-xs-12 col-sm-6">
                <q-separator
                  spaced
                  inset
                  color="blue-grey-3"
                />
                <q-list class="tw-list">
                  <q-item>
                    <q-item-section
                      side
                      class="text-grey-9"
                    >座机</q-item-section>
                    <q-item-section class="text-grey">{{ person.tel }}</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section
                      side
                      class="text-grey-9"
                    >生日</q-item-section>
                    <q-item-section class="text-grey">{{ person.birthday }}</q-item-section>
                  </q-item>
                </q-list>
              </div>
              <div class="col-xs-12 col-sm-6">
                <q-separator
                  spaced
                  inset
                  color="blue-grey-3"
                />
                <q-list class="tw-list">
                  <q-item>
                    <q-item-section
                      side
                      class="text-grey-9"
                    >入职时间</q-item-section>
                    <q-item-section class="text-grey">{{ person.entryoffice }}</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section
                      side
                      class="text-grey-9"
                    >离职时间</q-item-section>
                    <q-item-section class="text-grey">{{ person.leaveoffice }}</q-item-section>
                  </q-item>
                </q-list>
              </div>
              <q-item>
                <q-item-section
                  side
                  class="text-grey-9"
                >住址</q-item-section>
                <q-item-section class="text-grey">{{ person.address }}</q-item-section>
              </q-item>
            </div>
            <q-btn
              flat
              :icon="showPersonMore?'expand_less':'expand_more'"
              color="blue-grey-3"
              class="full-width"
              @click="showPersonMore=!showPersonMore"
            >{{showPersonMore?'收起更多':'展开更多'}}
            </q-btn>
          </template>
        </q-card-section>
      </div>
      <q-card-section>
        <widget-kit
          category="person"
          :objectID="Number(id)"
          :model="person"
          class="row q-gutter-md justify-center"
        />
      </q-card-section>
      <q-card-section class="q-px-xxl">
        <tw-person-activity :id="+id" />
      </q-card-section>
    </q-card>
    <router-view />
  </q-page>
</template>

<script>
import allWidgets from '@/components/widget/index'
import { mapActions } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
import { showWarningMessage, showSuccessMessage } from '@/utils/show-message'
export default {
  name: 'PagePersonHome',
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      person: {},
      color: 'deep-purple',
      allWidgets: allWidgets,
      showPersonMore: false,
      menuList: (this.$myinfo.auth.role.isSystemAdministrator || this.$myinfo.auth.role.isHRSpecialist) ? ['edit', 'setWidgets', 'delete'] : []
    }
  },
  created () {
    this.loadPerson(Number(this.id)).then((p) => {
      this.person = p
    })
  },
  methods: {
    ...mapActions('person', ['loadPerson', 'deletePersons']),
    editPerson () {
      // 打开维护用户信息弹框
      this.$router.push({
        name: 'personEdit',
        params: { id: this.person.id }
      })
    },
    setWidgets () {
      var that = this
      this.$router.push({
        name: 'widgetSetting',
        params: { objectID: Number(that.person.id), category: 'person' }
      })
    },
    delPerson () {
      var that = this
      // 弹出删除弹框
      showConfirm('确定要删除该人员吗?', () => {
        that.deletePersons(that.person.id).then(res => {
          if (res) {
            showSuccessMessage('删除成功')
          } else {
            showWarningMessage(i18n.t(`app.error.oopsSomethingWentWrong`))
          }
        })
      })
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    TwPersonActivity: () => import('components/activity/TwPersonActivity'),
    WidgetKit: () => import('components/widget/WidgetKit'),
    TwMenu: () => import('components/base/TwMenu'),
    TwHeader: () => import('components/base/TwHeader')
  }
}
</script>

<style lang="sass" scoped>
.tw-list .q-item
  min-height: 30px
  min-width: 230px
.glossy-315
  background-image: linear-gradient(315deg, rgba(#fff, .3), rgba(#fff, 0) 50%, rgba(#000, .12) 100%, rgba(#000, .04)) !important
</style>
