
<template>
  <q-card flat>
    <q-card style="position:sticky;top:0;z-index:999;">
      <q-card-section>
        <tw-search-sort :search.sync="search" />
      </q-card-section>
    </q-card>
    <q-card-section
      v-if="allMatMain.length==0"
      class="text-center text-h6 text-grey-5"
    >
      {{$t("material.noSearchMaterial")}}
    </q-card-section>
    <q-card-section
      v-else
      class="q-pt-none"
    >
      <q-card
        flat
        class="row q-pr-md"
      >
        <q-space />
        <q-radio
          class="col-md-2"
          v-model="bomType"
          left-label
          :label="$t('material.pkType.machinetool')"
          keep-color
          val='machinetool'
          color="primary"
        />
        <q-radio
          class="col-md-2"
          v-model="bomType"
          left-label
          :label="$t('material.pkType.grouppart')"
          keep-color
          val='grouppart'
          color="primary"
        />
        <q-checkbox
          class="col-md-2 offset-md-6"
          v-model="selectAll"
          left-label
          :label="$t('label.selectAll')"
          keep-color
          color="primary"
        />
      </q-card>
      <q-list>
        <q-virtual-scroll :items="searchMatList">
          <template v-slot="{ item, index }">
            <q-item
              clickable
              :key="item.ID"
              exact-active-class=""
              dense
            >
              <q-item-section>
                <q-item-label>
                  {{item.FileName}}
                </q-item-label>
                <q-item-label caption>
                  {{item.AutoFileName}}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-checkbox
                  v-model="modelList"
                  left-label
                  color="primary"
                  :val="item.ID"
                />
              </q-item-section>
            </q-item>
          </template>
        </q-virtual-scroll>
      </q-list>
    </q-card-section>

    <q-card
      v-if="allMatMain.length>0"
      style="position:sticky;bottom:0;z-index:999;"
    >
      <q-card-actions align="right">
        <q-btn
          dense
          outline
          :label="$q.lang.label.cancel"
          color="primary"
          class="q-px-sm"
          v-close-popup
        />
        <q-btn
          dense
          :label="$q.lang.label.ok"
          color="primary"
          class="q-px-sm"
          @click="$emit('multiSelect',{modelList,bomType})"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-card>
</template>

<script>
// import { mapActions } from 'vuex'
export default {
  name: 'SelectMaterial',
  data () {
    return {
      objCategory: { custom: false, name: 'person' },
      selectAll: false,
      resources: [],
      search: '',
      modelList: [],
      bomType: ''
    }
  },
  props: {
    matType: {
      type: String,
      default: 'machinetool',
      description: 'Bom类型'
    },
    selectedList: {
      type: Array,
      default: function () {
        return []
      },
      description: '默认选中值'
    },
    allMatMain: {
      type: Array,
      default: function () {
        return []
      },
      description: '所有物料明细表'
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    searchMatList () {
      let fp = []
      if (this.search) {
        fp = _.filter(this.allMatMain, el => ((el.AutoFileName && el.AutoFileName.includes(this.search) && el.ProductType === this.bomType) || (el.FileName && el.FileName.includes(this.search) && el.ProductType === this.bomType)))
      } else {
        fp = _.filter(this.allMatMain, el => (el.ProductType === this.bomType))
      }
      return fp
    }
  },
  methods: {
    init () {
      this.bomType = this.matType
      this.modelList = _.map(this.selectedList, el => (el.ID))
      let initList = _.filter(this.allMatMain, el => (el.ProductType === this.bomType))
      if (this.selectedList.length === initList.length) {
        this.selectAll = true
      } else {
        this.modelList = _.map(this.selectedList, el => (el.ID))
      }
    }
  },

  components: {
    TwSearchSort: () => import('components/base/TwSearchSort')
  },
  watch: {
    //   全选或取消全选
    selectAll: function (val) {
      if (val) {
        let fp = _.filter(this.allMatMain, el => (el.ProductType === this.bomType))
        this.modelList = _.map(fp, el => (el.ID))
      } else {
        this.modelList = []
      }
    },
    // 切换重置
    bomType (newValue, oldValue) {
      if (oldValue) {
        this.selectAll = false
        this.modelList = []
      }
    }
  }

}
</script>

<style>
</style>
