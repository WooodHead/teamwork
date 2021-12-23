<template>
  <q-card
    :style="isDialog?'width: 600px; max-width: 100vw;':''"
    :class="isDialog?'':'q-pa-none no-border no-border-radius no-shadow'"
  >
    <q-card-section v-if="isDialog">
      <div class="text-subtitle1">{{$t("base.selectPersonByGroup")}}</div>
    </q-card-section>
    <q-separator v-if="isDialog" />
    <q-card-section
      :style="isDialog?'min-height: 30vh;max-height: 50vh;':''"
      class="scroll"
      :class="isDialog?'':'q-pa-none no-border no-border-radius no-shadow'"
    >
      <q-list v-if="newGroups.length > 0">
        <q-item
          clickable
          v-for="group in newGroups"
          :key="group.id"
        >
          <q-item-section
            v-close-popup="isDialog"
            @click="$emit('select',group.members)"
          >
            <q-item-label :title="group.notes">{{group.name}}</q-item-label>
            <div class="q-gutter-sm q-pt-sm">
              <tw-avatar
                size="md"
                v-for="member in group.members.slice(0 , group.showMemberCount)"
                :key="member"
                :id="member"
                :name="objPersons[member]&&objPersons[member].name"
                :img="objPersons[member]&&objPersons[member].img"
              />
              <q-avatar
                v-if="group.members.length>group.showMemberCount&&group.members.length>999"
                size="md"
                color="primary"
                text-color="white"
                icon="more_horiz"
                v-ripple
                @click.stop="group.showMemberCount=group.members.length"
              >
                <q-tooltip>{{$t("base.showAllMembers")}}</q-tooltip>
              </q-avatar>
              <q-avatar
                v-if="group.members.length>group.showMemberCount&&group.members.length<1000"
                size="md"
                color="secondary"
                text-color="white"
                v-ripple
                @click.stop="group.showMemberCount=group.members.length"
              >
                <span class="text-caption">{{'+'+(group.members.length-group.showMemberCount)}}</span>
                <q-tooltip>{{$t("base.showAllMembers")}}</q-tooltip>
              </q-avatar>
            </div>
          </q-item-section>
          <q-item-section
            side
            top
          >
            <tw-menu
              flat
              :menus="menus"
              @edit="editGroup(group)"
              @delete="delGroup(group.id)"
            />
          </q-item-section>
        </q-item>
      </q-list>
      <q-banner
        v-else
        class="bg-grey-3"
      >
        <template v-slot:avatar>
          <q-icon
            name="people_outline"
            color="primary"
          />
        </template>
        {{ $t("base.noGroup") }}
      </q-banner>
      <q-btn
        v-if="!adding"
        outline
        label="新建"
        color="primary"
        icon="group_add"
        @click="openAdd"
        class="q-mt-md q-ml-md"
      />
      <tw-group-add
        v-if="adding"
        :id="id"
        @ok="add"
        @cancel="adding=false"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import Vue from 'vue'
import { LocalStorage } from 'quasar'
import { mapActions } from 'vuex'
const defaultShowMemberCount = 7
export default {
  name: 'TwGroupPerson',
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    TwGroupAdd: () => import('components/base/TwGroupAdd'),
    TwMenu: () => import('components/base/TwMenu')
  },
  props: {
    objPersons: {
      type: Object,
      required: true
    },
    isDialog: {
      type: Boolean,
      required: false,
      default: true,
      description: '是否弹框显示'
    }
  },
  data () {
    return {
      adding: false,
      newGroups: [],
      id: '',
      menus: ['edit', 'delete']
    }
  },
  created () {
    this.init()
  },
  methods: {
    ...mapActions('group', ['loadGroups', 'updateGroup', 'updateGroupField', 'deleteGroup']),
    add (model) {
      this.updateGroup(model).then(res => {
        this.init()
        this.adding = false
      })
    },
    // 编辑群组信息
    editGroup (group) {
      this.adding = true
      this.id = group.id
    },
    // 通过id删除群组
    delGroup (id) {
      this.deleteGroup(id).then(d => {
        this.init()
        this.adding = false
      })
    },
    // 避免id被污染
    openAdd () {
      this.adding = !this.adding
      this.id = 0
    },
    // 初始化添加群组、人员页面
    init () {
      var _this = this
      const psonId = LocalStorage.getItem('myself').id
      _this.loadGroups().then(res => {
        _this.newGroups = _.filter(res, g => g.psonId === psonId)
        for (const group of _this.newGroups) {
          Vue.set(group, 'showMemberCount', defaultShowMemberCount)
        }
      })
    }
  }
}
</script>

<style>
</style>
