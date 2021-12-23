<template>
  <q-card
    flat
    bordered
    v-if="person"
    style="min-width:200px"
  >
    <q-card-section
      class="bg-blue-4 glossy-45 text-grey-1"
      style="min-height:110px;"
    >
      <!-- 操作菜单 -->
      <q-btn
        dense
        round
        flat
        v-if="showActionBtn && (person.isOutStaff||$myinfo.auth.role.isSystemAdministrator||$myinfo.auth.role.isHRSpecialist||organizeManagerPersonBtnAuth(person.id))"
        icon="more_horiz"
        class="absolute-top-right"
        style="top:5px;right:5px;"
      >
        <q-menu
          transition-show="jump-down"
          transition-hide="jump-up"
        >
          <q-list separator>
            <q-item
              v-if="person.isOutStaff||$myinfo.auth.role.isSystemAdministrator||$myinfo.auth.role.isHRSpecialist"
              clickable
            >
              <q-item-section @click.stop="editPerson(person)">编辑</q-item-section>
            </q-item>
            <q-item
              v-if="$myinfo.auth.role.isSystemAdministrator||$myinfo.auth.role.isHRSpecialist"
              clickable
            >
              <q-item-section @click.stop="delPerson(person)">删除</q-item-section>
            </q-item>
            <q-item
              v-if="!person.inService&&$myinfo.auth.role.isSystemAdministrator||$myinfo.auth.role.isHRSpecialist"
              clickable
            >
              <q-item-section @click.stop="openChangeInServiceDialog(person)">业务交接</q-item-section>
            </q-item>
            <q-item v-if="!person.isOutStaff">
              <q-item-section>
                <q-toggle
                  left-label
                  v-model="person.inService"
                  :label="person.inService?$t('person.onJob'):$t('person.leaveOffice')"
                  @input="changeInServiceState(person)"
                />
              </q-item-section>
            </q-item>
            <q-item v-if="!person.isOutStaff">
              <q-item-section>
                <q-toggle
                  left-label
                  v-model="person.activated"
                  :label="person.activated?'激活':'禁用'"
                  @input="changeActivatedState(person)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <div class="cursor-pointer absolute-bottom-left q-pl-md avatar-warper">
        <tw-avatar
          size="90px"
          fontSize="20px"
          :id="person.id"
          :name="person.name"
          :img="person.img"
          class="no-pointer-events shadow-2"
        >
          <q-badge
            v-if="!person.inService"
            color="orange"
            :label="$t('person.leaveOffice')"
            floating
          />
          <q-badge
            v-else-if="!person.activated&&person.inService"
            class="on-right"
            color="orange"
            label="禁用"
            floating
          />
        </tw-avatar>
      </div>
      <div class="text-h6 q-py-sm text-bold text-right absolute-bottom q-pr-md long-content">{{ person.name}}</div>
    </q-card-section>
    <q-card-section class="q-pa-none">
      <div class="long-content text-caption text-grey-9 text-right q-pr-md q-pt-sm">
        {{ person.dutyName}}
      </div>
      <div class="text-caption text-grey-9  text-right q-pr-md">
        {{ person.orgShortName }}
      </div>
      <q-list class="tw-list q-my-sm">
        <q-item
          clickable
          v-ripple
          tag="a"
          :href="!$q.screen.gt.xs&&dutylevelProtection(person)!=='******'&&dutylevelProtection(person)!==''?'tel:'+person.phone:'javascript:void(0);'"
        >
          <q-item-section class="text-grey-9 text-right">
            {{dutylevelProtection(person)}}
          </q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          tag="a"
          :href="'mailto:'+person.email"
        >
          <q-item-section class="text-grey-9 text-right">{{ person.email }}</q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-separator />
    <q-card-actions>
      <person-toolbar
        class="full-width"
        :id="id"
        color="indigo"
        size="md"
      />
    </q-card-actions>
  </q-card>
</template>
<script>
import { showWarningMessage, showSuccessMessage } from '@/utils/show-message'
import { showConfirm } from '@/utils/show-confirm'
import { i18n } from '@/boot/i18n'
import { mapActions } from 'vuex'
const config = require('app/app.config.js')
export default {
  name: 'PersonList',
  props: {
    id: {
      type: [Number, String],
      required: false,
      default: 0
    },
    showActionBtn: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      config
    }
  },
  created () {
    this.loadPerson(this.id)
  },
  components: {
    PersonToolbar: () => import('components/person/PersonToolbar'),
    TwAvatar: () => import('components/base/TwAvatar')
  },
  computed: {
    person () {
      return this.$store.getters['person/person'](this.id)
    },
    organizeManagerPersonBtnAuth: function () {
      return psonId => {
        return this.$myinfo.auth.role.isOrganizeManager && this.$store.getters['person/personsOfOrganize'](this.$myinfo.organizeId, false).map(m => m.id).includes(psonId)
      }
    },
    dutylevelProtection: function () {
      return person => {
        if (person && person.dutyLevel && person.dutyLevel > 0 && person.phone && person.phone.trim() !== '') {
          if (config.dutyLevelProtection) {
            return (person.dutyLevel < config.dutyLevelProtection) ? '******' : person.phone
          } else {
            return (person.dutyLevel < 6) ? '******' : person.phone
          }
        } else {
          return person.phone
        }
      }
    }
  },
  methods: {
    ...mapActions('person', ['deletePersons', 'activatedPerson', 'loadPerson', 'updateEntryOffice', 'updateLeaveOffice']),
    ...mapActions('auth', ['activatedUser']),
    editPerson (person) {
      var that = this
      // 打开维护用户信息弹框
      that.$router.push({
        name: 'personEdit',
        params: { id: person.id }
      })
    },
    delPerson (person) {
      var that = this
      // 弹出删除弹框
      showConfirm(i18n.t(`person.confirmDelete`), () => {
        that.deletePersons(person.id).then(res => {
          if (res) {
            showSuccessMessage(i18n.t(`person.deleteSuccess`))
          } else {
            showWarningMessage(i18n.t(`app.error.oopsSomethingWentWrong`))
          }
        })
      })
    },
    changeInServiceState (person) {
      if (person.inService) {
        this.updateEntryOffice({ psonId: person.id, userId: person.userId })
      } else {
        // 操作离职操作
        this.updateLeaveOffice({ psonId: person.id, userId: person.userId }).then(res => {
          // 操作离职后需要交接的业务
          res && this.openChangeInServiceDialog(person)
        })
      }
    },
    openChangeInServiceDialog (person) {
      this.$q.dialog({
        component: () => import('components/person/InServiceTransfer'),
        parent: this,
        persistent: true,
        psonID: person.id
      })
    },
    changeActivatedState (person) {
      var _this = this
      _this.activatedUser(person).then(res1 => {
        _this.activatedPerson(person)
      })
    }
  }
}
</script>
<style lang="sass" scoped>
.tw-list .q-item
  min-height: 30px
  min-width: 230px
.avatar-warper
  display: inline-block
  bottom: -30px
  z-index: 1
.glossy-45
  background-image: linear-gradient(45deg, rgba(#fff, .3), rgba(#fff, 0) 50%, rgba(#000, .12) 100%, rgba(#000, .04)) !important
.long-content
  padding-left: 106px
  line-height: 1.5rem
</style>
