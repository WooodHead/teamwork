<template>
  <div>
    <q-list :class="{'showMore':showMoreProcess}">
      <div
        v-for="param in techParamsFlat"
        :key="param.label"
      >
        <!-- 参数列表名 -->
        <div v-if="param.isHeader">
          <q-item-label
            header
            class="q-pb-none"
          >{{param.name}}</q-item-label>

          <q-separator
            spaced
            inset
          />
        </div>
        <!-- 参数列表 -->
        <div v-else>
          <q-item dense>
            <q-item-section class="col key">{{param.name}}</q-item-section>
            <q-item-section
              side
              class="col value"
            >
              <template v-if="fromPK">
                <div
                  v-for="item in param.newValue"
                  :key="item.index"
                  :class="`text-${item.color}`"
                  :title="item.title"
                  v-html="item.value"
                >{{item.value}}
                </div>
              </template>
              <template v-else>
                <div v-html="param.value">{{param.value}}</div>
              </template>
            </q-item-section>
          </q-item>

          <!-- <q-separator
            spaced
            inset
          /> -->
        </div>
      </div>
    </q-list>

    <div
      class="row justify-center"
      v-if="showMoreProcess"
      @click="showMoreProcess=false"
    >
      <q-btn
        flat
        color="primary"
        icon-right="keyboard_arrow_down"
        :label="$t('product.more')"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductTechParams',
  props: {
    techParamsFlat: { type: Array, required: true },
    fromPK: { type: Boolean, default: false },
    showMore: { type: Boolean, default: false, desc: '是否展示显示更多' }
  },
  data () {
    return {
      showMoreProcess: this.showMore
    }
  }
}
</script>

<style lang="scss" scoped>
// 左边宽度不定,右边宽度自动填满剩余空间
// 参考：https://www.cnblogs.com/qddyh/p/10463340.html
.key {
  // font-size: 1rem;
  // font-weight: 400;
  flex: 0 0 auto;
}
.value {
  // font-family: none;
  // font-weight: 400;
  color: $dark;
  flex: 1 1 auto;
}
.showMore {
  height: 150px;
  overflow: hidden;
}

// 设置表格边框
/deep/table {
  width: 100%;
  font-size: 0.938em;
  border-collapse: collapse; /*边框会合并为一个单一的边框*/
}

/deep/th {
  text-align: left;
  padding: 0.5em 0.5em;
  font-weight: bold;
  background: #66677c;
  color: #fff;
}

/deep/td {
  padding: 0.5em 0.5em;
  border-bottom: solid 1px #ccc;
}

/deep/table,
/deep/table tr th,
/deep/table tr td {
  border: 1px solid $grey-5;
} /*设置边框的*/
</style>
