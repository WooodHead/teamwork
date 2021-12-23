<template>
  <!-- 当搜索时若类型下无事务项，则不显示 -->
  <q-expansion-item
    v-if="!(consultItemSearch && consultItems.items.length === 0)"
    v-model="expanded"
    expand-separator
    header-class="text-h6 text-weight-bold q-pr-none"
    header-style="font-size:18px"
  >
    <template v-slot:header>
      <div>
        <q-btn
          v-if="$myinfo.auth.role.isSystemAdministrator || $myinfo.auth.role.isConsultAdministrator"
          flat
          dense
          rounded
          icon="add"
          color="grey-5"
          class="q-mr-xs"
          :title="$t('consult.item.addItem')"
          @click.stop="add"
        />
        <span>{{consultItems.type}}</span>
      </div>
      <q-space />
    </template>
    <q-list v-if="consultItems.items">
      <item-form
        v-if="showAddForm"
        :type="consultItems.type"
        openType="add"
        @close="showAddForm=false"
      />
      <a-item
        v-for="item in consultItems.items"
        :key="item.id"
        :item="item"
      />
    </q-list>
  </q-expansion-item>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'ATypeItems',
  props: {
    consultItems: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      showAddForm: false,
      expanded: false
    }
  },
  computed: {
    ...mapState('consult', ['consultItemSearch'])
  },
  components: {
    ItemForm: () => import('components/consult/item/ItemForm'),
    AItem: () => import('components/consult/item/AItem')
  },
  methods: {
    add () {
      this.showAddForm = true
      this.expanded = true
    }
  }
}
</script>
