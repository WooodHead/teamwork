<template>
  <q-list class="full-width">
    <!-- 公告项 -->
    <draggable
      v-model="noticesList"
      v-bind="dragOptions"
      @start="onDragStart"
      @change="onChange"
    >
      <div
        v-for="notice in noticesList"
        :key="notice.id"
      >
        <notice-item
          :notice="notice"
          @click-item="clickItem"
        ></notice-item>
      </div>
    </draggable>
  </q-list>
</template>

<script>
import { mapActions } from 'vuex'
import draggable from 'vuedraggable'
import { computedOrder } from '@/utils/computed-order'
export default {
  props: ['notices'],
  components: {
    draggable,
    'NoticeItem': () => import('components/notice/NoticeItem')
  },
  data () {
    return {
      fromNotice: {}
    }
  },
  computed: {
    dragOptions () {
      return this.$store.state.notice.dragOptions
    },
    noticesList: {
      get () {
        return this.notices
      },
      set (newValue) {
        let index = _.findIndex(newValue, value => value.id === this.fromNotice.id)
        // 更新 orderNumber
        let prev = newValue[index - 1]
        let next = newValue[index + 1]
        let order1 = prev ? prev.orderNumber : next.orderNumber.concat('1')
        let order2 = next ? next.orderNumber : 0
        let orderNumber = computedOrder(order1, order2)
        newValue[index].orderNumber = orderNumber
        // 更新数组
        this.$store.commit('notice/updateNotice', newValue[index])
      }
    }
  },
  methods: {
    ...mapActions('notice', ['updateNotice']),
    clickItem (notice) {
      this.$router.push({
        name: 'noticeDetail',
        params: { id: notice.id, category: notice.objectType, objectID: notice.objectID }
      })
    },
    onDragStart (event) {
      this.fromNotice = event.item._underlying_vm_
    },
    onChange (event) {
      let from = event.moved.element
      this.updateNotice(from)
    }
  }
}
</script>

<style scoped>
.ghost {
  border-radius: 4px;
  background-color: #ecf9fd;
}
.chosen {
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12);
}
</style>
