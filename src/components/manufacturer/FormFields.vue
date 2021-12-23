<template>
  <q-card-section>
    <!-- 内部、外协 -->
    <q-field
      filled
      class="g-margin-bottom20"
    >
      <q-radio
        keep-color
        v-model="model.classification"
        val="internal"
        label="内部生产单位"
        color="teal"
      />
      <q-radio
        keep-color
        v-model="model.classification"
        val="outsource"
        label="外协生产单位"
        color="orange"
        class="q-ml-sm"
      />
    </q-field>

    <div v-show="model.classification==='internal'">
      <div :class="!$q.screen.lt.sm?'row q-col-gutter-md':'column'">
        <div class="col">
          <!-- 内部生产单位选择 -->
          <tw-select-tree
            filled
            emit-value
            :nodes="selectOrganizesTree"
            isOrganize
            :model.sync="model.organizeId"
            node-key="id"
            label-key="name"
            position="bottom"
            :label="$t('manufacturer.organizeTree')"
            lazy-rules
            :rules="model.classification==='internal'?[ val => val && val.length > 0 || '请选择机构']:[]"
          />
        </div>
        <div class="col">
          <!-- 人员选择 -->
          <tw-select-person
            filled
            v-model="model.leaderId"
            emit-value
            :label="$t('manufacturer.leader')"
            lazy-rules
            :rules="model.classification==='internal'?[val => val>0 || $t('manufacturer.verify.leader')]:[]"
            ref="leader"
          />
        </div>
      </div>
    </div>

    <div v-show="model.classification==='outsource'">
      <!-- 名称 -->
      <q-input
        filled
        v-model="model.title"
        @input="$emit('update:title', $event)"
        label="外协生产单位名称"
        lazy-rules
        :rules="model.classification==='outsource'?[ val => val && val.length > 0 || '请输入名称']:[]"
      />
    </div>

    <div :class="!$q.screen.lt.sm?'row q-col-gutter-md':'column'">
      <div class="col">
        <!-- 等级 -->
        <tw-select-edit
          withDictKey
          filled
          module="manufacturer"
          field="manufacturerLevel"
          :editable="!!$myinfo.auth.role.isSystemAdministrator"
          :value="model.grade"
          :rules="[val => val&&val.length>0 || $t('manufacturer.verify.grade')]"
          @input="(payload)=>{model.grade= payload.dictValue}"
          label="等级"
        />
      </div>
      <div class="col">
        <!-- 是否可生产管控 -->
        <q-field
          filled
          class="g-margin-bottom20"
        >
          <q-radio
            keep-color
            v-model="model.canControl"
            :val="1"
            label="生产可管控"
            color="teal"
          />
          <q-radio
            keep-color
            v-model="model.canControl"
            :val="0"
            label="生产不管控"
            color="orange"
            class="q-ml-sm"
          />
        </q-field>
      </div>
    </div>

    <div v-show="model.classification==='outsource'">
      <div :class="!$q.screen.lt.sm?'row q-col-gutter-md':'column'">
        <div class="col">
          <q-input
            v-model="model.leaderName"
            filled
            label="负责人姓名"
            :rules="model.classification==='outsource'?[ val => val && val.length > 0 || '请输入姓名']:[]"
          />
        </div>
        <div class="col">
          <q-input
            v-model="model.tel"
            filled
            label="负责人电话"
            :rules="model.classification==='outsource'?[ val => val && val.length > 0 || '请输入电话']:[]"
          />
        </div>
      </div>
    </div>

    <!-- 描述 -->
    <q-input
      v-model="model.notes"
      type="textarea"
      filled
      style="max-height: 100px;"
      label="描述"
      class="margin-bottom20"
    />
  </q-card-section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'FormFields',
  components: {
    TwSelectTree: () => import('components/base/TwSelectTree'),
    TwSelectPerson: () => import('components/base/TwSelectPerson.vue'),
    TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit')
  },
  props: {
    openType: { type: String, default: 'add' },
    model: { type: Object }
  },
  computed: {
    ...mapGetters('organize', ['selectOrganizesTree'])
  }
}
</script>

<style lang='scss' scoped>
.padding-bottom20 {
  padding-bottom: 20px;
}

.margin-bottom20 {
  margin-bottom: 20px;
}

/deep/.editor {
  border-bottom: unset !important;
  cursor: initial !important;
}

.my-border {
  height: 56px;
  line-height: 56px;
  border: solid 1px lightgray;
  border-radius: 4px;
}

.my-border:hover {
  border-color: #000;
  transition: border-color 0.324s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
