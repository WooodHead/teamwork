<!--
 * @Author: your name
 * @Date: 2020-09-17 10:13:19
 * @LastEditTime: 2020-11-06 11:29:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \teamwork\src\components\base\TwSelectResource.vue
-->
<template>
  <q-select
    :placeholder="$t('search.allOrganize')"
    :use-input="useInput"
    fill-input
    :hide-selected="hideSelected"
    hide-dropdown-icon
    input-debounce="0"
    :options="optionsList"
    @filter="filterFn"
    :hint="hint"
    :borderless="borderless"
    v-on="selectListeners"
    :readonly="readonly"
    :stack-label="stackLabel"
    :standout="standout"
    :outlined="outlined"
    :rounded="rounded"
    :map-options="emitValue"
    :value="value"
    option-value="id"
    option-label="name"
    option-disable=""
    :emit-value="emitValue"
    :dense="dense"
    behavior='menu'
    :rules="rules"
    :lazy-rules="rules.length>0"
    ref="TwSelectOrganize"
    class="select-resource"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          未找到搜索结果
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:append>
      <q-icon
        v-if="value.type!=='all'"
        size="xs"
        name="close"
        @click.stop="$emit('reset')"
        class="cursor-pointer reset"
      />
      <q-icon
        v-else
        name="search"
      />
    </template>
  </q-select>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import selectListeners from '../../mixins/mixins-select-listeners'
export default {
  mixins: [selectListeners],
  props: {
    value: {
      required: true,
      description: 'Model of the component; Must be Array if using "multiple" prop; Either use this property (along with a listener for "input" event) OR use v-model directive'
    },
    rounded: {
      type: String,
      required: false,
      description: 'rounded'
    },
    clearable: {
      type: String,
      required: false,
      description: 'clearable'
    },
    hint: {
      type: String,
      required: false,
      description: ''
    },
    hideSelected: {
      type: String,
      required: true,
      description: ''
    },
    useInput: {
      type: String,
      required: true,
      description: ''
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false,
      description: 'Allow multiple selection; Model must be Array'
    },
    emitValue: {
      type: Boolean,
      required: false,
      default: false,
      description: 'Update model with the value of the selected option instead of the whole option'
    },
    stackLabel: {
      type: String,
      required: false,
      description: 'A text label that will “float” up above the input field, once the field gets focus'
    },
    byGroup: {
      type: Boolean,
      required: false,
      default: false,
      description: 'select persons by group'
    },
    dense: {
      type: Boolean,
      required: false,
      default: false,
      description: 'Dense mode; occupies less space'
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false,
      description: 'Use "readonly" design for the field'
    },
    outlined: {
      type: Boolean,
      required: false,
      default: false,
      description: 'Use "outlined" design for the field'
    },
    filled: {
      type: Boolean,
      required: false,
      default: false,
      description: 'Use "filled" design for the field'
    },
    standout: {
      type: Boolean,
      required: false,
      default: false,
      description: 'Use "standout" design for the field'
    },
    borderless: {
      type: Boolean,
      required: false,
      default: false,
      description: 'Use "borderless" design for the field'
    },
    rules: {
      type: Array,
      required: false,
      default: () => [],
      description: 'Array of Functions/Strings; If String, then it must be a name of one of the embedded validation rules'
    }
  },
  data () {
    return {
      model: null,
      options: null,
      organizes: []
    }
  },
  computed: {
    optionsList: {
      get () {
        return this.options || _.values(this.organizes)
      },
      set (value) {
        this.options = value
      }
    }
  },
  methods: {
    ...mapMutations('search', ['addOrganizes']),
    ...mapActions('organize', ['loadSelectOrganizes']),
    filterFn (val, update, abort) {
      if (val.length < 2) {
        abort()
        return
      }
      update(() => {
        const name = val.toLowerCase()
        this.optionsList = this.organizes.filter(v => v.name.toLowerCase().includes(name))
      })
    }
  },
  mounted () {
    this.loadSelectOrganizes({ byPage: false }).then((res) => {
      if (res.length > 0) {
        res.forEach(item => {
          this.organizes.push({
            id: item.id,
            name: item.name,
            type: 'organize'
          })
        })
        this.addOrganizes(this.organizes)
      }
    })
  }
}
</script>

<style lang='scss' scoped>
</style>
