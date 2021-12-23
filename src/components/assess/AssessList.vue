<template>
  <q-list class="full-width">
    <!-- 评估项 -->
    <draggable
      v-model="assessList"
      v-bind="dragOptions"
      @start="onDragStart"
      @change="onChange"
    >
      <div
        v-for="assess in assessList"
        :key="assess.id"
      >
        <assess-item
          :category="category"
          :model="assess"
          @click-item="clickItem"
        ></assess-item>
      </div>
    </draggable>
  </q-list>
</template>

<script>
import { mapActions } from 'vuex'
import draggable from 'vuedraggable'
export default {
  props: {
    category: {
      type: String,
      default: undefined,
      required: true
    },
    objectID: {
      type: [String, Number],
      default: 0,
      required: true
    },
    assessList: {
      type: Array,
      required: true
    },
    itemCanClick: { type: Boolean, default: true }
  },
  components: {
    draggable,
    'AssessItem': () => import('components/assess/AssessItem')
  },
  data () {
    return {
      fromAssess: {}
    }
  },
  computed: {
    dragOptions () {
      return this.$store.state.assess.dragOptions
    }
  },
  methods: {
    ...mapActions('assess', ['updateAssess']),
    clickItem (assess) {
      this.itemCanClick && this.$router.push({
        name: 'assessDetail',
        params: { category: this.category, objectID: this.objectID, id: assess.id }
      })
    },
    onDragStart (event) {
      this.fromAssess = event.item._underlying_vm_
    },
    onChange (event) {
      let from = event.moved.element
      this.updateAssess(from)
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
