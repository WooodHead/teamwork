<template>
  <q-card
    class="card-grow-in-page q-pb-lg"
    :style="{ 'position:relative': !$q.screen.lt.sm }"
    :flat="$q.screen.lt.sm"
  >
    <!-- 菜单 -->
    <tw-header-detail
      :title="'推荐码详情'"
      :noMenu="!canOp"
    >
      <template #menu>
        <tw-menu
          :menus="['edit']"
          @edit="codeEdit"
          v-if="canOp"
        />
      </template>
    </tw-header-detail>

    <q-card-section>
      <div class="row justify-center text-h5 q-pb-sm">
        <span>{{ model.code }}</span>
      </div>
      <div class="row q-col-gutter-lg q-px-xxl">
        <div class="col-12 col-sm-6">
          <q-btn-toggle
            v-model="model.type"
            disable
            spread
            no-caps
            unelevated
            toggle-color="primary"
            toggle-text-color="white"
            color="blue-grey-3"
            text-color="white"
            padding="md"
            @click="btnReset()"
            :options="[
              { label: $t('recommendCode.type0'), value: 0 },
              { label: $t('recommendCode.type1'), value: 1 }
            ]"
          />
        </div>

        <div class="col-12 col-sm-6">
          <q-input
            v-if="model.type === 0"
            v-model="model.disabledTime"
            outlined
            disable
            :label="$t('recommendCode.disabledTime')"
            mask="date"
          >
            <template v-slot:append>
              <q-icon
                v-if="model.type === 0"
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    :value="model.disabledTime"
                    @input="disabledTimeInput($event)"
                    minimal
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            v-else
            outlined
            v-model="num"
            type="Number"
            disable
            :label="$t('recommendCode.useNumber')"
          />
        </div>

        <div class="col-12 col-sm-6">
          <q-input
            outlined
            disable
            v-model="model.owner"
            :label="$t('recommendCode.owner')"
          />
        </div>

        <div class="col-12 col-sm-6">
          <q-input
            outlined
            disable
            v-model="model.ownerTel"
            :label="$t('recommendCode.ownerTel')"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            outlined
            disable
            v-model="model.recommendType"
            :label="$t('recommendCode.recommendType')"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { LocalStorage } from 'quasar'
import RecommendCode from '@/store/recommend-code/model'
export default {
  name: 'recommendCodeDetail',
  props: {
    id: {
      type: [Number, String],
      default: 0,
      required: false
    }
  },
  data () {
    return {
      model: new RecommendCode(),
      num: 1 // 生成个数
    }
  },
  computed: {
    // HR、系统管理员具有操作权限
    canOp () {
      return !!(
        _.find(LocalStorage.getItem('myself').roles, {
          code: 'HRSpecialist'
        }) ||
        _.find(LocalStorage.getItem('myself').roles, {
          code: 'SystemAdministrator'
        })
      )
    }
  },
  mounted () {
    this.loadRecommendCode(this.id).then(res => {
      this.model = _.cloneDeep(res)
    })
    this.init()
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        this.init()
      }
    }
  },
  components: {
    TwMenu: () => import('components/base/TwMenu'),
    TwHeaderDetail: () => import('components/base/TwHeaderDetail')
  },
  methods: {
    ...mapActions('recommendCode', ['loadRecommendCode']),
    ...mapMutations('breadcrumbs', [
      'pushModuleBreadcrumb',
      'pushWidgetBreadcrumb',
      'clearBreadcrumbs'
    ]),
    // 打开编辑表单
    codeEdit () {
      this.$router.push({
        name: 'recommendCodeEdit',
        params: {
          id: this.model.id
        }
      })
    },
    init () {
      this.initBreadcrumb()
    },
    // 面包屑处理
    initBreadcrumb () {
      this.clearBreadcrumbs()
      this.pushModuleBreadcrumb({
        id: `jobHome`,
        title: this.$t('job.jobHome'),
        to: {
          name: 'jobHome'
        }
      })
      this.pushWidgetBreadcrumb({
        id: `recommendCode`,
        title: this.$t('recommendCode.module'),
        to: {
          name: 'recommendCode'
        }
      })
    }
  }
}
</script>

<style scoped></style>
