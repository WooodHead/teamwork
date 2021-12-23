<template>
  <div>
    <!-- 附件列表 -->
    <q-list v-if="groupAccessory.length>0">
      <div
        v-for="item in groupAccessory"
        :key="item.id"
      >
        <q-item-label
          header
          class="q-pb-none"
        >{{item.label}}</q-item-label>

        <q-separator
          spaced
          inset
        />

        <q-item
          v-for="acc in item.children"
          :key="acc.id"
          clickable
        >
          <!-- <q-item-section
            v-if="showAddConfig&&!acc.standard"
            side
          >
            <q-icon
              :id="`accessory_add_${acc.id}`"
              :name="checkAccessoryIds.includes(acc.id)?'remove_circle':'add_circle'"
              color="primary"
              @click.stop="addMyProductConfig(acc.id)"
            />
            <q-tooltip :offset="[10, 10]">
              {{checkAccessoryIds.includes(acc.id)?$t('product.popConfig'):$t('product.addConfig')}}
            </q-tooltip>
          </q-item-section> -->

          <!-- <q-item-section
            v-if="showRemoveConfig&&!acc.standard"
            side
          >
            <q-icon
              :id="`accessory_remove_${acc.id}`"
              name="remove_circle"
              color="primary"
              @click.stop="removeMyProductConfig(acc.id)"
            />
            <q-tooltip :offset="[10, 10]">
              {{$t('product.popConfig')}}
            </q-tooltip>
          </q-item-section> -->

          <q-item-section avatar>
            <q-avatar rounded>
              <img :src="getUrl(acc.imgUrl)">
            </q-avatar>
          </q-item-section>

          <q-item-section @click="onDetail(acc)">
            <q-item-label>
              <span class="key">{{acc.title}}({{acc.specModel!==''?acc.specModel:'-'}})</span>

              <template v-if="id>0">
                <q-badge
                  :color="acc.standard||0?'secondary':'positive'"
                  class="q-mx-xs"
                >
                  {{ $t(`product.fields.configType${acc.standard||0}`) }}
                </q-badge>

                <q-badge
                  v-if="acc.recommend"
                  color="accent"
                >{{$t('product.recommend')}}</q-badge>
              </template>

              <span
                v-if="objectsPK!==null"
                class="absolute-right q-mr-md"
              >
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
            <q-item-label
              caption
              lines="2"
            >
              {{accessoryKeyTechParams(acc)}}
            </q-item-label>
          </q-item-section>

          <q-item-section
            v-if="canSeeRecommend"
            side
          >
            <div class="q-gutter-xs">
              <q-btn
                flat
                dense
                round
                icon="lock_outline"
                :color="acc.standard?'secondary':'grey-5'"
                @click.stop="toggleStandard(acc)"
              >
                <q-tooltip>
                  {{acc.standard?$t('product.cancelStandard'):$t('product.setStandard')}}
                </q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                icon="flag"
                :color="acc.recommend?'secondary':'grey-5'"
                @click.stop="toggleRecommend(acc)"
              >
                <q-tooltip>
                  {{acc.recommend?$t('product.cancelRecommend'):$t('product.setRecommend')}}
                </q-tooltip>
              </q-btn>
            </div>

          </q-item-section>
        </q-item>

        <!-- <q-separator
            spaced
            inset
          /> -->
      </div>

      <div
        v-if="showSaveConfig"
        class="q-pa-md"
      >
        <q-btn
          icon="save"
          color="primary"
          :label="$t('product.toolbarBtns.saveConfig')"
          class="full-width"
          @click="saveMyConfig"
        />
      </div>
    </q-list>

    <tw-banner-no-result
      v-else
      :info="$t('product.noConfigListNotes')"
      class="q-mt-sm q-mx-md"
    />

    <q-dialog v-model="showDetail">
      <q-card style="max-width:80vw;min-width:60vw;">
        <product-dialog-close-btn
          v-if="$q.screen.lt.sm"
          :callBack="()=>{showDetail=false}"
        />
        <q-card-section class="q-pa-none">
          <q-img :src="getUrl(accDetail.imgUrl)" />
          <brief
            showDetailBtn
            :product="accDetail"
          />
          <!-- <product-tech-params :techParamsFlat="techParamsFlat" /> -->
        </q-card-section>
      </q-card>
    </q-dialog>

    <product-select-panel
      :arrClassification="['spindle', 'toolmagazine', 'accessory','automation','software']"
      :panelTitle="$t('product.accessoryConfig')"
      :id="id"
      :tickedIds="accessoryIds"
      ref="productSelectPanel"
    />

    <!-- ball animation -->
    <tw-add-to-cart-animation
      :originId="originId"
      :targetId="targetId"
      :offsetTop="100"
      ref="myAddToCartAnimation"
    />

    <!-- 配置单名称 -->
    <q-dialog
      v-model="prompt"
      persistent
    >
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{$t('product.selection.configListName')}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="title"
            autofocus
            @keyup.enter="prompt=false"
          />
        </q-card-section>

        <q-card-actions
          align="right"
          class="text-primary"
        >
          <q-btn
            flat
            :label="$t('action.cancel')"
            v-close-popup
          />
          <q-btn
            flat
            :label="$t('action.save')"
            v-close-popup
            @click="saveSelection"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { getUrl } from '@/boot/file'
