<template>
  <div :class="data.color">
    <q-item dense>
      <!-- 图标 -->
      <q-item-section
        avatar
        top
        v-if="withIcon"
      >
        <q-btn
          class="q-mt-sm"
          :class="{'emoji-font':$q.platform.is.win}"
          flat
          dense
          :disable="!editable"
          :label="data.icon||'😊'"
          @click="dialog=true"
        />
      </q-item-section>
      <!-- 名称 -->
      <q-item-section top>
        <q-input
          autogrow
          type="textarea"
          ref="dictValue"
          dense
          flat
          :label="editable&&withDictKey?$t('dictionary.name'):''"
          :placeholder="!(editable&&withDictKey)&&$t('dictionary.name')"
          :value="data.dictValue"
          @input="data.dictValue=$event.trim()"
          :readonly="!editable"
          :borderless="!editable"
          :autofocus="editable"
          :rules="[ val => val && val.trim().length > 0 || $t('dictionary.emptyNameNote')]"
        />
      </q-item-section>
      <!-- code -->
      <q-item-section
        v-if="editable&&withDictKey"
        style=" flex: 0 0 80px;"
        top
      >
        <q-input
          v-if="this.data.module !== 'organize' "
          dense
          :borderless="!(editable&&withDictKey)"
          flat
          :label="$t('dictionary.dictKey')"
          :value="data.dictKey"
          @input="data.dictKey=$event.trim()"
          :rules="[ val => val && val.length || $t('dictionary.dictKeyEmptyNotes')]"
          :readonly="!editable"
        ></q-input>
        <q-input
          v-else
          dense
          :borderless="!(editable&&withDictKey)"
          flat
          :label="$t('dictionary.dictKey')"
          :value="data.dictKey"
          @input="data.dictKey=$event.trim()"
          :rules="[ val => val && /^[0-9]+$/.test(val.trim()) || $t('dictionary.organizeDictKeyEmptyNotes')]"
          :readonly="!editable"
        ></q-input>
      </q-item-section>
      <!-- 描述信息 -->
      <q-item-section
        v-if="editable"
        top
      >
        <q-input
          autogrow
          dense
          :borderless="!editable"
          flat
          :label="$t('dictionary.notes')"
          :value="data.notes"
          @input="data.notes=$event.trim()"
          :readonly="!editable"
        />
      </q-item-section>
      <!-- 显示颜色 -->
      <q-item-section
        top
        v-if="editable"
      >
        <tw-color-picker
          :set-color.sync="data.color"
          size="xs"
        />
      </q-item-section>
      <!-- 编辑/删除 -->
      <q-item-section
        side
        v-if="!editable"
      >
        <div class="q-gutter-xs">
          <q-icon
            name="view_headline"
            class="text-h5 text-grey-4 "
            v-if="!editable"
          />
          <q-btn
            flat
            dense
            icon="create"
            @click="editOption"
          />
          <q-btn
            flat
            dense
            icon="delete"
            @click="deleteOption"
          />
        </div>
      </q-item-section>
      <!-- 保存/取消 -->
      <q-item-section
        side
        v-else
      >
        <div class="q-gutter-xs">
          <q-btn
            flat
            dense
            icon="done"
            @click="submitOption"
          />
          <q-btn
            flat
            dense
            icon="clear"
            @click="cancelEdit"
          />
        </div>
      </q-item-section>
    </q-item>
    <q-separator v-if="!editable" />
    <!-- 选择图标 -->
    <q-dialog
      v-model="dialog"
      :position="$q.screen.gt.xs?'standard':'bottom'"
    >
      <tw-emoji-panel
        class="bg-white"
        @add="addEmoji"
      />
    </q-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
import { showWarningMessage } from '@/utils/show-message'
import Dictionary from '@/store/dictionary/model'
export default {
  name: 'OptionItem',
  props: {
    data: {
      type: Object,
      default: () => {
        return new Dictionary()
      }
    },
    withIcon: {
      type: Boolean,
      default: false
    },
    withDictKey: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialog: false,
      editable: !this.data.id,
      oldData: _.cloneDeep(this.data)
    }
  },
  methods: {
    ...mapActions('dictionary', ['editDictionary', 'deleteDictionary']),
    editOption () {
      this.editable = true
    },
    deleteOption () {
      let that = this
      showConfirm(this.$t('message.reallyDelete'), () => {
        this.deleteDictionary(that.data)
      })
    },
    submitOption () {
      if (!(this.data.dictValue && this.data.dictValue.trim().length > 0)) {
        showWarningMessage(this.$t('dictionary.emptyNameNote'))
      } else if (this.withDictKey && !(this.data.dictKey.trim())) {
        showWarningMessage(this.$t('dictionary.dictKeyEmptyNotes'))
      } else {
        let that = this
        !that.withDictKey && (that.data.dictKey = that.data.dictValue)
        that.editDictionary(this.data).then((newData) => {
          if (that.data.id && newData) {
            Object.assign(that.data, newData)
          } else {
            Object.assign(that.data, that.oldData)
          }
        })
        that.editable = false
        that.$emit('editEdit')
      }
    },
    cancelEdit () {
      this.editable = false
      Object.assign(this.data, this.oldData)
      this.$emit('cancelEdit')
    },
    // 图标替换
    addEmoji (emoji) {
      this.dialog = false
      this.data.icon = emoji
    }
  },
  components: {
    TwEmojiPanel: () => import('components/emoji/TwEmojiPanel'),
    TwColorPicker: () => import('components/base/TwColorPicker')
  },
  destroyed () {
    // 关闭窗口前未编辑完成的状态还原
    if (this.editable) {
      this.cancelEdit()
    }
  }
}
</script>

<style scoped>
.q-item {
  padding: 8px 0;
}
</style>
