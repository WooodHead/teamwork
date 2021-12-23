<template>
  <div
    class="widget-card-section text-left full-height"
    :class="[{'folder-trash-card': model.classify === 'folder'}, model.color]"
  >
    <!-- 任务卡片 -->
    <div
      class="text-body2"
      :class="[{'secrecy-content': !!model.acl}]"
    >
      <template>
        <q-scroll-area style="height: 180px; max-width: 300px;">
          <!-- 文件夹 -->
          <q-card-section
            v-if="model.classify === 'folder'"
            class="q-pa-none full-height"
            @click.stop="()=>0"
          >
            <div :class="{'archived':model.archived}">
              <q-card-section :class="['q-pb-none',{'q-pt-sm':$q.screen.lt.sm}]">
                <div
                  style="overflow: inherit;"
                  class="text-subtitle2 text-weight-bold text-center q-pt-md"
                >
                  {{model.title}}
                </div>
              </q-card-section>

              <!-- 内容区 -->
              <q-card-section class="q-pt-xs">
                <div class="q-gutter-sm text-left">
                  <div
                    v-for="(element,index) in children"
                    :key="index"
                  >
                    <q-icon
                      name="folder"
                      color="amber"
                      v-if="element.classify=='folder'"
                    />
                    {{element.title}}
                    <q-img
                      v-if="imgExts.includes(element.extension.toLowerCase())&&element.classify==='file'"
                      clickable
                      :src="getUrl(element.filePath)"
                      :ratio="9/12"
                      class="rounded-borders"
                    />
                    <span v-else-if="['file','link'].includes(element.classify)">{{`(${element.extension||element.classify})`}}</span>
                    <q-separator dark />
                  </div>
                </div>
              </q-card-section>
            </div>
          </q-card-section>
          <!-- 文档 -->
          <q-card-section
            v-else
            class="q-pa-none"
          >
            <div class="absolute-top text-center trashcard-tip">{{tip}}</div>
            <!-- <document-card
              :file="model"
              class="trash-document-card"
            ></document-card> -->
            <div :class="{'archived':model.archived}">
              <!-- 线上自己创建文档 -->
              <template v-if="model.classify==='doc'||Object.keys(model).includes('noticeType')">
                <q-card-section class="q-pb-none toolsCardStyle adjustment">
                  <div
                    style="overflow: inherit;"
                    class="text-subtitle2 text-weight-bold text-center q-mt-md"
                  >
                    {{model.title}}
                  </div>
                </q-card-section>
                <q-card-section
                  v-if="model.extension==='markmap'"
                  class="q-pt-none q-px-md markmap-section"
                >
                  <mind-map
                    :code="model.content"
                    :controls='false'
                    :title="model.title"
                  />
                </q-card-section>
                <q-card-section
                  v-else
                  class="editor__content q-pt-sm"
                  v-html="model.content"
                >
                </q-card-section>
              </template>

              <!-- 创建文档链接 -->
              <template v-if="model.classify==='link'">
                <q-card-section class="adjustment text-center">
                  <attach-icon
                    :path="model.filePath"
                    :extension="model.classify"
                    class="q-mt-md"
                  />
                  <div
                    style="overflow: inherit;"
                    class="text-subtitle2 text-weight-bold q-pb-none toolsCardStyle q-mt-sm"
                  >
                    {{model.title}}
                  </div>
                  <!-- 说明 -->
                  <template v-if="model.content">
                    <q-separator
                      class="q-mt-sm q-mx-none"
                      inset
                    />
                    <p
                      v-html="model.content"
                      class="q-mt-sm"
                    ></p>
                  </template>
                </q-card-section>
              </template>

              <template v-if="model.classify==='file'">
                <q-card-section class="adjustment text-center">
                  <attach-icon
                    snapshotOnly
                    :path="model.filePath"
                    :extension="model.extension"
                    :snapshotPath="model.snapshotPath"
                    class="document-fileCard q-mt-md"
                  />
                  <div
                    style="overflow: inherit;word-wrap: break-word;"
                    class="text-subtitle2 text-weight-bold q-pb-none toolsCardStyle q-mt-sm"
                  >
                    <template v-if="imgExts.includes(model.extension.toLowerCase())">
                      {{model.title}}{{`(${model.extension})`}}
                    </template>
                    <template v-else>
                      {{model.title}}
                    </template>
                  </div>
                  <!-- 说明 -->
                  <template v-if="model.content">
                    <q-separator
                      class="q-mt-sm"
                      inset
                    />
                    <p
                      v-html="model.content"
                      class="q-mt-sm tiptap-content editor__content"
                    ></p>
                  </template>
                </q-card-section>
              </template>
            </div>
          </q-card-section>
        </q-scroll-area>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUrl } from '@/boot/file'
