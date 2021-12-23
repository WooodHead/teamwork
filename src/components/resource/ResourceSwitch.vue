<template>
  <div class="column items-center">
    <q-btn-dropdown
      v-if="$q.platform.is.mobile"
      rounded
      outline
      color="primary"
      class="q-mt-md"
    >
      <template v-slot:label>
        <q-icon
          left
          :color="objCategory.color"
          :name="objCategory.icon"
        />
        {{categoryLabel(objCategory)}}
      </template>
      <q-list>
        <q-item
          clickable
          v-close-popup
          v-for="category in categorysWithWidget"
          :key="category.id"
          @click="objCategory=category"
        >
          <q-item-section avatar>
            <q-icon
              :color="category.color"
              :name="category.icon"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{categoryLabel(category)}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <div
      v-else
      class="row justify-center q-gutter-lg q-pa-lg wrap"
    >
      <q-btn
        v-for="category in categorysWithWidget"
        :key="category.id"
        rounded
        :flat="objCategory!==category"
        color="white"
        text-color="dark"
        :class="{'shadow-1':objCategory!==category}"
        @click="objCategory=category"
      >
        <q-icon
          left
          :color="category.color"
          :name="category.icon"
        />
        <div>{{categoryLabel(category)}}</div>
      </q-btn>
    </div>
    <q-card
      flat
      :bordered="!$q.platform.is.mobile"
      class="full-width q-py-lg"
      :class="{'q-px-xl':$q.screen.gt.xs}"
      style="min-height:60vh;"
    >
      <q-card-section>
        <div class="text-h6 text-center">
          您想查看哪个{{objCategory.label}}的{{widget === 'activity' ? $t('activity.title'):objCategory.widgets[widget].label}}？
        </div>
      </q-card-section>
      <q-card-section
        class="q-pt-none"
        :class="{'q-px-xl':$q.screen.gt.sm}"
      >
        <resource-select-panel
          :category="objCategory.name"
          flat
          @select="selectResource"
          :isVirtualScroll="false"
        />

      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { selectAll } from '@/directives/select-all'
// 某人，某项目，某团队，某机构，某机床，某工具，某会议室等
export default {
  name: 'ResourceSwitch',
  props: {
    category: {
      type: String,
      required: false,
      default: 'person'
    },
    widget: {
      type: String,
      required: false,
      default: 'schedule'
    }
  },
  components: {
    ResourceSelectPanel: () => import('components/resource/ResourceSelectPanel')
  },
  directives: {
    selectAll
  },
  data () {
    return {
      categorysWithWidget: []
    }
  },
  computed: {
    ...mapState('resource', ['categorys', 'selectedCategory', 'selectedItem', 'title']),
    objCategory: {
      get () {
        return this.selectedCategory
      },
      set (value) {
        this.setSelectedCategory(value)
        value.custom && this.loadCustomCategoryOfItems({
          query: [{ 'Key': 'Category', 'Value': this.category, 'Oper': 'eq' }]
        })
      }
    }
  },
  mounted () {
    this.loadCategorys().then(res => {
      this.objCategory = this.categorys[this.category]
      this.categorysWithWidget = _.filter(this.categorys, c => c.widgets[this.widget])
    })
  },
  methods: {
    ...mapMutations('resource', ['setSelectedCategory', 'setSelectedItem', 'setTitle']),
    ...mapActions('resource', ['loadCategorys', 'loadCustomCategoryOfItems']),
    selectResource (item) {
      const res = {
        category: this.objCategory,
        id: item.id,
        item: { ...{ category: this.objCategory.name }, ...item }
      }
      this.$emit('switch', res)
    },
    categoryLabel (category) {
      return `某${category.label}的${this.widget === 'activity'
        ? this.$t('activity.title')
        : category.widgets[this.widget].label}`
    }
  }
}
</script>

<style>
</style>
