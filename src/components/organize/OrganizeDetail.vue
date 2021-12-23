<template>
  <resource-layout
    category='organize'
    :objectID='+newId'
    :categoryModel="model"
    :showMenu="!!$myinfo.auth.role.isSystemAdministrator"
  >
    <template #aboveTitle>
      <q-avatar
        size="60px"
        class="cursor-pointer q-mb-sm"
        title="点击查看机构树"
        @click.stop="isShowDialog = true"
      >
        <q-img color="red" :src="$logo['logo.png']" />
      </q-avatar>
      <q-dialog
        v-model="isShowDialog"
        :position="position"
      >
        <tw-tree
          dense
          outlined
          :nodes="(!$myinfo.auth.role.isSystemAdministrator&&!$myinfo.auth.role.isSeniorManager)?selectOrganizesRelationTree($myinfo.organizeId):selectOrganizesTree"
          node-key="id"
          label-key="name"
          :multiple="false"
          :selected="newId"
          @selected-event="getSelected"
        />
      </q-dialog>
    </template>
    <template #subtitle>
      <span class="organizeAddress">{{model.organizeAddress&& model.organizeAddress.value? '地址:'+model.organizeAddress.value.name+'---'+model.organizeAddress.value.address : ''}}</span>
    </template>
    <!--展示公司类型-->
    <template #titleBadge>
      <q-badge
        color="orange"
        align="top"
        class="q-pa-xs q-mr-md"
      >
        {{organizeTypeData&&organizeTypeData.find(o=>o.dictKey === String(model.type))&&organizeTypeData.find(o=>o.dictKey ===String(model.type)).dictValue}}
      </q-badge>
    </template>
  </resource-layout>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'OrganizeDetail',
  props: {
    id: {
      type: [String, Number],
      require: true
    }
  },
  data () {
    return {
      newId: this.id,
      isShowDialog: false,
      position: 'bottom'
    }
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    ...mapGetters('organize', ['selectOrganizesTree', 'selectOrganizesRelationTree']),
    model: {
      get () {
        return this.$store.getters['organize/organize'](+this.newId)
      }
    },
    organizeTypeData () {
      return this.dictionary['organize'] ? this.dictionary['organize']['organizeType'] : []
    }
  },
  created () {
    this.loadOrganize(+this.newId)
    this.loadDictionarys('organize')
  },
  methods: {
    ...mapActions('organize', ['loadOrganize']),
    ...mapActions('dictionary', ['loadDictionarys']),
    getSelected (selectedOrganizes) {
      this.loadOrganize(selectedOrganizes[0].id).then(res => {
        this.isShowDialog = false
        this.newId = +res.id
        this.$router.push({
          name: 'organizeDetail',
          params: { id: res.id }
        })
      })
    }
  },
  components: {
    ResourceLayout: () => import('layouts/ResourceLayout'),
    TwTree: () => import('components/base/TwTree')
  }
}
</script>

<style lang="scss" scoped>
.organizeAddress {
  font-size: 16px;
}
</style>
