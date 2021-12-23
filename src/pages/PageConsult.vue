<template>
  <q-page>
    <tw-breadcrumbs />
    <q-card
      v-if="inHome"
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page"
    >
      <!-- 标题 -->
      <tw-header-card
        :title="$t('consult.module')"
        :actions="['add', 'select']"
        :select="selectedStatus"
        :selectOptions="options"
        @update:select="selectedStatusUpdate"
      >
        <template v-slot:add>
          <div>
            <q-chip
              ripple
              icon="app:tw-icon-consult"
              :label="$t('consult.add')"
              class="cursor-pointer q-px-md"
              color="positive"
              text-color="white"
              style="height:2.5rem;border-radius: 2.3rem;"
            >
              <q-menu auto-close>
                <q-list>
                  <q-item
                    clickable
                    v-close-popup
                    v-for="item in setAddSelect"
                    :key="item.key"
                    @click="select(item.key)"
                    color="primary"
                  >
                    <q-item-section avatar>
                      <q-icon :name="item.icon" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{item.label}}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-chip>
          </div>
        </template>
      </tw-header-card>
      <q-card-section class="q-px-xxl q-pt-none">

        <tw-search-sort :search.sync="newSearch" />
        <consult-list class="q-pt-md" />
      </q-card-section>
    </q-card>
    <router-view />
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import htmlToText from '@/utils/html-to-text'
export default {
  name: 'PageConsult',
  data () {
    return {
      inHome: false,
      setAddSelect: [
        { key: 'item', icon: 'live_help', label: this.$t('consult.addSelect.consultItem') },
        { key: 'transactor', icon: 'account_box', label: this.$t('consult.addSelect.transactor') }
      ]
    }
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwSearchSort: () => import('components/base/TwSearchSort'),
    TwPageScroller: () => import('components/base/TwPageScroller'),
    ConsultList: () => import('components/consult/ConsultList'),
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  },
  computed: {
    ...mapState('consult', ['consultSearch', 'selectedStatus', 'consultStatus']),
    newSearch: {
      get () {
        return this.consultSearch
      },
      set (value) {
        this.searchUpdate(value)
      }
    },
    options () {
      return _.values(_.assign({}, this.consultStatus, { 0: { label: '全部', value: '0' } }))
    }
  },
  methods: {
    ...mapMutations('consult', ['setConsultSearch', 'setPage', 'setSelectedStatus']),
    ...mapActions('consult', ['loadConsult']),
    ...mapMutations('breadcrumbs', ['pushWidgetBreadcrumb', 'clearWidgetBreadcrumbs', 'deleteWidgetBreadcrumb']),
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs']),
    htmlToText,
    select (key) {
      switch (key) {
        case 'item': {
          this.$router.push({ name: 'consultItem' })
          break
        }
        case 'transactor': {
          this.$router.push({ name: 'consultTransactor' })
          break
        }
        default: {
          break
        }
      }
    },
    searchUpdate (value) {
      this.resetList()
      this.setConsultSearch(value)
    },
    selectedStatusUpdate (value) {
      this.resetList()
      this.setSelectedStatus(value)
    },
    resetList () {
      this.setPage({
        offset: 0,
        limit: 20,
        total: 0
      })
    }
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        let newRoute = newVal, oldRoute = oldVal
        this.inHome = newRoute.name === 'consultHome'
        if (this.$q.platform.is.mobile) return
        if (!newVal.path.includes('consult')) return

        this.setModuleBreadcrumbs()
        this.clearWidgetBreadcrumbs()

        // 创建咨询单据界面的面包屑
        if (newRoute.name === 'consultAdd') {
          if (oldRoute && oldRoute.name === 'consultTransactor') {
            // 向谁咨询界面添加
            this.pushWidgetBreadcrumb({
              id: 'consultTransactor',
              title: this.$t('consult.addSelect.transactor'), // 向谁咨询
              to: {
                name: 'consultTransactor'
              }
            })
          } else if (oldRoute && oldRoute.name === 'consultDetail') {
            // 详情页复制
            let oldId = oldRoute.params.id || 0
            if (oldId) {
              let oldConsult = await this.loadConsult(oldId)
              this.pushWidgetBreadcrumb({
                id: 'consultDetail',
                title: htmlToText(oldConsult.content).trim() || oldConsult.code,
                to: {
                  name: 'consultDetail',
                  params: { id: +oldRoute.params.id }
                }
              })
            }
          } else {
            // home界面复制或咨询何事界面添加
            this.pushWidgetBreadcrumb({
              id: 'consultItem',
              title: this.$t('consult.addSelect.consultItem'), // 咨询何事
              to: {
                name: 'consultItem'
              }
            })
          }
        } else {
          this.deleteWidgetBreadcrumb('consultAdd')
        }
      }
    }
  }
}
</script>

<style lang="scss">
</style>
