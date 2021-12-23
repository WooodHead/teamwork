<template>
  <div>
    <div v-for="item in groupAccessory" :key="item.id">
      <q-item-label header class="q-pb-none">{{ item.label }}</q-item-label>

      <q-separator spaced inset />

      <q-item v-for="acc in item.children" :key="acc.id" clickable>
        <q-item-section avatar>
          <q-avatar rounded>
            <img :src="getUrl(acc.imgUrl)" />
          </q-avatar>
        </q-item-section>

        <q-item-section @click="onDetail(acc)">
          <q-item-label>
            <span class="key"
              >{{ acc.title }}({{
                acc.specModel !== '' ? acc.specModel : '-'
              }})</span
            >

            <q-badge
              :color="acc.standard || 0 ? 'secondary' : 'positive'"
              class="q-mx-xs"
            >
              {{ $t(`product.fields.configType${acc.standard || 0}`) }}
            </q-badge>

            <q-badge v-if="acc.recommend" color="accent">{{
              $t('product.recommend')
            }}</q-badge>

            <span v-if="objectsPK !== null" class="absolute-right q-mr-md">
              <q-avatar
                v-for="titleColor in acc.titleColors"
                :key="`${item.id}${titleColor}`"
                :color="titleColor"
                :title="colorTitles[titleColor]"
                size="0.6rem"
                class="q-ml-xs"
              />
            </span>
          </q-item-label>
          <q-item-label caption lines="2">
            {{ accessoryKeyTechParams(acc) }}
          </q-item-label>
        </q-item-section>

        <q-item-section v-if="canSeeRecommend" side>
          <div class="q-gutter-xs">
            <q-btn
              flat
              dense
              round
              icon="lock_outline"
              :color="acc.standard ? 'secondary' : 'grey-5'"
              @click.stop="toggleStandard(acc)"
            >
              <q-tooltip>
                {{
                  acc.standard
                    ? $t('product.cancelStandard')
                    : $t('product.setStandard')
                }}
              </q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              round
              icon="flag"
              :color="acc.recommend ? 'secondary' : 'grey-5'"
              @click.stop="toggleRecommend(acc)"
            >
              <q-tooltip>
                {{
                  acc.recommend
                    ? $t('product.cancelRecommend')
                    : $t('product.setRecommend')
                }}
              </q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              round
              icon="close"
              color="grey-5"
              @click.stop="$emit('delRelation', acc.id)"
            >
              <q-tooltip>移除</q-tooltip>
            </q-btn>
          </div>
        </q-item-section>
      </q-item>
    </div>

    <q-dialog v-model="showDetail">
      <q-card style="max-width:80vw;min-width:60vw;">
        <product-dialog-close-btn
          v-if="$q.screen.lt.sm"
          :callBack="(showDetail = false)"
        />
        <q-card-section class="q-pa-none">
          <q-img :src="getUrl(accDetail.imgUrl)" />
          <brief showDetailBtn :product="accDetail" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { getUrl } from '@/boot/file'

