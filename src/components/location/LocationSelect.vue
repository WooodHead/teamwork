<template>
  <div>
    <q-input
      v-model="mylocationName"
      readonly
      :filled="filled"
      :outlined="outlined"
      :rounded="rounded"
      :dense="dense"
      @click="showLocationDialog=true"
      ref="locationSelect"
    >
      <template v-slot:prepend>
        <q-icon name="location_on" />
      </template>
      <template v-slot:append>
        <q-icon
          name="keyboard_arrow_down"
          @click="showLocationDialog=true"
        />
      </template>
    </q-input>

    <q-dialog
      v-model="showLocationDialog"
      position="bottom"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <location-list
        :showSearch="showSearch"
        :mylocation="mylocation"
        :showLocationDialog.sync="showLocationDialog"
        :style="dialogStyle"
      />
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'LocationSelect',
  components: {
    LocationList: () => import('components/location/LocationList')
  },
  props: {
    showSearch: { type: Boolean, default: false },
    // 当type=none时，value值其实无意义，代表未选择位置
    // 示例： { type: 'none', value: '' }
    // 当type=poi时，value值是具体位置对象，代表选择的是具体的位置
    // 示例： { type: 'poi', value: { 'id': 'B0FFMBOYWW', 'name': '西安软件新城软件研发基地2期A7号楼', 'type': '商务住宅;产业园区;产业园区', 'location': { 'Q': 34.205192, 'R': 108.834854, 'lng': 108.834854, 'lat': 34.205192 }, 'address': '', 'tel': '', 'distance': 60, 'shopinfo': '0' } }
    mylocation: {
      type: Object,
      default: () => {
        return {
          type: 'none', // 两个值可选，none、poi
          value: ''
        }
      }
    },
    placeholder: { type: String, required: false },
    filled: { type: Boolean, default: false },
    outlined: { type: Boolean, default: false },
    rounded: { type: Boolean, default: false },
    dense: { type: Boolean, default: false }
  },
  data () {
    return {
      showLocationDialog: false,
      dialogStyle: {
        height: '85vh',
        width: '850px',
        maxWidth: '850px'
      }
    }
  },
  computed: {
    mylocationName () {
      if (this.mylocation.type === 'none') {
        return this.placeholder || '所在位置'
      } else {
        return (this.mylocation.value && this.mylocation.value.name) || ''
      }
    }
  },
  mounted () {
    // 移除组件只读样式
    this.$refs.locationSelect.$el.classList.remove('q-field--readonly')
  }
}
</script>

<style lang='scss' scoped>
</style>
