<template>
  <q-card
    class="q-pa-md"
    style="max-width: 350px"
  >
    <q-form
      @submit="submit"
      @reset.native="cancel"
    >
      <q-input
        v-model="orgName"
        :label="$t('contacts.organize.name')"
        lazy-rules
        :rules="[ val => val && val.trim().length>0 || '请输入名称']"
      />
      <q-input
        v-model="orgShortName"
        :label="$t('contacts.organize.simpleName')"
      />
      <div class="q-pt-md">
        <q-btn
          :label="$t('action.save')"
          type="submit"
          color="primary"
        />
        <q-btn
          :label="$t('action.cancel')"
          type="reset"
          color="primary"
          class="q-ml-sm"
          flat
        />
      </div>
    </q-form>
  </q-card>
</template>
<script>
import { mapActions } from 'vuex'
import Guide from '@/store/guide/model'
export default {
  data () {
    return {
      orgName: this.organize.name,
      orgShortName: this.organize.shortName,
      acl: this.organize.acl,
      guideModel: new Guide()
    }
  },
  props: {
    organize: {
      type: Object,
      required: false,
      default: () => {
        return {
          id: 0,
          parentId: 0,
          path: '',
          level: 0,
          name: '',
          shortName: ''
        }
      }
    },
    showForm: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    widgets () {
      return this.$store.getters['resource/initWidgets']('organize')
    }
  },
  mounted () {
    // 初始化设置卡片
    this.initWidgets()
  },
  methods: {
    ...mapActions('organize', ['updateOrganize']),
    ...mapActions('resource', ['loadCategory']),
    ...mapActions('guide', ['addGuide']),
    submit () {
      this.organize.name = this.orgName
      this.organize.shortName = this.orgShortName
      this.updateOrganize(this.organize).then(res => {
        if (res) {
          Object.assign(this.guideModel, { objectID: res.id, objectType: 'organize', owner: res.leaderID })
          this.addGuide(this.guideModel)
          this.$emit('update:showForm', false)
        }
      })
    },
    cancel () {
      this.$emit('update:showForm', false)
    },
    initWidgets () {
      if (Object.keys(this.widgets).length) {
        this.organize.widgets = this.widgets
      } else {
        let that = this
        this.loadCategory('organize').then(category => {
          that.organize.widgets = that.widgets
        })
      }
    }
  }
}
</script>
<style scoped>
</style>
