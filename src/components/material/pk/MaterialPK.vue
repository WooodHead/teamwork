<!--  -->
<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
    :style="{'position:relative':!$q.screen.lt.sm}"
  >
    <!-- 标题 -->
    <tw-header-card
      :title="$t('material.materialPK')"
      :actions="actions"
      :add="{label:$t('material.selectMaterial'),click:()=>showPanel=true}"
    >
      <template #right>
        <q-btn
          :disable="!showRusult"
          color="primary"
          rounded
          unelevated
          :label="$t('material.exportData')"
          @click="exportExcel = true"
        />
      </template>
    </tw-header-card>
    <!-- 导出功能 -->
    <q-dialog v-model="exportExcel">
      <material-data-export
        :excelData="rusult"
        :pkList="actualComparison"
      />
    </q-dialog>
    <!-- 弹出列表选择卡片 -->
    <q-dialog
      v-model="showPanel"
      full-height
    >
      <select-material
        style="width: 600px; max-width: 80vw;"
        :allMatMain="allMatMain"
        :matType="bomType"
        :selectedList.sync="comparisonList"
        @multiSelect="multiSelect"
      />
    </q-dialog>
    <!-- 产品PK选择列表 -->
    <div v-if="showSelect">
      <q-card-section
        class="q-px-xxl"
        v-if="comparisonList.length > 0"
      >
        <q-list>
          <q-item
            tag="label"
            dense
            v-ripple
            v-for="(item,index) of comparisonList"
            :key="index"
          >
            <q-item-section
              side
              top
            >
              <q-checkbox
                v-model="item.isCheck"
                keep-color
                left-label
                :val="item.isCheck"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{item.FileName}}</q-item-label>
              <q-item-label caption>{{item.AutoFileName}}</q-item-label>
            </q-item-section>
            <q-item-section
              side
              bottom
            >
              <q-btn
                flat
                round
                icon="clear"
                @click="onDelete(index)"
              />
            </q-item-section>
          </q-item>
        </q-list>
        <q-card-actions align="right">
          <q-btn
            dense
            outline
            :label="$t('material.startPK')"
            color="primary"
            unelevated
            @click="startCompare()"
          />
        </q-card-actions>
      </q-card-section>
      <q-card-section
        v-else
        class="row justify-center text-h6 text-grey-5 q-mt-md"
      >
        {{$t("material.noMaterialPk")}}
      </q-card-section>
    </div>
    <!-- 展开隐藏按钮 -->
    <div class="row justify-center">
      <q-icon
        :name="showSelect?'keyboard_arrow_down':'keyboard_arrow_up'"
        size="md"
        @click="showSelect = !showSelect"
      />
    </div>
    <!-- //pk结果展示区 -->
    <pk-result
      v-if="showRusult"
      :resultData="rusult"
      :pkList="actualComparison"
    >
    </pk-result>
  </q-card>
</template>

<script>
import { LocalStorage } from 'quasar'
import { mapActions } from 'vuex'
import { showWarningMessage } from '@/utils/show-message'
export default {
  name: 'MaterialPK',
  data () {
    return {
      exportExcel: false, // 是否进行导出
      showSelect: true, // 显示选择列表
      showRusult: false, // 显示对比结果
      showPanel: false, // 显示选择面板
      actions: ['add', 'other'],
      allMatMain: [], // 明细导入主表(所有数据)
      comparisonList: [],
      actualComparison: [],
      bomType: 'machinetool',
      rusult: {}
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    SelectMaterial: () => import('components/material/pk/SelectMaterial'),
    PkResult: () => import('components/material/pk/PkResult'),
    MaterialDataExport: () => import('components/material/pk/MaterialDataExport')

  },
  computed: {
  },
  mounted () {
    this.loaderAllMatMain()
  },
  watch: {
    comparisonList () {
      if (this.comparisonList.length <= 0) {
        this.showRusult = false
      }
    }
  },
  methods: {
    ...mapActions('material', ['loadMatMainData', 'getCompareData']),
    loaderAllMatMain () {
      let orgPath = LocalStorage.getItem('myself').organizeNum + '%'
      let condition = [{ Key: 'IsDelete', Value: 0, Oper: 'eq' }]
      condition.push('and', { Key: 'OrganizePath', Value: orgPath, Oper: 'like' })
      const info = { loderType: 'data', byPage: false, query: condition }
      this.loadMatMainData(info).then(res => {
        this.allMatMain = res
      })
    },
    multiSelect (info) {
      this.bomType = info.bomType
      this.comparisonList = []
      let model = {}
      this.allMatMain.forEach(item => {
        if (info.modelList.indexOf(item.ID) > -1) {
          model = { ID: item.ID, isCheck: true, FileName: item.FileName.substring(0, item.FileName.lastIndexOf('.')), AutoFileName: item.AutoFileName }
          this.comparisonList.push(_.clone(model))
        }
      })
      this.showSelect = true
    },
    // 单项删除
    onDelete (val) {
      this.comparisonList.splice(val, 1)
    },
    // 开始对比
    startCompare () {
      this.showSelect = false
      this.actualComparison = _.filter(this.comparisonList, el => (el.isCheck === true))
      if (this.actualComparison.length > 10 || this.actualComparison.length < 2) {
        showWarningMessage(this.$t('material.moreLimit'))
        return false
      } else {
        let bomList = this.comparisonList.map((item) => {
          if (item.isCheck) {
            return { ID: item.ID, FileName: item.FileName }
          }
        })
        this.getCompareData(bomList).then(res => {
          this.rusult = res
          this.showRusult = true
        })
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.tabs {
  position: sticky;
  top: 100px;
  z-index: 9999;
  padding-right: 0px;
}
@media screen and (max-width: 930px) {
  .phone-tabs {
    right: 0px;
    left: auto;
  }
}
.test.q-item__section--main {
  width: auto;
  min-width: 0;
  max-width: 100%;
  flex: 3000 0 0%;
}
.qribbon-avatar [class*="horizontal--right"].decorate-rounded-out {
  border-top-left-radius: 45px;
  border-bottom-left-radius: 45px;
  padding-left: 5px;
}
</style>
