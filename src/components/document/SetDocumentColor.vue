<!--
@Name：设置文档卡片颜色
@Author：陆欢
@date：2021/03/05
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <div>
    <q-dialog
      persistent
      v-if="$q.screen.lt.sm"
      value
      position="top"
    >
      <q-card class="q-gutter-xs q-ma-md text-center q-pb-md">
        <div class="text-bold q-mt-sm">{{$t('document.pickColor')}}</div>
        <tw-color-picker
          :set-color.sync='selectColor'
          size="xl"
          @setColor="setColor"
        />
        <q-btn
          class="q-mt-md"
          outline
          rounded
          size="md"
          text-color="grey-8"
          :label="$t('action.save')"
          @click.stop="setDocumentColor()"
        />
      </q-card>
    </q-dialog>
    <div
      v-else
      class="color-pick q-gutter-xs q-pb-sm"
    >
      <div class="text-bold q-mt-sm">{{$t('document.pickColor')}}</div>
      <tw-color-picker
        :set-color.sync='selectColor'
        @setColor="setColor"
      />
      <q-btn
        class="q-mt-md"
        outline
        rounded
        size="md"
        text-color="grey-8"
        :label="$t('action.save')"
        @click.stop="setDocumentColor()"
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'SetDocumentColor',
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    color: {
      type: String,
      default: '',
      required: false
    }
  },
  data () {
    return {
      selectColor: ''
    }
  },
  mounted () {
    this.selectColor = _.cloneDeep(this.color) || 'bg-white'
  },
  methods: {
    ...mapActions('document', ['updateDocumentField']),
    setDocumentColor () {
      this.$emit('setColor')
      this.updateDocumentField({ DocID: this.id, Color: this.selectColor })
    },
    setColor () {
      this.$emit('update:color', this.selectColor)
    }
  },
  components: {
    TwColorPicker: () => import('components/base/TwColorPicker')
  }
}
</script>

<style scoped>
  .color-pick {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    margin: 10px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    background: white;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
    border-bottom-left-radius: 0.2rem !important;
    border-bottom-right-radius: 0.2rem !important;
    border-top-left-radius: 0.2rem !important;
    border-top-right-radius: 0.2rem !important;
  }
</style>
