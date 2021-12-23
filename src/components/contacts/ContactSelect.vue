<template>
  <q-dialog
    ref="dialog"
    :maximized="$q.platform.is.mobile"
    :transition-show="transitionShow"
    :transition-hide="transitionHide"
    :persistent="persistent"
    @hide="onDialogHide"
  >
    <q-card
      class="q-dialog-plugin"
      :style="!$q.platform.is.mobile &&'width:600px;max-width: 90vw;'"
    >
      <q-card-section>
        <div class="text-h6">{{model.title}}</div>
      </q-card-section>
      <q-separator />
      <q-card-section padding :style="contentHeight">
        <q-card flat bordered>
          <q-card-section>
            <q-splitter
              v-model="splitter"
              :style="treeContentHeight"
            >
              <template v-slot:before>
                <!-- <q-item-label header>组织架构</q-item-label> -->
                <q-input
                  dense
                  outlined
                  v-model="filter"
                  debounce
                  label="搜索机构"
                  clearable
                  class="q-pr-md"
                />

                <q-tree
                  ref="orgQTree"
                  :nodes="orgNodes"
                  node-key="value"
                  label-key="label"
                  tick-strategy="strict"
                  :ticked.sync="orgTicked"
                  @update:ticked="orgTickedFun"
                  :filter="filter"
                  :filter-method="filterFun"
                  default-expand-all
                >
                  <template v-slot:default-body="prop">
                    <q-tree
                      ref="psonQTree"
                      v-if="psonNodes(prop.node.value).length"
                      :nodes="psonNodes(prop.node.value)"
                      node-key="value"
                      label-key="label"
                      tick-strategy="strict"
                      :ticked.sync="psonTicked"
                      @update:ticked="psonTickedFun"
                      default-expand-all
                    />
                  </template>
                </q-tree>
              </template>
              <template v-slot:after>
                <q-list dense>
                  <q-item-label header>已选择的机构、成员</q-item-label>
                  <q-item v-for="item in items" :key="`${item.name}_${item.value}`">
                   <q-icon :name="item.icon" size="xs" />&nbsp;{{item.label}}
                  </q-item>
                </q-list>
              </template>
            </q-splitter>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-separator />
      <q-card-actions align="center">
        <q-btn
          dense
          :label="$t('action.save')"
          color="primary"
          @click="onOKClick"
        />
        <q-btn
          dense
          outline
          :label="$t('action.cancel')"
          color="primary"
          @click="onCancelClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'forbiddenContactPanel',
  props: {
    transitionShow: {
      type: String,
      require: false,
      default: 'slide-up'
    },
    transitionHide: {
      type: String,
      require: false,
      default: 'slide-down'
    },
    persistent: {
      type: Boolean,
      require: false,
      default: false
    },
    model: {
      type: Object,
      require: false,
      default: () => {
        return { title: '限制查看外机构', description: '被限制的机构，只能看到本机构的通讯录', items: [] }
      }
    }
  },
  data () {
    return {
      splitter: 50,
      orgTicked: [],
      psonTicked: [],
      items: [],
      filter: ''
    }
  },
  computed: {
    ...mapGetters('organize', ['selectOrganizesTree', 'selectOrganizes']),
    ...mapGetters('person', ['selectPersonsOfOrganize', 'selectPersonsFiltered']),
    orgNodes () {
      return this.filterOrganizes(this.selectOrganizesTree)
    },
    psonNodes () {
      return id => {
        return this.filterPersons(this.selectPersonsOfOrganize(id, false))
      }
    },
    contentHeight () {
      return this.$q.platform.is.mobile
        ? `height: calc(${this.$q.screen.height}px - 2px - 48px - 64px);overflow: auto`
        : `height: calc(${this.$q.screen.height}px - 2px - 48px - 64px - 48px);overflow: auto`
    },
    treeContentHeight () {
      return this.$q.platform.is.mobile
        ? `height: calc(${this.$q.screen.height}px - 2px - 48px - 64px - 66px);overflow: auto`
        : `height: calc(${this.$q.screen.height}px - 2px - 48px - 64px - 48px - 66px);overflow: auto`
    }
  },
  created () {
    // 初始化item
    this.items = _.clone(this.model.items)
    // 初始化 ticked
    this.orgTicked = _.map(_.filter(this.items, item => item.name === 'organize'), 'value')
    // 初始化 psonTicked
    this.psonTicked = _.map(_.filter(this.items, item => item.name === 'person'), 'value')
  },
  mounted () { },
  methods: {
    filterOrganizes (orgs) {
      return _.map(orgs, o => {
        return {
          name: 'organize',
          label: o.name,
          value: o.id,
          icon: 'folder',
          children: this.filterOrganizes(o.children)
        }
      })
    },
    filterPersons (psons) {
      return _.map(psons, p => {
        return {
          name: 'person',
          label: p.name,
          value: p.id,
          icon: 'person'
        }
      })
    },
    orgTickedFun (target) {
      let orgItems = _.map(_.filter(this.selectOrganizes, o => target.includes(o.id, Number)), om => {
        return {
          name: 'organize',
          label: om.name,
          value: om.id,
          icon: 'folder'
        }
      })
      this.items = [..._.filter(this.items, p => p.name === 'person'), ...orgItems]
    },
    psonTickedFun (target) {
      let psonItems = _.map(_.filter(this.selectPersonsFiltered, p => target.includes(p.id, Number)), pm => {
        return {
          name: 'person',
          label: pm.name,
          value: pm.id,
          icon: 'person'
        }
      })
      this.items = [..._.filter(this.items, o => o.name === 'organize'), ...psonItems]
    },
    filterFun (node, filter) {
      return node.label && node.label.toLowerCase().indexOf(filter.toLowerCase()) > -1
    },
    // 以下方法是必需的
    // (不要改变它的名称 --> "show")
    show () {
      this.$refs.dialog.show()
    },
    // 以下方法是必需的
    // (不要改变它的名称 --> "hide")
    hide () {
      this.$refs.dialog.hide()
    },
    onDialogHide () {
      // QDialog发出“hide”事件时
      // 需要发出
      this.$emit('hide')
    },
    onOKClick (user) {
      // 按OK，在隐藏QDialog之前
      // 发出“ok”事件（带有可选的有效负载）
      // 是必需的
      this.$emit('ok', this.items)
      // 或带有有效负载：this.$emit('ok', { ... })
      // 然后隐藏对话框
      this.hide()
    },
    onCancelClick () {
      // 我们只需要隐藏对话框
      this.hide()
    }
  },
  components: {}
}
</script>

<style scoped lang="scss">
</style>