export default {
  name: 'DocumentTrashCard',
  props: {
    model: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  components: {
    AttachIcon: () => import('components/attach/AttachIcon'),
    MindMap: () => import('components/document/markmap/MindMap')
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('file', ['imgExts']),
    tip () {
      let back = ''
      switch (this.model.classify) {
        case 'doc': back = '文档'; break
        case 'link': back = '链接'; break
        case 'file': back = '文件'; break
      }
      return back
    },
    children () {
      const data = _.filter(this.model.children, item => { return !item.archived && item.isPublish })
      return _.orderBy(data, [_.camelCase(this.sort)], ['desc'])
    }
  },
  methods: {
    getUrl
  }
}
</script>

<style scoped lang="scss">
/deep/ .q-checkbox__bg {
  display: inline-block;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  vertical-align: middle;
}
.trash-document-card.widget-card,
.trash-folder-card.widget-card {
  width: 100% !important;
}
.folder-trash-card.bg-yellow-2 {
  background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22239%22%20viewBox%3D%220%200%20180%20239%22%3E%0A%20%20%3Cpath%20fill%3D%22rgb(253%2C252%2C206)%22%20fill-rule%3D%22evenodd%22%20d%3D%22M4%2C-1.54980961e-16%20L76.3353265%2C5.45031826e-15%20L76.3353265%2C7.10542736e-15%20C78.7053659%2C-3.85503091e-15%2080.853319%2C1.39512964%2081.816971%2C3.56041516%20L88.4388884%2C18.4395848%20L88.4388884%2C18.4395848%20C89.4025404%2C20.6048704%2091.5504935%2C22%2093.9205328%2C22%20L175%2C22%20L175%2C22%20C177.761424%2C22%20180%2C24.2385763%20180%2C27%20L180%2C235%20L180%2C235%20C180%2C237.209139%20178.209139%2C239%20176%2C239%20L4%2C239%20L4%2C239%20C1.790861%2C239%202.705415e-16%2C237.209139%200%2C235%20L8.8817842e-16%2C4%20L8.8817842e-16%2C4%20C6.17636919e-16%2C1.790861%201.790861%2C4.05812251e-16%204%2C0%20Z%22%2F%3E%0A%3C%2Fsvg%3E") !important;
  background-color: #f9f568 !important;
  background-repeat: no-repeat;
  background-size: cover !important;
}
.folder-trash-card.bg-white {
  background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22239%22%20viewBox%3D%220%200%20180%20239%22%3E%0A%20%20%3Cpath%20fill%3D%22rgb(255%2C255%2C255)%22%20fill-rule%3D%22evenodd%22%20d%3D%22M4%2C-1.54980961e-16%20L76.3353265%2C5.45031826e-15%20L76.3353265%2C7.10542736e-15%20C78.7053659%2C-3.85503091e-15%2080.853319%2C1.39512964%2081.816971%2C3.56041516%20L88.4388884%2C18.4395848%20L88.4388884%2C18.4395848%20C89.4025404%2C20.6048704%2091.5504935%2C22%2093.9205328%2C22%20L175%2C22%20L175%2C22%20C177.761424%2C22%20180%2C24.2385763%20180%2C27%20L180%2C235%20L180%2C235%20C180%2C237.209139%20178.209139%2C239%20176%2C239%20L4%2C239%20L4%2C239%20C1.790861%2C239%202.705415e-16%2C237.209139%200%2C235%20L8.8817842e-16%2C4%20L8.8817842e-16%2C4%20C6.17636919e-16%2C1.790861%201.790861%2C4.05812251e-16%204%2C0%20Z%22%2F%3E%0A%3C%2Fsvg%3E") !important;
  background-size: cover !important;
  background-color: #e6e6e6 !important;
}
.folder-trash-card.bg-green-2 {
  background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22239%22%20viewBox%3D%220%200%20180%20239%22%3E%0A%20%20%3Cpath%20fill%3D%22rgb(228%2C248%2C226)%22%20fill-rule%3D%22evenodd%22%20d%3D%22M4%2C-1.54980961e-16%20L76.3353265%2C5.45031826e-15%20L76.3353265%2C7.10542736e-15%20C78.7053659%2C-3.85503091e-15%2080.853319%2C1.39512964%2081.816971%2C3.56041516%20L88.4388884%2C18.4395848%20L88.4388884%2C18.4395848%20C89.4025404%2C20.6048704%2091.5504935%2C22%2093.9205328%2C22%20L175%2C22%20L175%2C22%20C177.761424%2C22%20180%2C24.2385763%20180%2C27%20L180%2C235%20L180%2C235%20C180%2C237.209139%20178.209139%2C239%20176%2C239%20L4%2C239%20L4%2C239%20C1.790861%2C239%202.705415e-16%2C237.209139%200%2C235%20L8.8817842e-16%2C4%20L8.8817842e-16%2C4%20C6.17636919e-16%2C1.790861%201.790861%2C4.05812251e-16%204%2C0%20Z%22%2F%3E%0A%3C%2Fsvg%3E") !important;
  background-color: #cdf2c9 !important;
  background-repeat: no-repeat;
  background-size: cover !important;
}
.folder-trash-card.bg-grey-4 {
  background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22239%22%20viewBox%3D%220%200%20180%20239%22%3E%0A%20%20%3Cpath%20fill%3D%22rgb(242%2C242%2C242)%22%20fill-rule%3D%22evenodd%22%20d%3D%22M4%2C-1.54980961e-16%20L76.3353265%2C5.45031826e-15%20L76.3353265%2C7.10542736e-15%20C78.7053659%2C-3.85503091e-15%2080.853319%2C1.39512964%2081.816971%2C3.56041516%20L88.4388884%2C18.4395848%20L88.4388884%2C18.4395848%20C89.4025404%2C20.6048704%2091.5504935%2C22%2093.9205328%2C22%20L175%2C22%20L175%2C22%20C177.761424%2C22%20180%2C24.2385763%20180%2C27%20L180%2C235%20L180%2C235%20C180%2C237.209139%20178.209139%2C239%20176%2C239%20L4%2C239%20L4%2C239%20C1.790861%2C239%202.705415e-16%2C237.209139%200%2C235%20L8.8817842e-16%2C4%20L8.8817842e-16%2C4%20C6.17636919e-16%2C1.790861%201.790861%2C4.05812251e-16%204%2C0%20Z%22%2F%3E%0A%3C%2Fsvg%3E") !important;
  background-color: #e3e3e3 !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
}
.folder-trash-card.bg-brown-2 {
  background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22239%22%20viewBox%3D%220%200%20180%20239%22%3E%0A%20%20%3Cpath%20fill%3D%22rgb(238%2C226%2C215)%22%20fill-rule%3D%22evenodd%22%20d%3D%22M4%2C-1.54980961e-16%20L76.3353265%2C5.45031826e-15%20L76.3353265%2C7.10542736e-15%20C78.7053659%2C-3.85503091e-15%2080.853319%2C1.39512964%2081.816971%2C3.56041516%20L88.4388884%2C18.4395848%20L88.4388884%2C18.4395848%20C89.4025404%2C20.6048704%2091.5504935%2C22%2093.9205328%2C22%20L175%2C22%20L175%2C22%20C177.761424%2C22%20180%2C24.2385763%20180%2C27%20L180%2C235%20L180%2C235%20C180%2C237.209139%20178.209139%2C239%20176%2C239%20L4%2C239%20L4%2C239%20C1.790861%2C239%202.705415e-16%2C237.209139%200%2C235%20L8.8817842e-16%2C4%20L8.8817842e-16%2C4%20C6.17636919e-16%2C1.790861%201.790861%2C4.05812251e-16%204%2C0%20Z%22%2F%3E%0A%3C%2Fsvg%3E") !important;
  background-color: #e5d2c2 !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
}
.folder-trash-card.bg-pink-2 {
  background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22239%22%20viewBox%3D%220%200%20180%20239%22%3E%0A%20%20%3Cpath%20fill%3D%22rgb(255%2C228%2C247)%22%20fill-rule%3D%22evenodd%22%20d%3D%22M4%2C-1.54980961e-16%20L76.3353265%2C5.45031826e-15%20L76.3353265%2C7.10542736e-15%20C78.7053659%2C-3.85503091e-15%2080.853319%2C1.39512964%2081.816971%2C3.56041516%20L88.4388884%2C18.4395848%20L88.4388884%2C18.4395848%20C89.4025404%2C20.6048704%2091.5504935%2C22%2093.9205328%2C22%20L175%2C22%20L175%2C22%20C177.761424%2C22%20180%2C24.2385763%20180%2C27%20L180%2C235%20L180%2C235%20C180%2C237.209139%20178.209139%2C239%20176%2C239%20L4%2C239%20L4%2C239%20C1.790861%2C239%202.705415e-16%2C237.209139%200%2C235%20L8.8817842e-16%2C4%20L8.8817842e-16%2C4%20C6.17636919e-16%2C1.790861%201.790861%2C4.05812251e-16%204%2C0%20Z%22%2F%3E%0A%3C%2Fsvg%3E") !important;
  background-color: #ffc5ee !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
}
.folder-trash-card.bg-blue-2 {
  background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22239%22%20viewBox%3D%220%200%20180%20239%22%3E%0A%20%20%3Cpath%20fill%3D%22rgb(225%2C239%2C252)%22%20fill-rule%3D%22evenodd%22%20d%3D%22M4%2C-1.54980961e-16%20L76.3353265%2C5.45031826e-15%20L76.3353265%2C7.10542736e-15%20C78.7053659%2C-3.85503091e-15%2080.853319%2C1.39512964%2081.816971%2C3.56041516%20L88.4388884%2C18.4395848%20L88.4388884%2C18.4395848%20C89.4025404%2C20.6048704%2091.5504935%2C22%2093.9205328%2C22%20L175%2C22%20L175%2C22%20C177.761424%2C22%20180%2C24.2385763%20180%2C27%20L180%2C235%20L180%2C235%20C180%2C237.209139%20178.209139%2C239%20176%2C239%20L4%2C239%20L4%2C239%20C1.790861%2C239%202.705415e-16%2C237.209139%200%2C235%20L8.8817842e-16%2C4%20L8.8817842e-16%2C4%20C6.17636919e-16%2C1.790861%201.790861%2C4.05812251e-16%204%2C0%20Z%22%2F%3E%0A%3C%2Fsvg%3E") !important;
  background-color: #c5e0f9 !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
}
.folder-trash-card.bg-orange-1 {
  background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22239%22%20viewBox%3D%220%200%20180%20239%22%3E%0A%20%20%3Cpath%20fill%3D%22rgb(255%2C240%2C219)%22%20fill-rule%3D%22evenodd%22%20d%3D%22M4%2C-1.54980961e-16%20L76.3353265%2C5.45031826e-15%20L76.3353265%2C7.10542736e-15%20C78.7053659%2C-3.85503091e-15%2080.853319%2C1.39512964%2081.816971%2C3.56041516%20L88.4388884%2C18.4395848%20L88.4388884%2C18.4395848%20C89.4025404%2C20.6048704%2091.5504935%2C22%2093.9205328%2C22%20L175%2C22%20L175%2C22%20C177.761424%2C22%20180%2C24.2385763%20180%2C27%20L180%2C235%20L180%2C235%20C180%2C237.209139%20178.209139%2C239%20176%2C239%20L4%2C239%20L4%2C239%20C1.790861%2C239%202.705415e-16%2C237.209139%200%2C235%20L8.8817842e-16%2C4%20L8.8817842e-16%2C4%20C6.17636919e-16%2C1.790861%201.790861%2C4.05812251e-16%204%2C0%20Z%22%2F%3E%0A%3C%2Fsvg%3E") !important;
  background-color: #ffe3bc !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
}
.folder-trash-card.bg-red-1 {
  background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22239%22%20viewBox%3D%220%200%20180%20239%22%3E%0A%20%20%3Cpath%20fill%3D%22rgb(255%2C229%2C229)%22%20fill-rule%3D%22evenodd%22%20d%3D%22M4%2C-1.54980961e-16%20L76.3353265%2C5.45031826e-15%20L76.3353265%2C7.10542736e-15%20C78.7053659%2C-3.85503091e-15%2080.853319%2C1.39512964%2081.816971%2C3.56041516%20L88.4388884%2C18.4395848%20L88.4388884%2C18.4395848%20C89.4025404%2C20.6048704%2091.5504935%2C22%2093.9205328%2C22%20L175%2C22%20L175%2C22%20C177.761424%2C22%20180%2C24.2385763%20180%2C27%20L180%2C235%20L180%2C235%20C180%2C237.209139%20178.209139%2C239%20176%2C239%20L4%2C239%20L4%2C239%20C1.790861%2C239%202.705415e-16%2C237.209139%200%2C235%20L8.8817842e-16%2C4%20L8.8817842e-16%2C4%20C6.17636919e-16%2C1.790861%201.790861%2C4.05812251e-16%204%2C0%20Z%22%2F%3E%0A%3C%2Fsvg%3E") !important;
  background-color: #ffc6c6 !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
}
.folder-trash-card.bg-indigo-1 {
  background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22239%22%20viewBox%3D%220%200%20180%20239%22%3E%0A%20%20%3Cpath%20fill%3D%22rgb(242%2C237%2C255)%22%20fill-rule%3D%22evenodd%22%20d%3D%22M4%2C-1.54980961e-16%20L76.3353265%2C5.45031826e-15%20L76.3353265%2C7.10542736e-15%20C78.7053659%2C-3.85503091e-15%2080.853319%2C1.39512964%2081.816971%2C3.56041516%20L88.4388884%2C18.4395848%20L88.4388884%2C18.4395848%20C89.4025404%2C20.6048704%2091.5504935%2C22%2093.9205328%2C22%20L175%2C22%20L175%2C22%20C177.761424%2C22%20180%2C24.2385763%20180%2C27%20L180%2C235%20L180%2C235%20C180%2C237.209139%20178.209139%2C239%20176%2C239%20L4%2C239%20L4%2C239%20C1.790861%2C239%202.705415e-16%2C237.209139%200%2C235%20L8.8817842e-16%2C4%20L8.8817842e-16%2C4%20C6.17636919e-16%2C1.790861%201.790861%2C4.05812251e-16%204%2C0%20Z%22%2F%3E%0A%3C%2Fsvg%3E") !important;
  background-color: #dcceff !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
}
.folder-trash-card {
  background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22239%22%20viewBox%3D%220%200%20180%20239%22%3E%0A%20%20%3Cpath%20fill%3D%22rgb(255%2C255%2C255)%22%20fill-rule%3D%22evenodd%22%20d%3D%22M4%2C-1.54980961e-16%20L76.3353265%2C5.45031826e-15%20L76.3353265%2C7.10542736e-15%20C78.7053659%2C-3.85503091e-15%2080.853319%2C1.39512964%2081.816971%2C3.56041516%20L88.4388884%2C18.4395848%20L88.4388884%2C18.4395848%20C89.4025404%2C20.6048704%2091.5504935%2C22%2093.9205328%2C22%20L175%2C22%20L175%2C22%20C177.761424%2C22%20180%2C24.2385763%20180%2C27%20L180%2C235%20L180%2C235%20C180%2C237.209139%20178.209139%2C239%20176%2C239%20L4%2C239%20L4%2C239%20C1.790861%2C239%202.705415e-16%2C237.209139%200%2C235%20L8.8817842e-16%2C4%20L8.8817842e-16%2C4%20C6.17636919e-16%2C1.790861%201.790861%2C4.05812251e-16%204%2C0%20Z%22%2F%3E%0A%3C%2Fsvg%3E");
  background-size: cover;
  background-color: #e6e6e6;
  width: 100%;
}
.markmap-section /deep/.q-carousel__slide {
  padding-top: 0;
}

.secrecy-content {
  background-size: 80%;
}

/deep/.scroll > div {
  height: 100%;
}
@media (max-width: $breakpoint-xs-max) {
  .markmap-section /deep/.q-carousel__slide {
    padding: 0 !important;
  }
}
</style>
