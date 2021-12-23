<template>
  <q-item
    v-if="!showEditForm"
    class="row items-center"
  >
    <tw-menu
      v-if="showOperateButton && ($myinfo.auth.role.isSystemAdministrator || $myinfo.auth.role.isConsultAdministrator)"
      class="q-mr-xs"
      icon="menu"
      flat
      color="grey-4"
      :ripple="false"
      :menus="['edit','delete']"
      @edit="showEditForm = true"
      @delete="deleteItem(item.id)"
    />
    <div
      class="ellipsis cursor-pointer text-subtitle1"
      @click="clickItem"
      :title="item.title"
    >
      {{item.title}}</div>
  </q-item>
  <item-form
    v-else
    :type="item.type"
    :id="item.id"
    openType="edit"
    @close="showEditForm=false"
  />
</template>
<script>
import { mapMutations, mapActions } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
export default {
  name: 'AItem',
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      showEditForm: false,
      showOperateButton: true
    }
  },
  components: {
    TwMenu: () => import('components/base/TwMenu'),
    ItemForm: () => import('components/consult/item/ItemForm')
  },
  methods: {
    ...mapActions('consult', ['addConsultItem', 'updateConsultItem', 'deleteConsultItem']),
    ...mapMutations('consult', ['setEmptyTransators']),
    deleteItem (id) {
      showConfirm(this.$t('message.reallyDelete'), () => {
        this.setEmptyTransators()
        this.deleteConsultItem(+id)
      })
    },
    clickItem () {
      let psonId = 0
      if (this.item.psonIDs.length > 1) {
        let random = _.random(0, this.item.psonIDs.length - 1)
        psonId = this.item.psonIDs[random]
      } else {
        psonId = this.item.psonIDs[0]
      }
      psonId && this.$router.push({
        name: 'consultAdd',
        params: { openType: 'add', itemId: +this.item.id, transactorId: +psonId }
      })
    }
  }
}
</script>
