<template>
  <q-card flat>
    <q-card-section class="row">
      <div
        v-for="item in workType"
        class="col-4 relative-position row justify-center items-start"
        :key="item.id"
      >
        <q-btn
          v-if="showEditBtn"
          flat
          dense
          icon="cancel"
          color="negative"
          size="13px"
          class="absolute-top-right"
          style="z-index: 9"
          @click="deleteType(item)"
        ></q-btn>
        <q-btn
          stack
          flat
          @click="$emit('click', item)"
        >
          <template>
            <q-btn
              outline
              round
              color="grey-9"
              class="work-type-font"
              :label="item.dictKey"
            />
            <span
              v-if="!showEditBtn"
              class="text-caption"
            >{{item.dictValue}}
            </span>
          </template>
        </q-btn>
        <q-input
          v-if="showEditBtn"
          v-model="item.dictValue"
          class="q-px-md"
        >
          <template v-slot:append>
            <q-icon
              name="done"
              @click="editType(item)"
              class="cursor-pointer"
              size="sm"
            />
          </template>
        </q-input>
      </div>
      <!-- 新建 -->
      <div
        v-if="showEditBtn"
        class="col-4 row justify-center"
      >
        <q-btn
          round
          color="secondary"
          icon="add"
          size="1.0rem"
          class="q-mt-xs no-pointer-events"
        />
        <div class="rows text-caption q-mt-sm q-px-md">
          <q-input
            flat
            dense
            :placeholder="$t('dictionary.dictKey')"
            :value="dicModel.dictKey"
            @input="dicModel.dictKey=$event.trim()"
          ></q-input>
          <q-input
            flat
            dense
            :placeholder="$t('dictionary.name')"
            :value="dicModel.dictValue"
            @input="dicModel.dictValue=$event.trim()"
          >
            <template v-slot:append>
              <q-icon
                name="done"
                @click="addType()"
                class="cursor-pointer"
                size="sm"
              />
            </template>
          </q-input>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
import Dictionary from '@/store/dictionary/model'
export default {
  name: 'WorkTypeCard',
  props: {
    showEditBtn: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      dicModel: new Dictionary()
    }
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    workType () {
      return this.dictionary['workRecord'] ? this.dictionary['workRecord']['type'] : []
    }
  },
  mounted () {
    this.loadDictionarys('workRecord')
  },
  methods: {
    ...mapActions('dictionary', ['loadDictionarys', 'deleteDictionary', 'editDictionary']),
    addType () {
      if (this.dicModel.dictKey.trim() && this.dicModel.dictValue.trim()) {
        Object.assign(this.dicModel, {
          module: 'workRecord',
          field: 'type'
        })
        this.editDictionary(this.dicModel)
        this.dicModel = new Dictionary()
      }
    },
    editType (item) {
      if (item.dictValue.trim()) this.editDictionary(item)
    },
    deleteType (item) {
      showConfirm(this.$t('message.reallyDelete'), () => {
        this.deleteDictionary(item)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.work-type-font /deep/.block {
  font-size: 20px;
}
</style>