export default {
  name: 'ProductItemGroupList',

  components: {
    ProductDialogCloseBtn: () =>
      import('components/product/ProductDialogCloseBtn'),
    Brief: () => import('components/product/template/Brief')
  },

  props: {
    items: { type: Array, default: () => [] },
    relations: { type: Array, default: () => [] },
    objectsPK: { type: Array, default: () => [], desc: 'PK的附件列表对象' },
    showRecommend: { type: Boolean, default: false, desc: '是否展示首推按钮' }
  },

  data () {
    return {
      groupNameObj: {
        Spindle: '电主轴',
        ToolMagazine: '刀库'
      },
      showDetail: false,
      accDetail: {}
    }
  },

  watch: {
    pAccessoryIds (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.init(newVal)
      }
    }
  },

  computed: {
    ...mapState('product', ['products', 'arrTplCode']),
    ...mapGetters('product', ['productKeyTechParamsFlat']),

    canSeeRecommend () {
      return this.showRecommend && this.$myinfo.auth.role.isProductManager
    },

    pAccessoryIds () {
      return _.map(this.items, 'parentId')
    },

    groupAccessory () {
      let that = this
      let resGroup = []
      let cloneLstAccessory = _.cloneDeep(this.items)

      // 如果显示首推，添加首推响应式属性
      that.canSeeRecommend &&
        _.forEach(cloneLstAccessory, a => {
          let curRelation = _.find(that.relations, { selectId: a.id })
          if (curRelation) {
            that.$set(a, 'recommend', curRelation.extra && curRelation.extra.recommend ? 1 : 0)
            that.$set(a, 'standard', curRelation.extra && curRelation.extra.standard ? 1 : 0)
          }
        })

      // 如果是来自PK，添加颜色响应式属性
      if (this.objectsPK !== null) {
        _.forEach(cloneLstAccessory, a => {
          // 在附件title后添加产品对应的色块
          let colors = []
          _.forEach(this.objectsPK, (j, index) => {
            if (j.accessoryIds.includes(a.id)) {
              colors.push(j.color)
            }
          })
          that.$set(a, 'titleColors', colors)
        })
      }

      // 找到附件配置的TplCode集合
      let arrConfigTplCode = _.sortBy(
        _.uniq(
          _.map(cloneLstAccessory, a => {
            return a.params.TplCode
          })
        ),
        tplCode => this.arrTplCode.findIndex(k => k === tplCode)
      )

      // 分组组装
      _.forEach(arrConfigTplCode, tplCode => {
        let label = null,
          tplCodeAccessorys = null

        if (['Spindle', 'ToolMagazine'].includes(tplCode)) {
          label = that.groupNameObj[tplCode]
        } else {
          let p = _.find(that.products, p => p.tplCode === tplCode)
          label = (p && p.title) || ''
        }

        tplCodeAccessorys = _.filter(
          cloneLstAccessory,
          a => a.params.TplCode === tplCode
        )
        tplCodeAccessorys = _.orderBy(
          tplCodeAccessorys,
          ['recommend'],
          ['desc']
        )

        resGroup.push({
          id: tplCode,
          label: label,
          children: tplCodeAccessorys
        })
      })

      return resGroup
    },

    colorTitles () {
      let res = {}
      _.forEach(this.objectsPK, obj => {
        res[obj.color] = obj.title
      })
      return res
    }
  },

  methods: {
    ...mapActions('resource', ['updateRelation']),
    ...mapActions('product', ['loadProducts']),
    getUrl,

    init (newIds) {
      let historyIds = _.map(this.products, 'id')
      let diff = _.difference(newIds, historyIds)
      if (diff.length > 0) {
        let query = [{ Key: 'Id', Value: diff.join(','), Oper: 'in' }]
        this.loadProducts({ query })
      }
    },
    accessoryKeyTechParams (p) {
      return Object.keys(p.params).length > 0
        ? this.productKeyTechParamsFlat(p)
        : ''
    },
    onDetail (accessory) {
      // open a dialog
      this.accDetail = accessory
      this.showDetail = true
    },
    toggleRecommend (p) {
      // 添加推荐
      // 如果有旧的推荐，更新旧的产品附件关系
      if (!p.recommend) {
        let oldProductRecommend = _.find(
          _.find(this.groupAccessory, { id: p.params.TplCode }).children,
          { recommend: 1 }
        )
        if (oldProductRecommend && oldProductRecommend.id !== p.id) {
          let oldRelation = _.find(this.relations, {
            selectId: oldProductRecommend.id
          })
          oldRelation.extra.recommend = oldRelation.extra.recommend ? 0 : 1
          this.updateRelation(oldRelation)
        }
      }

      // 更新当前产品附件关系
      let curRelation = _.find(this.relations, { selectId: p.id })
      curRelation.extra.recommend = curRelation.extra.recommend ? 0 : 1
      this.updateRelation(curRelation)
    },
    toggleStandard (p) {
      let curRelation = _.find(this.relations, { selectId: p.id })
      curRelation.extra.standard = curRelation.extra.standard ? 0 : 1
      this.updateRelation(curRelation)
    }
  },

  mounted () {
    this.init(this.pAccessoryIds)
  }
}
</script>

<style lang="scss" scoped></style>
