<!--
@Name：配色选择
@Author：陆欢
@date：2021/03/04
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <div class="q-gutter-xs">
    <q-avatar
      v-for="option in colorOptions"
      :key="option.value"
      clickable
      :size=size
      :icon="option.state==='active'?'done':''"
      :class="`${option.value} ${option.state==='active'?'border-active':'border-inactive'}`"
      @click.stop="pickColor(option)"
    ></q-avatar>
  </div>
</template>

<script>
export default {
  name: 'TwColorPicker',
  props: {
    setColor: {
      type: String,
      default: 'bg-white',
      required: false,
      descrip: '选择的背景色'
    },
    size: {
      type: String,
      default: 'sm',
      required: false,
      descrip: '按钮大小'
    }
  },
  data () {
    return {
      allSelectColors: [
        {
          state: 'active',
          value: 'bg-white'
        },
        {
          state: 'inactive',
          value: 'bg-green-2'
        },
        {
          state: 'inactive',
          value: 'bg-blue-2'
        },
        {
          state: 'inactive',
          value: 'bg-yellow-2'
        },
        {
          state: 'inactive',
          value: 'bg-grey-4'
        },
        {
          state: 'inactive',
          value: 'bg-red-1'
        },
        {
          state: 'inactive',
          value: 'bg-pink-2'
        },
        {
          state: 'inactive',
          value: 'bg-brown-2'
        },
        {
          state: 'inactive',
          value: 'bg-orange-1'
        },
        {
          state: 'inactive',
          value: 'bg-indigo-1'
        },
        {
          state: 'inactive',
          value: 'bg-primary1'
        },
        {
          state: 'inactive',
          value: 'bg-primary2'
        },
        {
          state: 'inactive',
          value: 'bg-primary3'
        },
        {
          state: 'inactive',
          value: 'bg-primary4'
        },
        {
          state: 'inactive',
          value: 'bg-primary5'
        },
        {
          state: 'inactive',
          value: 'bg-primary6'
        },
        {
          state: 'inactive',
          value: 'bg-primary7'
        },
        {
          state: 'inactive',
          value: 'bg-auxiliary1'
        },
        {
          state: 'inactive',
          value: 'bg-auxiliary2'
        },
        {
          state: 'inactive',
          value: 'bg-auxiliary3'
        },
        {
          state: 'inactive',
          value: 'bg-auxiliary4'
        },
        {
          state: 'inactive',
          value: 'bg-auxiliary5'
        },
        {
          state: 'inactive',
          value: 'bg-auxiliary6'
        }
      ]
    }
  },
  computed: {
    colorOptions () {
      let allColors = _.map(this.allSelectColors, color => {
        color.state = this.setColor === color.value ? 'active' : 'inactive'
        return color
      })
      return allColors
    }
  },
  methods: {
    pickColor (option) {
      this.$emit('update:setColor', option.value)
      this.$emit('setColor', option)
    }
  }
}
</script>

<style scoped>
.border-active {
  border: 0.5px solid #283c46;
}
.border-inactive {
  border: 0.5px solid #bfbfbf;
}
</style>
