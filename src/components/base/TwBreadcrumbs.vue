<template>
  <q-card
    v-if="!$q.platform.is.mobile"
    v-show="breadcrumbs&&breadcrumbs.length"
    :flat="$q.screen.lt.sm"
    square
    :class="['widget-header-bread q-py-xs q-px-md cursor-pointer',{'border-bottom':$q.screen.lt.sm}]"
    class="print-full-width"
    @click.self="backToPrevious()"
  >
    <div
      v-if="moduleSwitchable"
      class="relative-position"
    >
      <q-btn
        class="absolute-right cursor-pointer"
        title="快捷切换资源"
        round
        flat
        dense
        @click.native.stop="showModuleSwitchPanel"
        size="md"
        icon="view_module"
        :color="switchingResource?'primary':'grey'"
      />
    </div>
    <q-breadcrumbs
      :gutter="elementsGutter"
      :align="breadcrumbsAlign"
      :separator="separator"
      :class="{'text-subtitle1':!$q.screen.lt.sm}"
      @click="backToPrevious()"
    >
      <q-breadcrumbs-el
        v-for="item in breadcrumbs"
        :key="item.id"
        class="q-gutter-xs"
      >
        <q-btn
          v-if="item.switcher"
          title="快捷切换工具"
          round
          flat
          dense
          @click.native.stop="showBreadcrumbSwitchPanel(item)"
          size="0.8rem"
          :icon="item.switcher.icon"
          :color="item.switcher.color||'grey'"
        />
        <tw-avatar
          v-if="item.type==='module' && item.level==='detail' && item.category==='person'"
          :id="item.to.params.id"
          size="md"
        />
        <router-link
          v-if="item.to"
          :to="item.to"
          class="text-primary"
          :class="{'text-weight-bold':item.type==='module'}"
          @click.native.stop="clickLink(item.click)"
        >
          {{htmlToText(item.title)|ellipsisTitle}}
        </router-link>
        <div
          v-else
          class="text-primary"
          :class="{'text-weight-bold':item.type==='module'}"
          @click.stop="switchingResource=!switchingResource"
        >
          {{htmlToText(item.title)|ellipsisTitle}}
        </div>
      </q-breadcrumbs-el>
    </q-breadcrumbs>

    <div v-if="moduleSwitchable">
      <resource-switch
        v-show="switchingResource"
        :category="resourceSwitch.category"
        :widget="resourceSwitch.widget"
        class="q-pb-md"
        @switch="switchMuduleTo"
      />
    </div>
    <widget-switch v-if="switchingWidget" />
  </q-card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import htmlToText from '@/utils/html-to-text'
export default {
  name: 'TwBreadcrumbs',
  data () {
    return {
      resourceSwitch: { category: 'person', widget: 'schedule' },
      switchingResource: false,
      switchingWidget: false
    }
  },
  props: {
    elementsGutter: {
      type: String,
      default: 'sm',
      description: '间距'
    },
    breadcrumbsAlign: {
      type: String,
      default: 'center',
      description: '位置'
    },
    separator: {
      type: String,
      default: '>',
      required: false
    },
    moduleSwitchable: {
      type: Boolean,
      default: false,
      required: false,
      description: '是否可切换业务模块'
    }
  },
  computed: {
    ...mapGetters('breadcrumbs', ['breadcrumbs'])
  },
  filters: {
    ellipsisTitle (value) {
      const showTitleLength = 32
      return value && value.length > showTitleLength ? `${value.slice(0, showTitleLength)}...` : value
    }
  },
  watch: {
    $route (newVal, oldVal) {
      this.switchingResource = false
      this.switchingWidget = false
    }
  },
  mounted () {
    const { category } = this.$route.params,
      routeNames = _.map(this.$route.matched, route => route.name)
    const widgets = _.intersection(['schedule', 'activity'], routeNames)
    if (widgets.length) {
      this.resourceSwitch = {
        category: category || 'person',
        widget: widgets[0]
      }
    }
  },
  methods: {
    ...mapMutations('breadcrumbs', ['initSwitcherIconColor', 'setSwitcherIconColor']),
    htmlToText,
    showModuleSwitchPanel () {
      this.initSwitcherIconColor()
      this.switchingResource = !this.switchingResource
    },
    switchMuduleTo (res) {
      this.switchingResource = false
      this.resourceSwitch.category = res.category.name || 'person'
      this.$emit('switchTo', res)
    },
    showBreadcrumbSwitchPanel (breadcrumb) {
      this.initSwitcherIconColor()
      this.switchingResource = false
      if (breadcrumb.switcher.type === 'widget') {
        this.switchingWidget = !this.switchingWidget
        this.switchingWidget && this.setSwitcherIconColor({ id: breadcrumb.id })
      }
      this.$emit('changeSwitchEvent', this.switchingWidget)
    },
    clickLink (click) {
      _.isFunction(click) && click()
    },
    backToPrevious () {
      const last = _.last(this.breadcrumbs)
      last.click && last.click()
      !last.click && last.to && this.$router.push(last.to)
    }
  },
  components: {
    WidgetSwitch: () => import('components/widget/WidgetSwitch'),
    TwAvatar: () => import('components/base/TwAvatar'),
    ResourceSwitch: () => import('components/resource/ResourceSwitch')
  }
}
</script>

<style scoped lang="scss">
.widget-header-bread {
  width: 72vw;
  border-top-left-radius: 4px !important;
  border-top-right-radius: 4px !important;
}
@media screen and (max-width: $breakpoint-sm-max) {
  .widget-header-bread {
    width: 85vw;
  }
}
@media screen and (max-width: $breakpoint-xs-max) {
  .widget-header-bread {
    width: 100%;
  }
}
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
}
.q-breadcrumbs--last a {
  pointer-events: auto;
}
</style>
