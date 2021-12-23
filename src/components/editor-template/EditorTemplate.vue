<!--  -->
<template>
  <div>
    <q-card
      style="height:200px"
      v-if="selected"
      @click="$emit('selectedEvent',editorTemplate.content)"
      class="cursor-pointer"
      flat
      bordered
    >
      <q-card-section class="q-pb-none">
        <div
          class="text-subtitle2 text-weight-bold ellipsis"
          :title="editorTemplate.title"
        >{{ editorTemplate.title }}</div>
        <div
          class="text-caption ellipsis"
          :title="editorTemplate.description"
        >{{ editorTemplate.description }}</div>
      </q-card-section>
      <q-separator
        class="bg-grey-4"
        inset
      />
      <q-card-section>
        <div
          v-html="editorTemplate.content"
          class="tiptap-content editor__content"
          style="word-wrap: break-word;text-align: initial;height:108px;overflow: hidden;"
        >
        </div>
      </q-card-section>
    </q-card>
    <q-card
      v-else
      style="height:200px"
      class="cursor-pointer"
      flat
      bordered
      @click.stop="$emit('openEvent',editorTemplate.id)"
    >
      <q-card-section class="q-pb-none">
        <div
          class="text-subtitle2 text-weight-bold ellipsis"
          :title="editorTemplate.title"
        >{{ editorTemplate.title }}</div>
        <div
          class="text-caption ellipsis"
          :title="editorTemplate.description"
        >{{ editorTemplate.description }}</div>
      </q-card-section>
      <q-separator
        class="bg-grey-4"
        inset
      />
      <q-card-section>
        <div
          v-html="editorTemplate.content"
          class="tiptap-content"
          style="word-wrap: break-word;text-align: initial;height:108px;overflow: hidden;"
        >
        </div>
      </q-card-section>
      <q-icon
        name="clear"
        size="xs"
        class="absolute-top-right q-ma-md"
        @click.stop="deleteEvent"
      />
    </q-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { i18n } from '@/boot/i18n'
import { showConfirm } from '@/utils/show-confirm'
import { showWarningMessage, showSuccessMessage } from '@/utils/show-message'
export default {
  props: {
    editorTemplate: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    },
    // 是否为选择模式
    selected: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  computed: {
    color () {
      if (this.editorTemplate.selected) {
        return {
          bgcolor: 'primary',
          textcolor: 'white'
        }
      } else {
        return {
          bgcolor: 'grey-4',
          textcolor: 'dark'
        }
      }
    }
  },
  methods: {
    ...mapActions('editorTemplate', ['deleteEditorTemplate']),
    deleteEvent () {
      var _this = this
      // 弹出删除弹框
      showConfirm(i18n.t(`editorTemplate.confirmDelete`), () => {
        _this.deleteEditorTemplate(_this.editorTemplate.id).then(res => {
          if (res) {
            showSuccessMessage(i18n.t(`editorTemplate.deleteSuccess`))
          } else {
            showWarningMessage(i18n.t(`editorTemplate.deleteFaild`))
          }
        })
      })
    }
  }
}

</script>
