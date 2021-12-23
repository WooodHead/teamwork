<!-- 思维导图Add、Edit页面 -->
<template>
  <q-card
    :flat="guide"
    :class="['full-width', {'bg-green-1': guide}]"
  >
    <q-card-section>
      <div class="tw-mark-map full-width">
        <!-- 标题 -->
        <q-input
          v-model="submitModel.title"
          input-class="text-center"
          class="text-h6"
          :placeholder="$t('document.field.placeholder.title')"
          lazy-rules
          :rules="[val => !!val && !!val.trim() || $t('document.field.rule.title')]"
          ref="title"
          autofocus
          debounce="500"
        />
        <q-splitter
          class="markmap-codemirror markmap-border"
          :class="{'column':$q.platform.is.mobile}"
          v-model="splitterRatio"
        >
          <!-- markdown语法编辑器 -->
          <template v-slot:before>
            <codemirror
              class="split-codemirror"
              v-model="submitModel.content"
              :options="cmOption"
            />
          </template>
          <!-- 思维导图组件 -->
          <template v-slot:after>
            <mind-map
              class="split-markmap"
              :class="{'border-top':$q.platform.is.mobile}"
              :code="submitModel.content"
              :title="submitModel.title"
            />
          </template>
        </q-splitter>
        <!-- 仅自己可编辑 -->
        <tw-only-i-can-handle
          v-if="submitModel.authorID === myself||!!$myinfo.auth.role.isSystemAdministrator||!!$myinfo.auth.role.isSeniorManager"
          :meEdit.sync="submitModel.onlyICanEdit"
        />
        <!-- 权限设定 -->
        <tw-secrecy-acl
          v-if="moduleType=='document'&&openType==='markmapAdd'"
          :secrecy.sync="secrecy"
          :initWhiteListScope="currentModelParent.acl?currentModelParent.whiteList:[]"
        />
        <!-- 通知人员 -->
        <tw-choose-notify
          :module="{category,id:+objectID}"
          :widget="{category:moduleType,id: +this.submitModel.id}"
          :category="category"
          :objectID="+objectID"
          :always="moduleType==='notice'"
          :subscribers.sync="subscribers"
        />
        <!-- 按钮 -->
        <form-action
          align="left"
          :action="formAction"
          @submit="onSubmit"
          @save="onSave"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { format, debounce, LocalStorage } from 'quasar'
const { capitalize } = format
import Document from '@/store/document/model'
// codemirror
import dedent from 'dedent'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

// 语言包
import 'codemirror/mode/markdown/markdown.js'

// active-line.js
import 'codemirror/addon/selection/active-line.js'

// styleSelectedText
import 'codemirror/addon/selection/mark-selection.js'
import 'codemirror/addon/search/searchcursor.js'

// highlightSelectionMatches
import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/addon/search/match-highlighter.js'

// keyMap
import 'codemirror/keymap/sublime.js'

