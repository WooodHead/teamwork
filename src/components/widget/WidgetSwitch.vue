<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <!-- 移动端 -->
    <q-list
      v-if="$q.screen.lt.sm"
      style="width:300px"
    >
      <q-item-label
        header
        lines="1"
        class="q-pb-sm relative-position"
      >
        <router-link
          v-ripple
          :to="{ name: `${category}Detail`,params:{id: objectID}}"
          class="q-item__label--header q-pl-none q-py-none block ellipsis cursor-pointer"
          style="text-decoration: none;width: calc(100% - 5px)"
        >
          {{categoryTitle}}
          <q-icon
            v-ripple
            color="grey"
            name="keyboard_arrow_right"
            class="absolute"
            style="right:5px;top: 30%;"
            size="sm"
          />
        </router-link>
      </q-item-label>
      <q-separator spaced />
      <q-item
        clickable
        v-ripple
        v-for="(item) in widgets"
        :key="item.value"
        @click.native.stop="item.click"
      >
        <q-item-section avatar>
          <q-avatar
            :icon="item.icon"
            :color="item.color"
            text-color="white"
          />
        </q-item-section>

        <q-item-section>{{item.label}}</q-item-section>
      </q-item>
    </q-list>
    <div
      v-else
      class="q-pa-sm row q-gutter-sm justify-center text-center"
      style="display: flex;"
    >
      <q-card
        v-for="(item) in widgets"
        :key="item.value"
        class="q-pa-xs cursor-pointer"
        flat
        bordered
        @click.native.stop="item.click"
        style="flex: 1;max-width: 6rem;"
        v-ripple
      >
        <div class="text-subtitle2 text-weight-bold ellipsis">
          {{$t(`${item.value}.title`)}}
        </div>
        <q-btn
          round
          :icon="item.icon"
          :color="item.color"
          :size="!$q.screen.lt.md?'md':'sm'"
        />
      </q-card>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'
import { format } from 'quasar'
const { capitalize } = format
export default {
  name: 'WidgetSwitch',
  data () {
    return {
      widgets: [],
      categoryTitle: '',
      objectID: 0,
      category: ''
    }
  },
  mounted () {
    // 路由参数如果直接获取不到，则默认取前两位
    let { category, objectID } = this.$route.params
    if (category && objectID) {
      let that = this
      this.category = category
      this.objectID = objectID
      const widgets = this.$store.state.widget.widgets
      that.$store.dispatch(`${category}/load${capitalize(category)}`, Number(objectID))
        .then(function (res) {
          that.categoryTitle = res.title
          that.widgets = _.map(_.intersection(_.keys(res.widgets), _.keys(widgets)), wg => {
            const widget = widgets[wg]
            widget.click = function () {
              that.routeWidget({ widget: wg, category, objectID })
            }
            return widget
          })
        })
    }
  },
  methods: {
    ...mapActions('widget', ['routeWidget'])
  }
}
</script>

<style lang="scss" scoped>
</style>
