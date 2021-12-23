<!-- 资源类型工具包设置卡片 -->
<template>
  <widget-layout
    :category="categoryName"
    :id="model.order"
    :widget="model.value"
    :isEmpty="true"
    :cardClick="false"
  >
    <!-- header -->
    <template slot="header">
      <div style="position:relative;">
        <slot name="moveBtn"></slot>
        <div>
          <span class="dot-line">{{model.label}}</span>
          <q-popup-edit
            buttons
            v-model="model.label"
            @save="updateWidget(model)"
          >
            <q-input
              v-model="model.label"
              dense
              autofocus
              counter
            />
          </q-popup-edit>
        </div>
        <!-- 删除按钮 -->
        <q-btn
          dense
          flat
          rounded
          icon="clear"
          color="grey-5"
          class="widget-remove-btn"
          :title="$t('settings.widget.removeWidget',{name:model.label})"
          @click="removeWidget(model)"
        />
      </div>
    </template>
    <!-- check -->
    <template slot="check">
      <div class="column items-center">
        <q-btn
          round
          :size="$q.platform.is.mobile ? '10px' : '20px'"
          title="点击修改图标"
          :icon="model.icon"
          :color="model.color"
          @click="updateWidget(model)"
        />
        <div>
          <q-toggle
            left-label
            color="blue"
            :label="model.default ? '默认' : '非默认'"
            v-model="model.default"
            @input="updateWidget(model)"
          />
        </div>
      </div>
    </template>
    <!-- notes -->
    <template slot="notes">
      <div :title="model.notes">
        <div
          class="dot-line"
          v-html="model.notes"
          :style="$q.platform.is.mobile ? 'font-size: 0.75rem;' : 'font-size: 1rem;'"
        ></div>
        <q-popup-edit
          buttons
          v-model="model.notes"
          @save="updateWidget(model)"
        >
          <q-input
            counter
            autofocus
            type="textarea"
            v-model="model.notes"
            @keyup.enter.stop
          />
        </q-popup-edit>
      </div>
    </template>
  </widget-layout>
</template>

<script>
export default {
  name: 'WidgetSettingCard',
  props: {
    widget: {
      type: Object,
      required: true
    },
    categoryName: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      model: null
    }
  },
  components: {
    WidgetLayout: () => import('layouts/WidgetLayout')
  },
  methods: {
    updateWidget (widget) {
      this.$emit('update', widget)
    },
    removeWidget (widget) {
      this.$emit('remove', widget)
    }
  },
  created () {
    this.model = Object.assign({}, this.widget)
  }
}

</script>

<style lang='scss' scoped>
.widget-remove-btn {
  position: absolute;
  top: -7px;
  right: -10px;
}
</style>
