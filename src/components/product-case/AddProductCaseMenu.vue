<!--
@Name：新增菜单
@Author：陆欢
@date：2021/10/29
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <div>
    <q-btn
      unelevated
      icon="add"
      label="新增/发布"
      title="新增"
      class="cursor-pointer"
      color="positive"
      text-color="white"
      rounded
    >
      <q-menu auto-close>
        <q-list>
          <div
            v-for="item in addListCanSee"
            :key="item.key"
          >
            <q-separator
              v-if="item.key === 'linkdoc'"
              spaced
            />
            <q-item
              clickable
              v-close-popup
              @click="item.click"
              color="primary"
            >
              <q-item-section avatar>
                <q-icon :name="item.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
import { showSuccessMessage, showWarningMessage } from '@/utils/show-message'
// import { i18n } from '@/boot/i18n'
export default {
  name: 'FolderAddMenu',
  props: {
    id: { type: [Number, String], default: 0, required: false }
  },
  data () {
    return {
    }
  },
  mounted () {
    // 1、获取对应的字典类型
    this.loadDictionarys('productCase')
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    dictionarys () {
      return this.dictionary['productCase']
        ? this.dictionary['productCase']['type']
        : []
    },
    model () {
      return this.$store.getters['document/currentModel'](+this.id)
    },
    addListCanSee () {
      let addList = [
        {
          key: 'publish',
          icon: 'note_add',
          label: this.$t('productCase.publish'),
          click: () => {
            this.publish()
          }
        }
      ]
      _(this.dictionarys).forEach(element => {
        addList.push({
          key: element.dictKey,
          icon: 'note_add',
          label: `新增${element.dictValue}`,
          click: () => {
            this.openEditPage(element.dictValue)
          }
        })
      })
      return addList
    }
  },
  methods: {
    ...mapActions('document', ['addEmptyFolder', 'updateDocumentField']),
    ...mapActions('dictionary', ['loadDictionarys']),
    openEditPage (fileTag) {
      this.$router.push({
        name: 'fileUpload',
        params: { id: +this.id, fileTag, category: 'productCase' }
      })
    },
    publish () {
      if (!this.model.isPublish) {
        showConfirm('确定要发布吗？', () => { this.uploadSnapshotPath() })
      } else {
        showWarningMessage('已发布的不能再次发布')
      }
    },
    uploadSnapshotPath () {
      showConfirm('确定上传封面吗？', () => { this.uploadSnapshotPathConfirm() }, () => { this.directPublish() })
    },
    uploadSnapshotPathConfirm () {
      this.$refs.uploadFile.$refs.qUploader.pickFiles()
    },
    directPublish () {
      let fields = {
        DocID: +this.id,
        IsPublish: 1
      }
      this.updateDocumentField(fields)
        .then(() => {
          showSuccessMessage('发布成功')
        })
    }
  },
  components: {
  }
}
</script>

<style scoped></style>