export default {
  name: 'MachinetoolConfigList',
  components: {
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    ProductDialogCloseBtn: () => import('components/product/ProductDialogCloseBtn'),
    Brief: () => import('components/product/template/Brief'),
    // ProductTechParams: () => import('components/product/ProductTechParams'),
    ProductSelectPanel: () => import('components/product/ProductSelectPanel'),
    TwAddToCartAnimation: () => import('components/base/TwAddToCartAnimation')
  },
  props: {
    id: { type: Number, default: 0, desc: '机床id' },
    accessoryIds: { type: Array, default: () => [], desc: '附件ids' },
    objectsPK: { type: Array, default: () => [], desc: 'PK的附件列表对象' },
    showRecommend: { type: Boolean, default: false, desc: '是否展示首推按钮' },
    showAddConfig: { type: Boolean, default: false, desc: '是否展示加入配置单按钮' },
    showRemoveConfig: { type: Boolean, default: false, desc: '是否展示移除配置单按钮' },
    showSaveConfig: { type: Boolean, default: false, desc: '是否展示保存配置单按钮' },
    targetId: { type: String, desc: '加入配置动画目标元素id' }
  },
  data () {
    return {
      groupNameObj: {
        Spindle: '电主轴',
        ToolMagazine: '刀库'
      },
      showDetail: false,
      accDetail: {},
      techParamsFlat: [],
      originId: '',
      prompt: false,
      title: ''
    }
  },
  watch: {
    accessoryIds (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.init(newVal)
      }
    },
    pAccessoryIds (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.init(newVal)
      }
    }
  },
  computed: {
    ...mapState('product', ['products', 'checkAccessoryIds', 'arrTplCode']),
    ...mapState('productSelection', ['processJson']),
    ...mapGetters('product', ['productKeyTechParamsFlat', 'productTechParamsFlat', 'productAccessoryRelations']),
    ...mapGetters('productSelection', ['productSelection']),
    relations () {
      return this.productAccessoryRelations(this.id)
    },
    canSeeRecommend () {
      return this.showRecommend && this.$myinfo.auth.role.isProductManager
    },
    lstAccessory () {
      return _.filter(this.products, p => this.accessoryIds.includes(p.id))
    },
    groupAccessory () {
      let that = this
      let resGroup = []
      let cloneLstAccessory = _.cloneDeep(this.lstAccessory)

      // 如果显示首推，添加首推响应式属性
      that.id > 0 && _.forEach(cloneLstAccessory, a => {
        let curRelation = _.find(that.relations, { selectId: a.id })
        that.$set(a, 'recommend', curRelation.extra.recommend ? 1 : 0)
        that.$set(a, 'standard', curRelation.extra.standard ? 1 : 0)
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
      let arrConfigTplCode = _.sortBy(_.uniq(_.map(cloneLstAccessory, a => { return a.params.TplCode })),
        tplCode => this.arrTplCode.findIndex(k => k === tplCode))

      // 分组组装
      _.forEach(arrConfigTplCode, tplCode => {
        let label = null, tplCodeAccessorys = null

        if (['Spindle', 'ToolMagazine'].includes(tplCode)) {
          label = that.groupNameObj[tplCode]
        } else {
          let p = _.find(that.products, p => p.tplCode === tplCode)
          label = (p && p.title) || ''
        }

        tplCodeAccessorys = _.filter(cloneLstAccessory, a => a.params.TplCode === tplCode)
        tplCodeAccessorys = _.orderBy(tplCodeAccessorys, ['recommend'], ['desc'])

        resGroup.push({
          id: tplCode,
          label: label,
          children: tplCodeAccessorys
        })
      })

      return resGroup
    },
    pAccessoryIds () {
      return _.map(this.lstAccessory, 'parentId')
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
    ...mapMutations('product', ['setCheckAccessoryIds']),
    ...mapActions('product', ['loadProducts']),
    ...mapActions('productSelection', ['addproductSelection', 'updateproductSelection']),
    ...mapActions('resource', ['updateRelation']),
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
      return Object.keys(p.params).length > 0 ? this.productKeyTechParamsFlat(p) : ''
    },
    onDetail (accessory) {
      // open a dialog
      this.accDetail = accessory
      this.techParamsFlat = this.productTechParamsFlat(accessory)
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
          let oldRelation = _.find(this.relations, { selectId: oldProductRecommend.id })
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

      // 如果是选配切换到标配，把标配加入到选型配置中
      if (curRelation.extra.standard === 1 &&
        this.id > 0 && !this.checkAccessoryIds.includes(p.id)) {
        this.setCheckAccessoryIds([...this.checkAccessoryIds, p.id])
      }
    },
    addMyProductConfig (curAccessoryId) {
      if (this.checkAccessoryIds.includes(curAccessoryId)) {
        this.$emit('popConfig', curAccessoryId)
      } else {
        this.originId = `accessory_add_${curAccessoryId}`
        this.$refs.myAddToCartAnimation.startAnimation()
        this.$emit('addConfig', curAccessoryId)
      }
    },
    removeMyProductConfig (curAccessoryId) {
      this.$emit('popConfig', curAccessoryId)
    },
    saveMyConfig () {
      // 保存配置单
      let curSelectionId = +this.$route.params.selectionId
      if (curSelectionId > 0) {
        this.title = this.productSelection(curSelectionId).title
      }
      this.prompt = true
    },
    saveSelection () {
      let that = this
      let tempSelectionModel = {
        title: this.title,
        processJson: this.processJson,
        selectionJson: {
          machinetoolId: +this.$route.params.id,
          accessoryIds: this.checkAccessoryIds
        }
      }
      let curAccessoryId = +this.$route.params.selectionId
      if (curAccessoryId > 0) {
        // 编辑
        let curSelectionModel = this.productSelection(curAccessoryId)
        Object.assign(curSelectionModel, tempSelectionModel)
        this.updateproductSelection(curSelectionModel).then(res => {
          that.$router.push({ name: 'productSelectionDetail', params: { id: res.id } })
        })
      } else {
        // 新建
        this.addproductSelection(tempSelectionModel).then(res => {
          that.$router.push({ name: 'productSelectionDetail', params: { id: res.id } })
        })
      }
    }
  },
  created () {
    this.init(this.accessoryIds)
  }
}
</script>

<style lang="scss" scoped>
// .key {
//   font-size: 1rem;
//   font-weight: 400;
//   flex: 0 0 auto;
// }
</style>
