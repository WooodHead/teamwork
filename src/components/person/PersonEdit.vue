<template>
  <tw-form @primary="onSubmit">
    <div class="row justify-center q-pb-md">
      <avatar-crop
        size="120px"
        :img-src.sync="person.img"
        @updateAvatar="updateAvatar"
      />
    </div>
    <q-input
      dense
      filled
      v-model="person.name"
      label="姓名"
      lazy-rules
      :rules="[ val => val && val.length > 0 || '请输入姓名']"
    >
    </q-input>
    <q-field filled>
      <q-radio
        keep-color
        v-model="person.sex"
        val="男"
        label="男"
        color="cyan"
      />
      <q-radio
        keep-color
        v-model="person.sex"
        val="女"
        label="女"
        color="red"
      />
    </q-field>
    <q-input
      dense
      filled
      v-if="!person.id"
      v-show="!resumeDeliveryID"
      :value="user.password"
      @input="val=>user.password = val"
      :type="isPwd ? 'password' : 'text'"
      lazy-rules
      :rules="[ val => val.length >= 6 || $t('rule.atleastNCharacters',{number:6})]"
      label="密码"
      hint="必须为6-12位，只能是字母、数字和下划线"
    >
      <template v-slot:append>
        <q-icon
          class="cursor-pointer"
          :name="isPwd ? 'visibility_off' : 'visibility'"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>
    <q-input
      dense
      filled
      class="q-mt-md"
      v-model="person.phone"
      label="手机号"
      lazy-rules
      :rules="mobilePhoneRules"
    />
    <q-input
      dense
      filled
      :rules="jobNumberRules"
      lazy-rules
      v-model="person.jobNumber"
      :label="$t('auth.fields.jobNumber')"
      :hint="$t('auth.hint.jobNumber')"
    />
    <q-input
      dense
      filled
      class="q-mt-md"
      v-model="person.email"
      label="邮箱"
      :hint="$t('auth.hint.email')"
    />
    <div class="q-mt-md">
      <q-item-label
        v-if="datetime!=''"
        class="text-caption text-grey q-pl-sm text-h6"
      >

        用户填写的机构信息：
        <b class="text-orange">{{extra.registerInfo.OrganizeName}}</b>，
        职位信息：
        <b class="text-orange">{{extra.registerInfo.DutyName}}</b>。
        可能填写不准确,管理员可重新选择与之相近的机构和职位。
      </q-item-label>
      <div
        v-for="(od,index) in person.listOrganizeDuty"
        :key="index"
        class="row q-col-gutter-x-sm q-col-gutter-y-none"
      >
        <tw-select-tree
          dense
          filled
          :nodes="person.isOutStaff===0?(!$myinfo.auth.role.isSystemAdministrator&&$myinfo.auth.role.isOrganizeManager?orgsAndChild($myinfo.organizeId):selectOrganizesTree):selectCustomers"
          :model.sync="od.organizeId"
          :node-key="'id'"
          :label-key="person.isOutStaff===0?'name':'title'"
          :is-organize="person.isOutStaff===0"
          :disable="!$myinfo.auth.role.isSystemAdministrator&&!$myinfo.auth.role.isHRSpecialist&&(!$myinfo.auth.role.isOrganizeManager||$myinfo.id==person.id)"
          position="bottom"
          class="col-12 col-md-6"
          style="flex: auto;"
          label="请选择机构"
          lazy-rules
          :rules="[ val => val && val.length > 0 || '请选择机构']"
        />
        <q-select
          dense
          filled
          use-input
          emitValue
          @filter="filterFn"
          :options="filterDutys"
          option-value="id"
          option-label="name"
          v-model="od.dutyId"
          label="请选择职位"
          class="col-12 col-md-6"
          style="flex: auto;"
          :disable="!$myinfo.auth.role.isSystemAdministrator&&!$myinfo.auth.role.isHRSpecialist&&(!$myinfo.auth.role.isOrganizeManager||$myinfo.id==person.id)"
          lazy-rules
          :rules="[ val => val   || '请选择职位']"
        >
          <template v-slot:selected-item="scope">
            <span>{{ selectDutys.find(r=>r.id ===scope.opt) && selectDutys.find(r=>r.id ===scope.opt).name}}</span>
          </template>
          <template v-slot:after>
            <q-btn
              flat
              dense
              color="primary"
              icon="add"
              @click.stop="person.listOrganizeDuty.push({organizeId: null, dutyId: null })"
            ></q-btn>
            <q-btn
              flat
              dense
              color="primary"
              icon="remove"
              @click.stop="person.listOrganizeDuty.length>1?person.listOrganizeDuty.splice(index,1):$q.notify('至少保留一组机构和职位')"
            ></q-btn>
          </template>
        </q-select>
      </div>
    </div>
    <q-select
      dense
      filled
      multiple
      use-chips
      :options="selectRoles"
      option-value="id"
      option-label="name"
      v-model="person.roles"
      label="请选择角色"
      :disable="!$myinfo.auth.role.isSystemAdministrator&&!$myinfo.auth.role.isHRSpecialist"
      lazy-rules
      :rules="[val => val || '必填']"
    >
    </q-select>
    <template v-if="$custom.hasPersonMoreInfo">
      <div
        v-if="more"
        class="column q-gutter-md"
      >
        <q-input
          dense
          filled
          v-model="person.address"
          label="联系地址"
        />
        <q-input
          dense
          filled
          v-model="person.tel"
          label="座机号"
        />
        <q-input
          dense
          filled
          readonly
          label="生日"
          mask="####-##-##"
          v-model="person.birthday"
        >
          <template v-slot:append>
            <q-icon
              name="event"
              class="cursor-pointer"
            >
              <q-popup-proxy
                ref="birthday"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  :class="!$q.screen.gt.xs?'fit':''"
                  v-model="person.birthday"
                  mask="YYYY-MM-DD"
                  @input="() => $refs.birthday.hide()"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input
          dense
          filled
          readonly
          label="入职日期"
          mask="####-##-##"
          v-model="person.entryoffice"
        >
          <template v-slot:append>
            <q-icon
              name="event"
              class="cursor-pointer"
            >
              <q-popup-proxy
                ref="entryofficeDate"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  :class="!$q.screen.gt.xs?'fit':''"
                  v-model="person.entryoffice"
                  mask="YYYY-MM-DD"
                  @input="() => $refs.entryofficeDate.hide()"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input
          dense
          filled
          label="职责简介"
          v-model="person.description"
        />
      </div>
      <q-btn
        v-else
        flat
        class="full-width"
        color="primary"
        @click="more = true"
      >完善更多信息
      </q-btn>
    </template>

  </tw-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { showSuccessMessage } from '@/utils/show-message'