export default {
  name: 'MarkMapForm',
  props: {
    category: {
      type: String,
      default: 'document'
    },
    objectID: {
      type: [Number, String],
      default: 0
    },
    id: {
      type: [Number, String],
      default: 0
    },
    guide: {
      type: Boolean,
      default: false
    }
  },
  components: {
    codemirror,
    TwChooseNotify: () => import('components/base/TwChooseNotify'),
    MindMap: () => import('components/document/markmap/MindMap'),
    FormAction: () => import('components/base/TwFormAction'),
    TwSecrecyAcl: () => import('components/base/TwSecrecyAcl'),
    // 仅自己可编辑
    TwOnlyICanHandle: () => import('components/base/TwOnlyICanHandle')
  },
  data () {
    return {
      myself: LocalStorage.getItem('myself').id,
      formAction: [
        { label: this.$t('action.submitEdit'), action: 'submit' }
      ],
      moduleType: 'document',
      openType: this.$route.name,
      submitModel: { id: 0 },
      subscribers: [],
      secrecy: { acl: 0, whiteList: [] },
      markmapObj: null,
      // 初始分割比例
      splitterModel: 40,
      code: dedent`
# TeamWork

## 产品管理

- [主页](https://server.example.com/path/to/resource)
- <https://server.example.com/path/to/resource>

## 系统工具

### 消息中心

### 通讯录

- 机构
- 职位
- 群组

## 项目管理

- 公告板
- 待办任务
(里程碑，缺陷，任务)
- 文档中心
- 聊天室
- 日程安排
- ~~自动~~ **自动提问** *汇报*

## 其它特征

- \`高亮显示\`
          `,
      cmOption: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        keyMap: 'sublime',
        // 语言包
        mode: 'text/x-markdown',
        // theme
        theme: 'default'
      }
    }
  },
  computed: {
    markdownData () {
      const { root } = transform(this.code)
      return root
    },
    // 初始分割比例
    splitterRatio: {
      get () {
        return this.$q.platform.is.mobile ? 100 : this.splitterModel
      },
      set (val) {
        this.splitterModel = val
      }
    },
    currentModel () {
      return this.$store.getters['document/currentModel'](+this.id)
    },
    currentModelParent () {
      return this.currentModel ? _.find(this.$store.state.document.documentList, d => d.id === this.currentModel.parentId) || {} : {}
    }
  },
  created () {
    if (this.openType === 'markmapEdit') {
      this.$store.dispatch(`${this.moduleType}/load${capitalize(this.moduleType)}`, +this.id).then(res => {
        this.submitModel = _.cloneDeep(res)
        if (!this.submitModel.isPublish) {
          this.formAction.unshift({ label: this.$t('action.saveDraft'), action: 'save' })
        }
        this.secrecy = { acl: this.submitModel.acl, whiteList: this.submitModel.whiteList }
      })
    } else {
      this.submitModel = new Document(this.currentModel.objectType || this.category, this.currentModel.objectID || this.objectID)
      this.submitModel.content = this.code
      this.submitModel.parentId = +this.id
      this.formAction.unshift({ label: this.$t('action.saveDraft'), action: 'save' })
    }
  },
  methods: {
    // 通过防抖函数防止表单短时间内重复提交
    onSubmit: debounce(function () {
      this.submitData('submit')
    }, 3000, true),
    onSave: debounce(function () {
      this.submitData('save')
    }, 3000, true),
    submitData (submitType) {
      const titleValidate = this.$refs.title.validate()
      if (titleValidate) {
        this.submitModel.isPublish = (submitType === 'submit') ? 1 : 0
        // 订阅人员处理
        this.submitModel.subscribers = this.subscribers
        // 保密文档白名单
        this.submitModel.acl = this.secrecy.acl
        const newWhiteList = _.difference(this.secrecy.whiteList, this.subscribers)
        this.whiteList = [...this.subscribers, ...newWhiteList]
        this.submitModel.whiteList = this.secrecy.acl ? _.uniq(this.whiteList) : []
        this.secrecy.whiteList = this.secrecy.acl ? _.uniq(this.whiteList) : []

        this.submitModel.objectType = this.currentModel.objectType || this.category
        this.submitModel.objectID = this.currentModel.objectID || this.objectID

        // 维护方式
        if (this.openType === 'markmapAdd' || this.openType === 'documentGuide') {
          // markmap创建的文档设置 markmap 后缀
          this.submitModel.extension = 'markmap'
          this.$store.dispatch(`${this.moduleType}/add${capitalize(this.moduleType)}`, this.submitModel)
            .then(res => {
              if (this.guide) {
                this.$emit('hiddenMarkMapForm')
              } else {
                res && this.routeTo(res)
              }
            })
        } else {
          this.$store.dispatch(`${this.moduleType}/update${capitalize(this.moduleType)}`, this.submitModel)
            .then(res => {
              res && this.routeTo(res)
            })
        }
      }
    },
    routeTo (doc) {
      let id = doc.isPublish ? doc.id : doc.parentId
      const inDocumentCenter = this.$route.path.split('/')[1] === 'document'
      let params = inDocumentCenter
        ? { id }
        : { category: this.category, objectID: this.objectID, id }

      if (doc.isPublish) {
        this.$router.push({
          name: 'docDetail',
          params
        })
      } else {
        this.$router.push({
          name: 'draftDocuments',
          params
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .tw-mark-map {
    .markmap-border {
      border: 1px solid #e2e8f0;
    }
    .border-top {
      border-top: 1px solid #e2e8f0;
    }
  }
  .split-codemirror {
    height: 30vh;
  }
  /deep/.q-splitter--vertical > .q-splitter__panel.q-splitter__after {
    height: 40vh;
  }
  @media screen and (min-width: 768px) {
    .markmap-codemirror {
      height: 66vh;
    }
    .split-codemirror,
    /deep/.q-splitter--vertical > .q-splitter__panel.q-splitter__after,
    /deep/.CodeMirror {
      height: 100%;
    }
  }
</style>
