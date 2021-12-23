<template>
  <q-card class="card-grow-in-page q-px-md q-pt-sm">
    <!-- 选择文件 -->
    <input
      type="file"
      @change="onChange"
      style="display:none;"
      ref="chooseFile"
    />
    <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
    >
      <!-- 步进器部分 -->
      <q-step
        v-for="item in stepList"
        :key="item.name"
        :name=item.name
        :title=item.title
        :icon=item.icon
        :done="step>item.name"
      >
        <!-- 第一步：文件校验 -->
        <check-material-file
          v-if="step===1"
          :fileName="currentFile.name"
          :modelList="modelList"
          @next="next"
        >
        </check-material-file>
        <!-- 第二步：数据预览 -->
        <import-and-upload
          v-if="step===2"
          :modelList="modelList"
          @back="back"
          @next="next"
        ></import-and-upload>
        <!-- 第三步：文件上传后的展示 -->
        <q-card-actions
          class="q-pt-md"
          align="center"
        >
          <file-card
            v-if="isImport && step===3"
            :model="file.FileInfo"
          />
        </q-card-actions>
      </q-step>
    </q-stepper>
    <xlsx-read :file="currentFile">
      <xlsx-json @parsed="xlsxJsonParse"></xlsx-json>
    </xlsx-read>
  </q-card>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { XlsxRead, XlsxJson } from 'vue-xlsx'
import { showWarningMessage } from '@/utils/show-message'
export default {
  name: 'ImportMaterial',
  data () {
    return {
      step: 0, // 步进器步数
      currentFile: null, // 当前选择文件
      modelList: [], // 导入总数
      stepList: [
        { name: 1, title: this.$t('material.step.filecheck'), icon: 'search' },
        { name: 2, title: this.$t('material.step.import'), icon: 'cloud_upload' },
        { name: 3, title: this.$t('material.step.upload'), icon: 'upload' }
      ]
    }
  },
  computed: {
    ...mapState('material', ['isImport', 'file'])

  },
  components: {
    XlsxRead,
    XlsxJson,
    CheckMaterialFile: () => import('components/material/import/CheckMaterialFile'),
    ImportAndUpload: () => import('components/material/import/ImportAndUpload'),
    FileCard: () => import('components/material/file/FileCard')
  },
  methods: {
    ...mapMutations('material', ['updateFile', 'updateExcelFile']),
    // 返回上一步
    back () {
      this.$refs.stepper.previous()
    },
    next () {
      this.$refs.stepper.next()
    },
    // 解析出来的数据
    xlsxJsonParse (excelModelList) {
      // 保存文件实体
      this.updateExcelFile(this.currentFile)
      if (excelModelList.length <= 0) {
        this.updateFile({})
        this.modelList = []
        showWarningMessage('文件中无数据,请重新导入')
      } else {
        this.modelList = excelModelList
      }
    },
    onChange (event) {
      this.currentFile = event.target.files ? event.target.files[0] : null
      if (this.currentFile != null) {
        this.step = 1
      }
    }
  },
  watch: {
    isImport (newVal, oldVal) {
      if (newVal) {
        this.next()
      }
    }
  },
  mounted () {
    this.$refs.chooseFile.click()
  }
}
</script>

<style lang="scss" scoped>
/deep/ .q-stepper__header--border {
  border-bottom: none;
}
a:hover {
  text-decoration: underline;
}
</style>
