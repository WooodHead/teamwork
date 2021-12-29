<!--
 * @Author: your name
 * @Date: 2020-09-17 10:13:19
 * @LastEditTime: 2020-09-17 10:22:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \teamwork\src\components\base\TwSelectResource.vue
-->
<template>
  <q-select
    :placeholder="$t('search.everywhere',
    {organize:$t('organize.title'),
     productDev:$t('productDev.title'),
     project:$t('project.title'),
     team:$t('team.title'),
     wiki:$t('wiki.title')
    })"
    use-input
    fill-input
    hide-selected
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
    option-value="value"
    option-label="label"
    option-disable=""
    :emit-value="emitValue"
    :dense="dense"
    behavior='menu'
    :rules="rules"
    :lazy-rules="rules.length>0"
    ref="TwSelectResource"
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
      resources: []
    }
  },
  computed: {
    optionsList: {
      get () {
        return this.options || _.values(this.resources)
      },
      set (value) {
        this.options = value
      }
    }
  },
  methods: {
    ...mapMutations('search', ['addResources']),
    ...mapActions('project', ['loadProjects']),
    ...mapActions('team', ['loadTeams']),
    ...mapActions('productDev', ['loadProductDevs']),
    ...mapActions('organize', ['loadOrganizes']),
    filterFn (val, update, abort) {
      if (val.length < 2) {
        abort()
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.optionsList = this.resources.filter(v => v.label.toLowerCase().includes(needle))
      })
    }
  },
  mounted () {
    this.loadProjects({ byPage: false }).then((res) => {
      if (res.length > 0) {
        res.forEach(item => {
          this.resources.push({
            label: item.title,
            value: item.id,
            type: 'project'
          })
        })
        this.addResources(this.resources)
      }
    })
    this.loadProductDevs({ byPage: false }).then((res) => {
      if (res.length > 0) {
        res.forEach(item => {
          this.resources.push({
            label: item.title,
            value: item.id,
            type: 'productDev'
          })
        })
        this.addResources(this.resources)
      }
    })
    this.loadTeams({ byPage: false }).then((res) => {
      if (res.length > 0) {
        res.forEach(item => {
          this.resources.push({
            label: item.title,
            value: item.id,
            type: 'team'
          })
        })
        this.addResources(this.resources)
      }
    })
    this.loadOrganizes().then((res) => {
      if (res.length > 0) {
        res.forEach(item => {
          this.resources.push({
            label: item.title,
            value: item.id,
            type: 'organize'
          })
        })
        this.addResources(this.resources)
      }
    })
  }
}
</script>

<style lang='scss' scoped>
</style>
