<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <tw-header-card
      :title="$t('member.whichMember',{which:$t(`${category}.title`)})"
      v-if="!guide"
    />
    <q-list class="q-px-xxl">
      <template v-for="identify in identifyList">
        <q-item-label
          header
          :key="'header'+identify"
        >
          <tw-group-header
            :title="$t(`member.${identify}`)"
            titleClass="text-h6"
            :leftBtn="identify!=='leader'?{
                icon:'add',
                size:'sm',
                color:'positive',
                label:$t(`member.add`),
                click:()=>addBtnClickEvent(identify)}:null"
          />
        </q-item-label>
        <q-item :key="'content'+identify">
          <q-item-section>
            <member-form
              class="q-mx-lg"
              v-if="showMemberForm&&selectIdentify===identify"
              :psonID="psonID"
              :objectID="objectID"
              :category="category"
              :psonIDs="identifyGroup[identify]&&identifyGroup[identify].map(item=>item.psonID)"
              @ok="updateMembers"
              @cancel="()=>{showMemberForm = false,selectIdentify='';psonID=0}"
            />
            <q-list class="row text-left q-px-md">
              <q-item
                class="q-pt-md col-12 col-md-6"
                v-for="member in identifyGroup[identify]"
                :key="member.psonID"
              >
                <q-item-section
                  avatar
                  top
                >
                  <tw-avatar :id="member.psonID" />
                </q-item-section>
                <q-item-section top>
                  <q-item-label lines="1">
                    <span class="text-grey-8">{{member.name}}</span>
                  </q-item-label>
                  <q-item-label
                    caption
                    lines="1"
                  >
                    <span
                      v-if="member.notes===''"
                      class="text-grey-6"
                    >职责描述</span>
                    <span
                      v-else
                      class="text-grey-8"
                    >{{member.notes}}</span>
                    <q-icon
                      class="cursor-pointer absolute"
                      name="edit"
                    >
                      <q-popup-edit
                        :content-style="{width:'400px'}"
                        v-model="member.notes"
                        :ref="identify+member.psonID"
                      >
                        <template v-slot="{ emitValue }">
                          <q-input
                            autofocus
                            dense
                            counter
                            :maxlength="20"
                            :value="member.notes"
                            hint="职责描述"
                            @input="emitValue"
                            @keydown.enter.prevent.capture="setNotes(identify+member.psonID,member)"
                          >
                            <template v-slot:after>
                              <q-btn
                                flat
                                dense
                                color="positive"
                                icon="check_circle"
                                @click.stop="setNotes(identify+member.psonID,member)"
                              />
                            </template>
                          </q-input>
                        </template>
                      </q-popup-edit>
                    </q-icon>
                  </q-item-label>
                  <q-item-label
                    lines="1"
                    class="text-grey-8"
                  >
                    <div v-if="['customer'].includes(category) && identify === 'client' && model.classify">
                      <q-btn
                        size="12px"
                        @click.stop="removeMemberPerson(identifyGroup[identify],member,identify)"
                        class="text-primary"
                        no-caps
                        :label="$t(`member.remove`)"
                        :disable="identify==='leader'"
                        flat
                        dense
                      /> •
                      <q-btn
                        @click.stop="()=>{selectIdentify = identify; showMemberForm = true;psonID = member.psonID}"
                        size="12px"
                        class="text-primary"
                        no-caps
                        :label="$t(`member.edit`)"
                        flat
                        dense
                      />
                    </div>
                    <div v-else>
                      <q-btn
                        size="12px"
                        @click.stop="removeMember(identifyGroup[identify],member.id,identify)"
                        class="text-primary"
                        no-caps
                        :label="$t(`member.remove`)"
                        :disable="identify==='leader'"
                        flat
                        dense
                      /> •
                      <q-btn
                        size="12px"
                        @click.stop="inviteTo(member.psonID)"
                        class="text-primary"
                        no-caps
                        :label="$t(`member.inviteToJoin`)"
                        flat
                        dense
                      />
                    </div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
    <!-- 添加人员弹框 -->
    <q-dialog
      v-model="showSelect"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <person-select-panel
        style="width: 600px; max-width: 90vw;"
        @multiSelect="updateMembers"
        :isVirtualScroll="true"
        :multiple="true"
        :initSelectedPersonIDs="initSelectedPersonIDs"
        :specificParam="specificParam"
      />
    </q-dialog>
  </q-card>
</template>

