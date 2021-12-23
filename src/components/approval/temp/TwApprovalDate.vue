<template>
  <div v-if="control">
    <q-input
      :mask="inputMask"
      :value="value"
      :filled="filled"
      :outlined="outlined"
      :borderless="borderless"
      :clearable="clearable"
      :hide-bottom-space="hideBottomSpace"
      :rounded="rounded"
      :square="square"
      :dense="dense"
      :item-aligned="itemAligned"
      :label="control.property.title[0].text"
      :lazy-rules="!!control.property.require"
      :rules="!!control.property.require?[ val => val && String(val).length > 0 || control.property.placeholder[0].text ]:null"
    >
      <template v-slot:prepend>
        <q-icon
          name="event"
          class="cursor-pointer"
        >
          <q-popup-proxy
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              :value="value"
              @input="changeDate"
              :mask="dateMask"
            >
              <div class="row items-center justify-end">
                <q-btn
                  v-close-popup
                  label="确定"
                  color="primary"
                  flat
                />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
      <template v-slot:append v-if="control.config.date.type==='hour'">
        <q-icon
          name="access_time"
          class="cursor-pointer"
        >
          <q-popup-proxy
            transition-show="scale"
            transition-hide="scale"
          >
            <q-time
              :value="value"
              @input="changeDate"
              :mask="dateMask"
              format24h
            >
              <div class="row items-center justify-end">
                <q-btn
                  v-close-popup
                  label="确定"
                  color="primary"
                  flat
                />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
import { date } from 'quasar'
const { formatDate } = date
export default {
  name: 'TwApprovalDate',
  props: {
    control: {
      type: Object,
      require: true,
      default: null
    },
    filled: {
      type: Boolean,
      require: false,
      default: false
    },
    outlined: {
      type: Boolean,
      require: false,
      default: false
    },
    borderless: {
      type: Boolean,
      require: false,
      default: false
    },
    clearable: {
      type: Boolean,
      require: false,
      default: false
    },
    hideBottomSpace: {
      type: Boolean,
      require: false,
      default: false
    },
    rounded: {
      type: Boolean,
      require: false,
      default: false
    },
    square: {
      type: Boolean,
      require: false,
      default: false
    },
    dense: {
      type: Boolean,
      require: false,
      default: false
    },
    itemAligned: {
      type: Boolean,
      require: false,
      default: true
    }
  },
  data () {
    return {
      inputMask: this.control.config.date.type === 'day' ? '####/##/##' : '####/##/## ##:##',
      dateMask: this.control.config.date.type === 'day' ? 'YYYY/MM/DD' : 'YYYY/MM/DD HH:mm'
    }
  },
  computed: {
    value () {
      return this.control.property.value.date.s_timestamp ? this.formatDate(this.control.property.value.date.s_timestamp * 1000, this.dateMask) : ''
    }
  },
  created () {

  },
  mounted () {

  },
  watch: {

  },
  methods: {
    formatDate,
    changeDate (val) {
      console.log(val)
      this.control.property.value.date.s_timestamp = new Date(val).getTime() / 1000
    }
  },
  components: {

  }
}
</script>

<style scoped lang="scss">
</style>
