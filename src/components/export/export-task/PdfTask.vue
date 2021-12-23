<!--
@Name：导出PDF内容的任务模板
@Author：陆欢
@date：2021/01/25
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <task-only-show
    :tasks="modelList"
    :category="category"
    :objectID="objectID"
    :needSettingProperty="needSettingProperty"
    :exportCommentByCategory="exportCommentByCategory"
  />
</template>

<script>
export default {
  name: 'PdfTask',
  props: {
    modelList: {
      type: Array,
      required: true
    },
    needSettingProperty: {
      type: Object,
      default: () => { return {} },
      required: false,
      description: '需要更新的内容'
    },
    category: {
      type: String,
      default: '',
      required: false,
      description: '导入关联的资源,例如：project、product'
    },
    objectID: {
      type: Number,
      default: 0,
      required: false,
      description: '资源的ID，例如：ProjectID'
    },
    exportCommentByCategory: {
      type: Boolean,
      default: false,
      required: false,
      description: '导出某个资源下面的所有符合条件的评论内容，例如导出某个项目下面所有符合条件的任务评论'
    }
  },
  components: {
    TaskOnlyShow: () => import('components/task/TaskOnlyShow')
  }
}
</script>

<style lang="scss" scoped>
  .task-public {
    color: #283c46;
    font-size: 16px;
  }
  .title-page {
    font-size: 28px;
    font-weight: 700;
  }
  .title-group {
    font-size: 16px;
    font-weight: 700;
    word-break: break-word;
  }
  /deep/ .title-list {
    margin-top: 0 !important;
  }
  /deep/ .title-list + div {
    margin-bottom: 16px;
    color: $grey-7;
    font-size: 14px;
  }
  @font-face {
    font-family: "阿里巴巴普惠体 Regular";
    src: url(../../../css/fonts/Alibaba-PuHuiTi-Regular.woff);
  }
</style>
