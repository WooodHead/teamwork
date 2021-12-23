<!--
@Name：移动端头部导航
@Author：陆欢
@date：2021/08/26
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <div>
    <tw-header
      v-if="!moduleTitle"
      :title="title"
      :noMenu="!actions.includes('menu')"
    >
      <template #menu>
        <slot name="menu">
        </slot>
      </template>
      <template #titleAppend>
        <slot name="titleAppend">
        </slot>
      </template>
    </tw-header>
    <div v-else>
      <tw-header
        :title="haveDropDown?'':moduleTitle"
        :noMenu="!actions.includes('menu')"
      >
        <template #menu>
          <slot name="menu">
          </slot>
        </template>
        <template #titleAppend>
          <q-btn
            v-if="haveDropDown"
            no-caps
            flat
            :label="moduleTitle"
            icon-right="arrow_drop_down"
            class="module-dropdown"
          >
            <q-popup-proxy>
              <resource-select-panel 
                v-if="customResources.includes($route.params.category)"
                :category="$route.params.category"
                flat
                @select="switchCustomResource"
                :isVirtualScroll="false"
              />
              <widget-switch v-else class="bg-white" />
            </q-popup-proxy>
          </q-btn>
        </template>
      </tw-header>
      <div class="row justify-center q-pt-sm">
        <span
          class="text-h6"
          v-if="title"
        >{{title}}</span>
        <slot name="titleAppend">
        </slot>
      </div>
    </div>
    <q-card-section
      v-if="intersection(actions,['add','select','other']).length"
      class="row items-center q-gutter-xs q-py-sm"
    >
      <q-space />
      <slot
        name="add"
        v-if="actions.includes('add')"
      >
        <q-btn
          rounded
          unelevated
          color="positive"
          ref="add"
          icon="add"
          :label="add.label"
          @click="add.click"
          no-caps
        />
      </slot>
      <slot
        name="right"
        v-if="intersection(actions,['select','other']).length"
      >
        <q-select
          v-if="actions.includes('select')"
          :value="select"
          @input="$emit('update:select', $event)"
          :options="selectOptions"
          :label="selectLabel"
          dense
          emit-value
          map-options
          options-dense
          outlined
          rounded
        >
          <template v-slot:prepend>
            <q-btn
              v-if="showOrderReverse"
              round
              dense
              flat
              icon="swap_vert"
              @click.stop="$emit('update:order')"
            />
          </template>
        </q-select>
      </slot>
      <q-space />
    </q-card-section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'TwHeaderWithNav',
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    actions: {
      type: Array,
      required: false,
      default: function () {
        return []
      },
      description: 'menu,add,select,other' // other为右侧自定义的动作
    },
    add: {
      type: Object,
      required: false,
      default: function () {
        return {
          label: this.$t('action.add'),
          click: function () {
            this.$q.notify('新建')
          }
        }
      }
    },
    select: {
      type: String,
      required: false,
      default: ''
    },
    selectLabel: {
      type: String,
      required: false,
      default: undefined
    },
    selectOptions: {
      type: Array,
      required: false
    },
    showOrderReverse: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      moduleTitle: ''
    }
  },
  mounted () {
    this.getModuleTitle()
  },
  watch: {
    $route (newVal, oldVal) {
      this.getModuleTitle()
    }
  },
  computed: {
    ...mapState('resource', ['haveWidgets', 'customResources']),
    haveDropDown () {
      const category = this.$route.params.category
      return this.$route.name !== `${category}Detail` &&
        (this.haveWidgets.includes(category) || this.customResources.includes(category))
    }
  },
  methods: {
    intersection: _.intersection,
    getModuleTitle () {
      let { category, objectID } = this.$route.params
      if (category && objectID && this.$route.name !== `${category}Detail`) {
        this.$store.dispatch('resource/loadResourceItem', { objectID: objectID, objectType: category })
          .then(res => {
            if (res) {
              this.moduleTitle = res.title
            }
          })
      }
    },
    switchCustomResource (item) {
      this.$router.push({
        name: 'schedule',
        params: {
          category: item.category,
          objectID: +item.id
        }
      })
    }
  },
  components: {
    TwHeader: () => import('components/base/TwHeader'),
    WidgetSwitch: () => import('components/widget/WidgetSwitch'),
    ResourceSelectPanel: () => import('components/resource/ResourceSelectPanel')
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .module-dropdown .q-btn__content {
    flex-wrap: nowrap;
  }
</style>
