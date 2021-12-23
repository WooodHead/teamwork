<template>
  <q-page>
    <q-card
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page"
    >
      <!-- 头部 -->
      <tw-header-card
        :title="listType === 'my'? '我的明细':'所有明细'"
        :actions="actions"
      >
        <!-- 选择导入文件 -->
        <template #add>
          <div class="q-gutter-sm">
            <q-btn
              rounded
              unelevated
              label="整机"
              color="positive"
              icon="add"
              @click="importMaterial(1)"
            />
            <q-btn
              rounded
              unelevated
              label="组部件"
              color="positive"
              icon="add"
              @click="importMaterial(2)"
            />
          </div>
        </template>
        <!-- 明细对比 -->
        <template #right>
          <q-btn
            icon="graphic_eq"
            color="primary"
            rounded
            unelevated
            :label="$t('material.materialPK')"
            @click="gotoMatPK"
          />
        </template>
        <template #menu>
          <tw-menu
            :menus="menus"
            @showcards="setListStyle('showcards')"
            @showlist="setListStyle('showlist')"
            @showtable="setListStyle('showtable')"
            @showAllFiles="gotoMatFiles"
          />
        </template>
        <template #titleAppend>
          <q-btn
            icon="arrow_drop_down"
            flat
            dense
          >
            <q-menu
              auto-close
              anchor="bottom right"
              self="top right"
            >
              <q-list class="my-status-card">
                <q-item
                  clickable
                  v-close-popup
                  @click="setListType('my')"
                  color="primary"
                >
                  <q-item-section>
                    <q-item-label>我的明细</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="setListType('all')"
                  color="primary"
                >
                  <q-item-section>
                    <q-item-label>所有明细</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </template>
      </tw-header-card>
      <!-- 主页内容 -->
      <mat-main-grid
        class="q-px-xl"
        :selectType="selectType"
      />
    </q-card>
  </q-page>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Home',
  data () {
    return {
      search: '',
      selectType: 'showcards',
      actions: ['select', 'add', 'menu', 'other'],
      menus: ['showcards', 'showlist', 'showtable', { group: ['showAllFiles'] }]
    }
  },
  computed: {
    ...mapState('material', ['listType'])
  },
  methods: {
    ...mapMutations('material', ['updateImportType', 'setListType']),
    // 导入明细Excel
    importMaterial (val) {
      this.updateImportType(val)
      this.$router.push({
        name: 'importMaterial'
      })
    },
    // 进入所有文件界面
    gotoMatFiles () {
      this.$router.push({
        name: 'MaterialFiles'
      })
    },
    // 进入物料对比界面
    gotoMatPK () {
      this.$router.push({
        name: 'MaterialPK'
      })
    },
    setListStyle (val) {
      this.selectType = val
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwMenu: () => import('components/base/TwMenu'),
    MatMainGrid: () => import('components/material/MatMainGrid')
  }
}
</script>

<style lang="scss" scoped>
</style>
