<!--
@Name：添加案例库
@Author：陆欢
@date：2021/11/03
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-card class="q-pa-lg full-width">
    <q-card-section
      class="row"
      v-if="!$q.platform.is.mobile"
    >
      <div
        class="text-subtitle2 text-bold"
        style="font-size:20px"
      >新建案例</div>
      <q-space />
      <q-btn
        icon="close"
        flat
        round
        dense
        v-close-popup
      />
    </q-card-section>
    <tw-form
      actionAlign="right"
      @primary="onSubmit"
      style="width:auto"
    >
      <!-- 标题 -->
      <q-card-section class="q-py-none">
        <div class="text-bold">标题<span class="text-red q-pl-xs">*</span></div>
        <q-input
          filled
          v-model="model.title"
          :placeholder="$t('document.field.placeholder.title')"
          lazy-rules
          :rules="[val => !!val.trim() || $t('productCase.formCerifyRule.title')]"
          autofocus
          debounce="500"
          class="q-mt-sm"
        >
        </q-input>
      </q-card-section>
      <!-- 图片 -->
      <q-card-section class="q-py-none">
        <div class="text-bold">图片<span class="text-red q-pl-xs">*</span></div>
        <div class="flex manage-template full-width q-mt-sm">
          <q-card
            flat
            bordered
            class="cursor-pointer widget-card base-card"
            style="overflow:hidden"
            v-ripple:grey-5
            cursor-pointer
            :class="{'q-mt-none':$q.platform.is.mobile}"
            @click="addTemplate"
          >
            <div class="text-center absolute-center">
              <q-icon
                style="color:#ccc"
                name="add"
                size="xl"
              />
            </div>
          </q-card>
          <span class="restartUpload">
            <q-btn
              flat
              label="重新上传"
            />
          </span>
        </div>
      </q-card-section>
      <!-- 是否公开 -->
      <q-card-section>
        <div class="text-bold">是否公开<span class="text-red q-pl-xs">*</span></div>
        <q-option-group
          inline
          :options="options"
          type="radio"
          class="q-gutter-x-lg"
          v-model="model.isPublish "
        />
      </q-card-section>
    </tw-form>
  </q-card>
</template>

<script>
import Document from '@/store/document/model'
export default {
  name: 'productCaseForm',
  props: {
    id: {
      type: Number,
      required: true
    }

  },
  data () {
    return {
      model: new Document(),
      options: [
        { label: this.$t('productCase.acl.public'), value: 1 },
        { label: this.$t('productCase.acl.noPublic'), value: 0 }
      ]
    }
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    onSubmit () {
    }
  },
  components: {
    // TwSelectTree: () => import('components/base/TwSelectTree'),
    TwForm: () => import('components/base/TwForm')
  }
}
</script>

<style scoped lang="scss">
.base-card:first-child {
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-height: 150px;
  min-width: 150px;
}
.restartUpload {
  flex-direction: column;
  justify-content: center;
  display: flex;
}
</style>
