<template>
  <div>
    <q-select
      :borderless="borderless"
      use-input
      input-debounce="500"
      hide-dropdown-icon
      :clearable="clearable"
      :readonly="readonly"
      :stack-label="stackLabel"
      :value="value"
      @input="$emit('input', $event)"
      :use-chips="multiple"
      :standout="standout"
      :outlined="outlined"
      :multiple="multiple"
      :map-options="emitValue"
      :label="label"
      :placeholder="placeholder"
      :filled="filled"
      :emit-value="emitValue"
      :dense="dense"
      :rules="rules"
      :lazy-rules="rules.length>0"
      :options="filterOptions"
      @new-value="createValue"
      @filter="filterFn"
      ref="TwSelectTag"
    >
      <template v-slot:append>
        <q-btn
          round
          dense
          flat
          icon="local_offer"
          @click.stop="dialogGroup=true"
        >
          <q-tooltip>{{$t('base.selectTags')}} </q-tooltip>
        </q-btn>
        <q-dialog
          v-model="dialogGroup"
          position="bottom"
        >
          <q-card style="width: 600px; max-width: 100vw; max-height:80vh">
            <tag-group
              v-for="group in tagGroups"
              :key="group.id"
              :tag-group="group"
              :selected-tags="value"
            ></tag-group>
          </q-card>
        </q-dialog>
      </template>
    </q-select>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'TwSelectTag',
  props: {
    value: {
      type: Array,
      required: false,
      description: 'Model of the component; Must be Array if using "multiple" prop; Either use this property (along with a listener for "input" event) OR use v-model directive'
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false,
      description: 'Allow multiple selection; Model must be Boolean'
    },
    clearable: {
      type: Boolean,
      required: false,
      default: false,
      description: 'Allow multiple clearable; Model must be Boolean'
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
      stringOptions: [],
      filterOptions: [],
      dialogGroup: false
    }
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    tagGroups () {
      return this.dictionary['tag'] ? this.dictionary['tag']['tag'] : []
    }
  },
  components: {
    TagGroup: () => import('components/tag/TagGroup.vue')
  },
  methods: {
    ...mapActions('tag', ['loadTags']),
    ...mapActions('dictionary', ['loadDictionarys']),
    createValue (val, done) {
      if (val.length > 0) {
        if (!this.stringOptions.includes(val)) {
          this.stringOptions.push(val)
        }
        done(val, 'toggle')
      }
    },
    filterFn (val, update, abort) {
      if (val.length < 2) {
        abort()
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.filterOptions = this.stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    focus () {
      this.$nextTick(() => {
        this.$refs.TwSelectTag.focus()
      })
    }
  },
  mounted () {
    this.loadTags().then(tags => {
      this.stringOptions = tags.map(item => { return item.title })
      this.filterOptions = this.stringOptions
    })
    this.loadDictionarys('tag')
  }
}
</script>
<style lang="scss" scoped >
button {
  vertical-align: middle;
  padding: 0;
  font-size: 14px;
  font-weight: 500;
}
.q-btn--round {
  border-radius: 50%;
}
</style>
