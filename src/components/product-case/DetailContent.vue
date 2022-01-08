<!--
@Name：组件详细信息分类
@Author：陆欢
@date：2021/10/29
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <div>
    <q-card-section :class="{'q-pt-none':$q.platform.is.mobile}">
      <div v-for="(dictionary, index) in dictionarys" :key="dictionary.id">
        <q-card-section v-if="index" />
        <div
          v-if="listType !== 'table'"
          class="row items-center q-mb-md"
          :class="$q.platform.is.desktop ? 'text-h6' : 'text-subtitle1'"
        >
          <span>{{ dictionary.dictValue }}</span>
          <q-separator class="fade-line" />
        </div>
        <draggable
          :value="dictDocuments(dictionary)"
          @input="setDraggable($event)"
          @start="onDragStart($event, dictionary)"
          class="row q-gutter-lg"
          v-bind="dragOptions"
          handle=".handle"
          :disabled="draggableDisabled"
        >
          <folder-table
            border
            v-if="documents.length && listType === 'table'"
            :list="dictDocuments(dictionary)"
            category="productCase"
            objectID="0"
            :id="id"
          >
            <template #table-bottom-row>
              <q-tr>
                <td colspan="3">
                  <span
                    :class="
                      $q.platform.is.desktop ? 'text-h6' : 'text-subtitle1'
                    "
                    >{{ dictionary.dictValue }}</span
                  >
                </td>
                <td class="text-right">
                  <q-btn
                    flat
                    icon="add"
                    color="positive"
                    label="新建"
                    @click="openEditPage(dictionary.dictValue)"
                  />
                </td>
                <!-- <div class="row q-px-md q-py-sm">
   
                <q-space />
   
                </div> -->
              </q-tr>
              <!-- <div class="row q-px-md q-py-sm">
               
              </div> -->
            </template>
          </folder-table>
          <folder-list
            v-else-if="documents.length && listType === 'list'"
            :list="dictDocuments(dictionary)"
            category="productCase"
            objectID="0"
            :id="id"
          >
            <template #list>
              <div class="text-right">
                <q-btn
                  flat
                  icon="add"
                  color="positive"
                  :label="`新建${dictionary.dictValue}`"
                  @click="openEditPage(dictionary.dictValue)"
                />
              </div>
            </template>
          </folder-list>
          <document-card
            v-else
            v-for="item in dictDocuments(dictionary)"
            :key="item.id"
            class="span-stype handle"
            :file="item"
          />
          <!-- 新增卡片 -->
          <q-card
            class="cursor-pointer widget-card span-stype handle"
            v-if="
              (model.authorID === $myinfo.id ||
                $myinfo.auth.role.isSystemAdministrator) &&
                listType === 'card'
            "
            @click="openEditPage(dictionary.dictValue)"
          >
            <div class="text-center absolute-center">
              <q-icon style="color:#ccc" name="add" size="xl" />
            </div>
          </q-card>
        </draggable>
      </div>
    </q-card-section>
    <!-- 文件夹保密区 -->
    <q-card-section v-if="!!model.acl">
      <tw-secrecy-area :currentModel="model" :parentModel="modelParent" />
    </q-card-section>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import draggable from 'vuedraggable'
import { computedOrder } from '@/utils/computed-order'
export default {
  name: 'DetailContent',
  props: {
    id: {
      type: [Number, String],
      default: 0,
      required: false
    }
  },
  data () {
    return {
      dragDocument: {}, // 拖拽的文档
      dragOptions: {
        animation: 300,
        delay: 200,
        scroll: true,
        scrollSensitivity: '500',
        // 输入组件不可拖拽
        // filter: '.undraggable,input',
        // 样式
        ghostClass: 'ghost',
        chosenClass: 'chosen'
      }
    }
  },
  mounted () {
    // 1、获取对应的字典类型
    this.loadDictionarys('productCase')
  },
  // watch: {
  //   id (val) {
  //     this.restart()
  //   }
  // },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    ...mapState('document', ['sort', 'listType']),
    draggableDisabled () {
      const haveEdit =
        this.model.authorID === this.$myinfo.id ||
        this.$myinfo.auth.role.isSystemAdministrator
      return !haveEdit
    },
    model () {
      return this.$store.getters['document/currentModel'](+this.id)
    },
    modelParent () {
      return this.model
        ? _.find(
          this.$store.state.document.documentList,
          d => d.id === this.model.parentId
        )
        : {}
    },
    dictionarys () {
      return this.dictionary['productCase']
        ? this.dictionary['productCase']['type']
        : []
    },
    documents () {
      return this.$store.getters['document/documents'](
        +this.model.id || +this.id
      )
    }
  },
  methods: {
    _filter: _.filter,
    dictDocuments (dictionary) {
      let docs = _.filter(this.documents, { tag: dictionary.dictValue })
      return _.sortBy(docs, ['orderNumber'], ['asc'])
    },
    ...mapActions('document', ['updateDocumentField']),
    ...mapActions('dictionary', ['loadDictionarys']),
    onDragStart (event, dict) {
      let list = this.dictDocuments(dict)
      this.dragDocument = list[event.oldIndex]
    },
    openEditPage (fileTag) {
      this.$router.push({
        name: 'fileUpload',
        params: { id: +this.id, fileTag, category: 'productCase' }
      })
    },
    setDraggable (newValue) {
      if (!newValue || !this.dragDocument) {
        return false
      }
      const id = this.dragDocument.id
      let index = _.findIndex(newValue, { id: id })
      let prev = newValue[index - 1]
      let next = newValue[index + 1]
      let prevOrder = 0
      let nextOrder = 0
      if (prev && next) {
        prevOrder = prev.orderNumber
        nextOrder = next.orderNumber
      } else if (prev && !next) {
        prevOrder = prev.orderNumber
        nextOrder = prev.orderNumber.toString() + '1'
      } else if (!prev && next) {
        prevOrder = 0
        nextOrder = next.orderNumber
      }
      let orderNumber = computedOrder(prevOrder, nextOrder)
      this.updateDocumentField({ DocID: id, OrderNumber: orderNumber })
      newValue[index].orderNumber = orderNumber
    }
  },
  components: {
    draggable,
    DocumentCard: () => import('components/document/DocumentCard'),
    TwSecrecyArea: () => import('components/base/TwSecrecyArea'),
    FolderList: () => import('components/document/folder/FolderList'),
    FolderTable: () => import('components/document/folder/FolderTable')
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: $breakpoint-xs-max) {
  .span-stype {
    width: 43% !important;
  }
}
.ghost {
  border-radius: 0.6rem;
  // background-color: #9dc1e3;
  border: 0.15rem dashed $grey-5;
}
.chosen {
  border-radius: 0.6rem;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12);
}
.ghost .widget-card {
  background: #f6f2ef7a !important;
  border-radius: 0.6rem;
}
.widget-card:before {
  content: "";
  display: block;
  padding-top: 128% !important;
}
.widget-card {
  width: 100%;
}
@media (min-width: $breakpoint-xs-max) {
  .widget-card {
    width: 11rem !important;
    display: block;
  }
}
</style>
