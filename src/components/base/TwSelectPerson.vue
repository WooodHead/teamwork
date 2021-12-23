<template>
  <q-select
    v-if="mode==='select'"
    :borderless="borderless"
    v-on="selectListeners"
    use-input
    input-debounce="500"
    hide-dropdown-icon
    :clearable="!multiple"
    :readonly="readonly"
    :disable="disable"
    @filter="filterFn"
    :stack-label="stackLabel"
    :value="value"
    :use-chips="multiple"
    :standout="standout"
    :outlined="outlined"
    :rounded="rounded"
    :options="optionsList"
    :multiple="multiple"
    :map-options="emitValue"
    option-value="id"
    option-label="name"
    option-disable=""
    :label="label"
    :placeholder="placeholder||$t('base.personnelMatchingPattern')"
    :filled="filled"
    :emit-value="emitValue"
    :dense="dense"
    :hide-bottom-space="hideBottomSpace"
    behavior='menu'
    :rules="rules"
    :lazy-rules="rules.length>0"
    ref="TwSelectPerson"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          {{$t('base.noResults')}}
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
      >
        <q-item-section avatar>
          <tw-avatar
            size="md"
            :id="scope.opt.id"
            :name="scope.opt.name"
            :img="scope.opt.img"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label v-html="scope.opt.name" />
          <q-item-label caption>{{ scope.opt.duty }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template
      v-if="!multiple"
      v-slot:selected-item="scope"
    >
      <q-chip
        v-if="scope.opt.id"
        dense
        color="white"
        class="q-my-none q-ml-xs q-mr-none"
      >
        <tw-avatar
          :id="scope.opt.id"
          :name="scope.opt.name"
          :img="scope.opt.img"
          size="xs"
        />
        {{ scope.opt.name }}
      </q-chip>
    </template>
    <template
      v-else
      v-slot:selected-item="scope"
    >
      <q-chip
        removable
        dense
        @remove="scope.removeAtIndex(scope.index)"
        :tabindex="scope.tabindex"
        class="q-ma-none"
      >
        <tw-avatar
          :id="scope.opt.id"
          :name="scope.opt.name"
          :img="scope.opt.img"
          size="xs"
        />
        {{ scope.opt.name }}
      </q-chip>
    </template>
    <template v-slot:append>
      <q-btn
        v-if="byGroup"
        round
        dense
        flat
        icon="group"
        @click.stop="dialogGroup=true"
      >
        <q-tooltip>{{$t('base.selectPersonByGroup')}}</q-tooltip>
      </q-btn>
      <q-dialog
        v-model="dialogGroup"
        position="bottom"
      >
        <tw-group-person
          :obj-persons="objPersons"
          @select="selectGroup"
        />
      </q-dialog>
      <q-icon
        v-if="multiple&&value.length>0"
        class="cursor-pointer"
        name="cancel"
        @click.stop="value.splice(0)"
      />
    </template>
  </q-select>
  <q-select
    v-else
    :placeholder="placeholder||$t('search.anyone')"
    use-input
    fill-input
    hide-dropdown-icon
    use-chips
    input-debounce="0"
    :options="optionsList"
    @filter="filterFn"
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
    :hide-bottom-space="hideBottomSpace"
    behavior='menu'
    :rules="rules"
    :lazy-rules="rules.length>0"
    ref="TwSelectPerson"
  >
    <template v-slot:selected-item="scope">
      <q-chip
        v-if="scope.opt.id"
        dense
        color="white"
        class="q-my-none q-mr-none"
      >
        <tw-avatar
          :id="scope.opt.id"
          :name="scope.opt.name"
          :img="scope.opt.img"
          size="xs"
        />
        {{ scope.value }}
      </q-chip>
    </template>
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
      >
        <q-item-section avatar>
          <tw-avatar
            size="md"
            :id="scope.opt.id"
            :name="scope.opt.name"
            :img="scope.opt.img"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label v-html="scope.opt.name" />
          <q-item-label caption>{{ scope.opt.duty }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          未找到搜索结果
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:append>
      <q-icon
        v-if="value&&value.type!=='all'"
        size="xs"
        name="close"
        @click.stop="$emit('reset')"
        class="cursor-pointer"
      />
      <q-icon
        v-else
        name="search"
      />
    </template>
  </q-select>
</template>

<script>
import selectListeners from '../../mixins/mixins-select-listeners'
import { mapState, mapGetters } from 'vuex'
/**
 * 可以取人员ID，ID数组，对象，对象数组，
 * 前两个需要设置emit-value，数组需要设置multiple
 * 根据取值不同，提供正确的value类型
 */
export default {
  name: 'TwSelectPerson',
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    TwGroupPerson: () => import('components/base/TwGroupPerson')
  },
  mixins: [selectListeners],
  props: {
    mode: {
      type: String,
      required: false,
      description: 'mode',
      default: 'select'
    },
    value: {
      required: true,
      description: 'Model of the component; Must be Array if using "multiple" prop; Either use this property (along with a listener for "input" event) OR use v-model directive'
    },
    rounded: {
      type: String,
      required: false,
      description: 'rounded'
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
    label: {
      type: String,
      required: false,
      default: undefined,
      description: 'A text label that will “float” up above the input field, once the field gets focus'
    },
    placeholder: {
      type: String,
      required: false,
      default: '',
      description: 'A text label that will “float” up above the input field, once the field gets focus'
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
    disable: {
      type: Boolean,
      required: false,
      default: false,
      description: 'Use "disable" design for the field'
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
    hideBottomSpace: {
      type: Boolean,
      required: false,
      default: false
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
      dialogGroup: false,
      options: null
    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    ...mapGetters('person', ['selectPersonsSorted']),
    optionsList: {
      get () {
        return this.options || this.selectPersonsSorted
      },
      set (value) {
        this.options = value
      }
    },
    objPersons () {
      return this.selectPersons
    }
  },
  methods: {
    filterFn (val, update, abort) {
      if (val.length < 1) {
        abort()
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.optionsList = this.selectPersonsSorted.filter(p =>
          p.name.toLowerCase().includes(needle) ||
          p.pinyin.toLowerCase().includes(needle)
        )
      })
    },
    selectGroup (ids) {
      ids = _.map(ids, id => Number(id))
      if (this.emitValue) {
        this.value.push(..._.difference(ids, this.value))
      } else {
        for (const id of ids) {
          if (this.value.includes(this.objPersons[id])) {
            this.value.push(this.objPersons[id])
          }
        }
      }
    },
    focus () {
      this.$nextTick(() => {
        this.$refs.TwSelectPerson.focus()
      })
    }
  }
}
</script>

<style>
</style>
