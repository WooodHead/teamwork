<template>
  <div>
    <slot name='title'></slot>
    <!-- 团队成员 -->
    <div
      class="q-gutter-xs"
      :class="align"
    >
      <tw-avatar
        v-for="id in showedMembers"
        :key="id"
        :id="id"
        :size="size"
        :fontSize="fontSize"
      />
      <q-avatar
        v-if="moreMembers>0"
        :size="size"
        :font-size="fontSize"
        text-color="grey-7"
        class="cursor-pointer"
        @click="showedMemberNum+=50"
        style="border:1px solid #757575;"
      >+{{moreMembers}}
      </q-avatar>
      <slot name='serviceConnector'></slot>
      <q-btn
        v-if="showButton"
        outline
        rounded
        color="primary"
        :label="buttonLabel||$t('base.addOrRemoveTeamer')"
        @click="addOrRemovePeople"
      />
    </div>
    <!-- 团队成员弹窗 -->
    <q-dialog
      v-model="showSelect"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <person-select-panel
        style="width: 600px; max-width: 90vw;"
        @multiSelect="multiSelect"
        :isVirtualScroll="true"
        :multiple="true"
        :initPersonScope="initPersonScope"
        :initSelectedPersonIDs="members.map(item=>{return +item})"
        :quickSelected="quickSelected"
      />
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'ResourceTeamView',
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    PersonSelectPanel: () => import('components/person/PersonSelectPanel')
  },
  props: {
    members: { type: Array, default: () => [] },
    category: { type: String, required: false },
    objectID: { type: Number, required: false },
    align: {
      type: String,
      required: false,
      default: 'text-center0'
    },
    quickSelected: {
      type: Object,
      required: false,
      default: null,
      description: '快捷选中指定人员 eg：{title:"项目成员",personIDs:[292,1,2]}'
    },
    initPersonScope: {
      type: Array,
      required: false,
      default: function () {
        return []
      },
      description: '初始人员选择范围IDs'
    },
    size: {
      type: String,
      required: false,
      default: 'lg',
      description: '头像大小'
    },
    fontSize: {
      type: String,
      required: false,
      default: '0.8rem',
      description: '头像字体大小'
    },
    showPanel: {
      type: String,
      default: 'personSelect',
      description: '点击新建/移除按钮时弹出用户选择界面(personSelect)还是选择职位界面(memberIdentify)'
    },
    identify: {
      type: String,
      default: '',
      description: '成员职责'
    },
    showButton: {
      type: Boolean,
      default: true,
      description: '是否显示添加/移除按钮'
    },
    buttonLabel: {
      type: String,
      default: '',
      description: '默认为添加/移除按钮'
    }
  },
  data () {
    return {
      showSelect: false,
      showedMemberNum: 20
    }
  },
  methods: {
    ...mapActions('service', ['updateStatus']),
    multiSelect (selectedTeamers) {
      // 回调
      this.showSelect = false
      this.$emit('updateMembers', selectedTeamers.map(t => t.id), this.identify)
    },
    addOrRemovePeople () {
      if (this.showPanel === 'personSelect') {
        this.showSelect = true
      } else {
        this.$router.push({
          name: 'member',
          params: { objectID: +this.objectID, category: this.category }
        })
      }
    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    model () {
      return this.$store.getters[`${this.category}/${this.category}`](+this.objectID)
    },
    inserviceMembers () {
      return _.filter(this.members, m => this.selectPersons[m] && this.selectPersons[m].isInService)
    },
    showedMembers () {
      return _.slice(this.inserviceMembers, 0, this.showedMemberNum)
    },
    moreMembers () {
      return this.inserviceMembers.length - this.showedMemberNum
    }
  }
}
</script>

<style scoped>
</style>
