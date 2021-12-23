<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <q-card-section
      class="q-gutter-md"
      :class="{'q-pa-xl':!$q.screen.lt.sm}"
    >
      <!-- 设置 -->
      <q-list>
        <q-item-label header>{{ $t("settings.module") }}</q-item-label>

        <!-- 研发体系设置 -->
        <q-item
          v-if="$custom.hasDevSystemInSettings"
          tag="label"
          v-ripple
          @click="toRoute('devSystem')"
        >
          <q-item-section>
            <q-item-label>
              {{ $t("settings.devSystem.name") }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>
        <!-- 富文本框模板设置 -->
        <q-item
          tag="label"
          v-ripple
          @click="toRoute('editorTemplate')"
        >
          <q-item-section>
            <q-item-label>
              {{ $t("settings.editorTemplate") }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>
        <!-- 标签设置 -->
        <q-item
          tag="label"
          v-ripple
          @click="toRoute('tag')"
        >
          <q-item-section>
            <q-item-label>
              {{ $t("settings.tag") }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>
        <!-- 通讯录设置 -->
        <q-item
          tag="label"
          v-ripple
          @click="toRoute('settingsContacts')"
        >
          <q-item-section>
            <q-item-label>
              {{ $t("settings.contacts") }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator />

      <!-- 设置模块工具包 -->
      <q-list>
        <q-item-label header>{{$t("settings.widget.name")}}</q-item-label>
        <!-- 资源列表 -->
        <q-item
          tag="label"
          v-ripple
          v-for="resource in modules"
          :key="resource.id"
          @click="toSettingResource(resource.name)"
        >
          <q-item-section>
            <q-item-label>
              {{$t('settings.widget.pageTitle', {name: $t(`${resource.name}.module`)})}}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>
      </q-list>
      <q-separator />
      <!-- 默认问题设置 -->
      <q-list>
        <q-item-label header>{{ $t("settings.defaultQuestion.name") }}</q-item-label>
        <!-- 列表项 -->
        <q-item
          tag="label"
          v-ripple
          v-for="resource in modules"
          :key="resource.id"
          @click="toSettingDefaultQuestion(resource.name)"
        >
          <q-item-section>
            <q-item-label>
              <!-- {{ $t("settings.devSystem.name") }} -->
              {{$t('settings.defaultQuestion.pageTitle', {name: $t(`${resource.name}.module`)})}}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>
      </q-list>

      <!-- 仪表盘设置 -->
      <q-list>
        <q-item-label header>{{ $t("settings.dashboard.name") }}</q-item-label>
        <!-- 列表项 -->
        <q-item
          tag="label"
          v-ripple
          v-for="board in dashboards"
          :key="board.id"
          @click="toSettingDashboards(board.name)"
        >
          <q-item-section>
            <q-item-label>
              {{$t('settings.dashboard.pageTitle', {name: $t(`${board.name}.module`)})}}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>
      </q-list>

    </q-card-section>

  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters('settings', ['settings']),
    dashboards () {
      const dashboards = []
      this.$custom.hasJob && dashboards.push({
        id: 1,
        name: 'resume',
        label: '招聘系统'
      })
      dashboards.push(
        {
          id: 2,
          name: 'project',
          label: '项目'
        })
      return dashboards
    },
    modules () {
      const modules = [{
        id: 1,
        name: 'organize',
        label: '组织机构'
      },
      {
        id: 2,
        name: 'team',
        label: '团队'
      },
      {
        id: 3,
        name: 'productDev',
        label: this.$t('productDev.title')
      },
      {
        id: 4,
        name: 'project',
        label: '项目'
      }]
      this.$custom.hasCustomer &&
        modules.push({
          id: 5,
          name: 'customer',
          label: '客户'
        })
      this.$custom.hasOpportunity &&
        modules.push({
          id: 6,
          name: 'opportunity',
          label: '商机'
        })
      this.$custom.hasOrder &&
        modules.push({
          id: 7,
          name: 'order',
          label: '订单'
        })
      this.$custom.hasManufacturer &&
        modules.push({
          id: 8,
          name: 'manufacturer',
          label: '生产单位'
        })
      this.$custom.hasService &&
        modules.push({
          id: 9,
          name: 'service',
          label: '工程中心'
        })
      modules.push({
        id: 10,
        name: 'wiki',
        label: '知识空间'
      })
      return modules
    }
  },
  methods: {
    toRoute (routerName) {
      this.$router.push({
        name: routerName
      })
    },
    toSettingResource (name) {
      this.$router.push({
        name: 'settingsWidget',
        params: {
          category: name
        }
      })
    },
    toSettingDefaultQuestion (name) {
      this.$router.push({
        name: 'settingsDefaultQuestion',
        params: {
          category: name
        }
      })
    },
    toSettingDashboards (name) {
      this.$router.push({
        name: 'dashboard',
        params: {
          category: name
        }
      })
    }
  }
}
</script>