import Person from '@/store/person/model'
import { mobilePhoneRules, jobNumberRules } from '@/utils/form-rules'
export default {
  name: 'PersonEdit',
  props: {
    id: {
      type: Number,
      required: false,
      default: 0
    },
    datetime: { // 注册审批（根据人员添加时间路由，获取用户填写的注册信息）
      type: String,
      required: false,
      default: ''
    },
    resumeDeliveryID: { // 招聘应聘者同步（根据应聘者投递ID获取注册信息）
      type: Number,
      required: false,
      default: 0
    }
  },
  components: {
    TwSelectTree: () => import('components/base/TwSelectTree'),
    // TwEditor: () => import('components/base/TwEditor'),
    AvatarCrop: () => import('components/profile/AvatarCrop'),
    TwForm: () => import('components/base/TwForm')
  },
  data () {
    return {
      isPwd: true,
      more: false,
      person: new Person(),
      regMessageId: 0,
      user: {
        userId: 0,
        userName: '',
        password: '',
        email: '',
        tel: ''
      },
      extra: {
        registerInfo: {
          OrganizeName: '',
          DutyName: ''
        }
      },
      filterDutys: []
    }
  },
  async created () {
    // 清除下拉类型的搜索条件，防止影响机构、职位、角色等的下拉选项
    this.$store.commit('organize/setSearch', '')
    this.$store.commit('duty/setSearch', '')
    this.$store.commit('role/setSearch', '')
    // 获取下拉选项数据
    await this.loadSelectCustomers()
    // 初始化数据
    this.init()
  },
  computed: {
    ...mapGetters('role', ['selectRoles']),
    ...mapGetters('duty', ['selectDutys']),
    ...mapGetters('customer', ['selectCustomers']),
    ...mapGetters('organize', ['selectOrganizes', 'selectOrganizesTree']),
    // 当前机构及其子机构数据
    orgsAndChild () {
      return organizeId => {
        return this.$store && this.$store.getters['organize/selectOrganizesChildTree'](organizeId)
      }
    },
    mobilePhoneRules,
    jobNumberRules
  },
  watch: {
    datetime (val) {
      this.init()
    },
    selectRoles: {
      immediate: true,
      deep: true,
      handler (val) {
        // 添加人员时：默认选择“用户”角色，可移除
        if (!this.id && val.length) {
          let defaultRole = _.find(val, r => r.code === 'User')
          this.person.roleIds = [defaultRole.id]
          this.person.roleCodes = [defaultRole.code]
          this.person.roleNames = [defaultRole.name]
          this.person.roles = [defaultRole]
        }
      }
    }
  },
  methods: {
    ...mapActions('customer', ['loadSelectCustomers']),
    ...mapActions('person', ['loadPerson', 'updatePerson', 'updatePersonField']),
    ...mapActions('auth', ['addUser', 'updateUser', 'deleteUser']),
    ...mapActions('message', ['loadMessageBy', 'addMessage', 'updateMessageField']),
    init () {
      // 是否更新人员
      if (this.id) {
        this.loadPerson(this.id).then(person => {
          this.person = _.clone(person)
        })
      } else if (this.resumeDeliveryID) {
        let resumeView = this.$store.getters['resume/resumeView'](+this.resumeDeliveryID)
        this.user.noMd5 = true
        this.$store.dispatch('resume/getResumePW', +resumeView.resumeID).then(pw => {
          this.user.password = pw
        })
        this.$store.dispatch('resume/loadResume', +resumeView.resumeID).then(resume => {
          this.person.name = resume.name
          this.person.sex = resume.sex
          this.person.tel = resume.tel
          this.person.phone = resume.tel
          this.person.email = resume.email
          this.person.birthday = resume.birthday
          this.person.address = resume.mailingAddress
          this.person.description = resume.selfEvaluation
          this.person = _.clone(this.person)
        })
      } else {
        // 设置面包屑
        let bread = [
          {
            ID: 0,
            To: { name: `contactsHome` },
            Title: this.$t('contacts.module')
          }]
        this.$store.state.breadcrumbs.breadcrumbs = bread
        // 获取url中传递的所有参数（对象）
        var urlParams = this.getUrlAllParams()
        // 判断请求的参数
        if (this.datetime && this.datetime !== '') {
          // 注册人员信息初始化处理
          var query = [{ 'Key': 'Route.Path', 'Value': this.$route.path, 'Oper': 'eq' }]
          this.loadMessageBy({ query }).then(res => {
            if (res) {
              this.regMessageId = res.id
              this.extra = res.extra
              var organize = _.find(this.selectOrganizes, o => o.name === this.extra.registerInfo.OrganizeName) || _.find(this.selectOrganizes, o => o.name.includes(this.extra.registerInfo.OrganizeName))
              var duty = _.find(this.selectDutys, o => o.name === this.extra.registerInfo.DutyName) || _.find(this.selectDutys, o => o.name.includes(this.extra.registerInfo.DutyName))
              this.person.tel = this.extra.Tel
              this.person.phone = this.extra.Tel
              this.person.email = this.extra.Email
              this.user.password = this.extra.Password
              this.person.name = this.extra.UserName
              this.person.listOrganizeDuty = [{ organizeId: organize && organize.id, dutyId: duty && duty.id }]
              this.person.jobNumber = this.extra.registerInfo.RecordNum
              this.person = _.clone(this.person)
            }
          })
        } else if (urlParams != null && urlParams.organizeId && urlParams.isOutStaff) {
          this.person.isOutStaff = Number(urlParams.isOutStaff)
          this.person.listOrganizeDuty = [{ organizeId: Number(urlParams.organizeId), dutyId: null }]
          this.person = _.clone(this.person)
        }
      }
    },
    onSubmit () {
      this.user.userName = this.person.name
      this.user.email = this.person.email
      this.user.tel = this.person.phone
      if (!this.person.id) {
        // 调用用户后台添加接口
        this.addUser(_.cloneDeep(this.user)).then(res => {
          if (res) {
            // 调用人员后台维护接口
            this.person.userId = res.userId
            this.person.weChat = this.person.jobNumber
            this.updatePerson(this.person).then(res2 => {
              if (res2) {
                // 发送注测审批通过通知
                if (this.datetime && this.datetime !== '') {
                  this.addMessage({
                    route: {
                      name: 'myProfile',
                      params: {},
                      path: `/my/profile`
                    },
                    senderID: this.$myinfo.id,
                    senderName: this.$myinfo.name,
                    senderImg: this.$myinfo.img,
                    sendTime: new Date(),
                    type: 'registerNotice',
                    title: '注册成功',
                    receiveBy: [res2.id],
                    readBy: [],
                    extra: {
                      Content: `<h1><strong>恭喜您：${res2.name}，注册成功。</strong></h1><p>浏览器推荐使用较新版本的谷歌（chrome），火狐（firefox）浏览器。</p>`
                    }
                  }).then(mess => {
                    this.updateMessageField({ Id: this.regMessageId, Done: true, Type: 'approvalDone' })
                  })
                }
                // 若为简历同步，则事件返回
                if (this.resumeDeliveryID) {
                  this.$emit('ok', true)
                } else {
                  showSuccessMessage('添加成功')
                  // 跳转到通讯录首页
                  this.$router.push({ name: `contactsHome` })
                }
              } else {
                this.deleteUser(this.person.userId)
                // 若为简历同步，则事件返回
                this.resumeDeliveryID && this.$emit('ok', false)
              }
            })
          }
        })
      } else {
        if (!this.person.isOutStaff) {
          this.user.userId = this.person.userId
          // 调用用户后台维护接口
          this.updateUser(this.user).then(res => {
            if (res) {
              // 调用人员后台维护接口
              this.updatePerson(this.person).then(res2 => {
                if (res2) {
                  showSuccessMessage('修改成功')
                  // 修改成功后，跳转到通讯录首页
                  this.$router.push({ name: `contactsHome` })
                }
              })
            }
          })
        } else {
          this.updatePerson(this.person).then(res2 => {
            if (res2) {
              showSuccessMessage('修改成功')
              // 修改成功后，跳转到通讯录首页
              this.$router.push({ name: `contactsHome` })
            }
          })
        }
      }
    },
    // 获取url中全部参数的对象
    getUrlAllParams () {
      // 解决乱码问题
      var url = decodeURI(window.location.href)
      var res = {}
      var urlData = _.split(url, '?').length > 1 ? _.split(url, '?')[1] : null
      if (!urlData) return null
      var paramsArr = _.split(urlData, '&')
      _.forEach(paramsArr, function (item) {
        var key = _.split(item, '=')[0]
        var value = _.split(item, '=')[1]
        res[key] = value
      })
      return res
    },
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.filterDutys = this.selectDutys
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.filterDutys = this.selectDutys.filter(d => d.name.toLowerCase().indexOf(needle) > -1)
      })
    },
    updateAvatar (avatar) {
      if (this.person && this.person.id) {
        this.updatePersonField({
          id: this.person.id,
          fieldName: 'img',
          value: avatar
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .q-field--outlined.q-field--readonly .q-field__control:before {
  border-style: solid;
}
</style>
