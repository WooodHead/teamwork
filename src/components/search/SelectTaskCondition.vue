<template>
  <div class="q-gutter-sm">
    <span
      v-for="option in options"
      :key="option.id"
      @click="selectCondition(option.value)"
    >
      <q-chip
        class="cursor-pointer"
        rounded
        :color="option.selected?'primary':''"
        :text-color="option.selected?'white':'black'"
        :label="option.label"
        no-caps
      />
    </span>
  </div>
</template>

<script>
export default {
  name: 'SelectTaskCondition',
  data () {
    return {
      options: [
        {
          value: 'assigned',
          label: '指派给他',
          selected: false
        },
        {
          value: 'finished',
          label: '他完成的',
          selected: false
        },
        {
          value: 'created',
          label: '他创建的',
          selected: false
        },
        {
          value: 'archived',
          label: '他归档的',
          selected: false
        }
      ]
    }
  },
  computed: {
    // emit 向外传递的星期（星期一，星期二）
    conditions () {
      let c = []
      this.options.forEach(item => {
        if (item.selected) {
          c.push(item.value)
        }
      })
      return c
    }
  },
  methods: {
    selectCondition (val) {
      let index = this.options.findIndex(a => a.value === val)
      this.options[index].selected = !this.options[index].selected
      this.$emit('select', this.conditions)
    }
  }
}

</script>

<style  scoped>
.btn-pc-width {
  width: 80px;
}
</style>