<script>
import { format } from 'quasar'
const { capitalize } = format
import { mapActions } from 'vuex'
import { i18n } from '@/boot/i18n'
import { showConfirm } from '@/utils/show-confirm'
import { showSuccessMessage } from '@/utils/show-message'
export default {
  name: 'MemberIndex',
  props: {
    category: {
      type: String,
      required: true
    },
    objectID: {
      type: [String, Number],
      required: true
    },
    guide: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showSelect: false,
      selectIdentify: '',
      initSelectedPersonIDs: [],
      showMemberForm: false,
      psonID: 0
    }
  },
  created () {
    this.loadMembers({ category: this.category, objectID: +this.objectID, types: _.join(this.identifyList, ',') })
    this.$store.dispatch(`${this.category}/load${capitalize(this.category)}`, this.objectID)
  },
  computed: {
    model () {
      return this.$store.getters[`${this.category}/${this.category}`](+this.objectID)
    },
    identifyList () {
      return this.$store.state.member.identifyList[this.category]
    },
    identifyGroup () {
      const members = this.$store.state.member.members[`${this.category}_${this.objectID}`]
      const selectPersons = this.$store.state.person.selectPersons
      if (members && members.length > 0 && Object.keys(selectPersons).length > 0) {
        // 按照人员姓名排序
        let cloneMembers = _.filter(_.cloneDeep(members), n => selectPersons[n.psonID] && selectPersons[n.psonID].isInService)
        cloneMembers.forEach(key => {
          key.name = (selectPersons[key.psonID] && selectPersons[key.psonID].name) || ''
          key.pinyin = (selectPersons[key.psonID] && selectPersons[key.psonID].pinyin) || ''
          key.dutyLevel = (selectPersons[key.psonID] && selectPersons[key.psonID].dutyLevel) || ''
        })
        cloneMembers = _.orderBy(cloneMembers, ['dutyLevel', 'pinyin'], ['asc', 'asc'])
        // 按照职责进行分组
        return _.groupBy(cloneMembers, 'duty')
      } else {
        return {}
      }
    },
    specificParam () {
      if (this.category === 'project') {
        return { objectID: this.objectID, objectType: this.category, identify: this.selectIdentify }
      } else {
        return null
      }
    },
    personName () {
      return psonId => {
        const selectPersons = this.$store.state.person.selectPersons
        return (selectPersons && selectPersons[psonId] && selectPersons[psonId].name) || ''
      }
    }
  },
  methods: {
    ...mapActions('member', ['loadMembers', 'updateMemberField', 'inviteToJoin']),
    addBtnClickEvent (identify) {
      this.selectIdentify = identify
      if (['customer'].includes(this.category) && identify === 'client' && this.model.isOutCustomer) {
        this.showSelect = false
        this.showMemberForm = true
        this.psonID = 0
      } else {
        this.showSelect = true
        this.showMemberForm = false
        this.initSelectedPersonIDs = _.map(this.identifyGroup[identify], 'psonID')
      }
    },
    updateMembers (persons) {
      var personIDs = _.map(persons, 'id')
      this.$store.dispatch(`${this.category}/update${capitalize(this.category)}Members`, { id: +this.objectID, personIDs: personIDs, identify: this.selectIdentify })
        .then(res => {
          if (res) {
            // 重新获取最新的members
            this.loadMembers({ category: this.category, objectID: +this.objectID, types: _.join(this.identifyList, ',') })
            // 关闭更新的表单、弹框
            this.showSelect = false
            this.showMemberForm = false
          }
        })
    },
    setNotes (ref, member) {
      this.$refs[ref][0].set()
      this.updateMemberField({ Id: member.id, fieldName: 'Notes', fieldValue: member.notes }).then(res => {
        showSuccessMessage('更新成功！')
      })
    },
    removeMember (members, id, identify) {
      var _this = this
      showConfirm('确定要移除该成员？', () => {
        var arrayMembers = _.pull(members, _.find(members, m => m.id === id))
        var psonIds = _.map(arrayMembers, 'psonID')
        _this.$store.dispatch(`${_this.category}/update${capitalize(_this.category)}Members`, { id: +_this.objectID, personIDs: psonIds, identify: identify })
          .then(res => {
            _this.loadMembers({ category: _this.category, objectID: +_this.objectID, types: _.join(_this.identifyList, ',') })
          })
      })
    },
    inviteTo (psonId) {
      this.inviteToJoin({ psonId, module: this.model }).then(res => {
        if (res) {
          this.$q.notify({
            color: 'blue-grey-10',
            textColor: 'white',
            icon: 'check',
            message: this.personName(psonId) + ' ' + this.$t(`member.invitedMsg`),
            position: 'top',
            timeout: 3000
          })
        }
      })
    },
    removeMemberPerson (members, member, identify) {
      let _this = this
      showConfirm(i18n.t(`person.confirmDelete`), () => {
        _this.$store.dispatch(`person/deletePersons`, member.psonID).then(res => {
          var arrayMembers = _.pull(members, _.find(members, m => m.id === member.id))
          var psonIds = _.map(arrayMembers, 'psonID')
          _this.$store.dispatch(`${_this.category}/update${capitalize(_this.category)}Members`, { id: +_this.objectID, personIDs: psonIds, identify: identify })
            .then(res => {
              _this.loadMembers({ category: _this.category, objectID: +_this.objectID, types: _.join(_this.identifyList, ',') })
            })
        })
      })
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwGroupHeader: () => import('components/base/TwGroupHeader'),
    PersonSelectPanel: () => import('components/person/PersonSelectPanel'),
    MemberForm: () => import('components/member/MemberForm')
  }
}
</script>

<style scoped lang="scss">
/deep/.q-btn--dense .q-btn__wrapper {
  padding: 0;
}
</style>
