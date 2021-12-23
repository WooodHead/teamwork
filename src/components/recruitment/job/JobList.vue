<template>
  <q-list
    padding
    class="rounded-borders"
    style="width:100%"
  >
    <q-item
      v-for="model in modelList"
      :key="model.id"
      clickable
      v-ripple
    >
      <q-item-section @click.stop="openDetail(model)">
        <q-item-label class="text-h6 text-bold">{{model.title}}</q-item-label>
        <q-item-label class="q-gutter-xs q-py-xs">
          <q-badge
            color="blue-grey-5"
            outline
            :label="model.category"
          />
          <q-badge
            color="blue-grey-5"
            outline
            :label="model.educationDegree"
          />
          <q-badge
            color="blue-grey-5"
            outline
            :label="model.workingYears"
          />
          <q-badge
            color="blue-grey-5"
            outline
            :label="model.num+'人'"
          />
        </q-item-label>
        <q-item-label caption>
          <div
            class="wrapper"
            v-html="model.detailRequirements"
          ></div>
        </q-item-label>
      </q-item-section>
      <!-- 操作按钮 -->
      <q-item-section
        top
        side
        v-if="canOp&&model.isPublish"
      >
        <div class="text-grey-8 q-gutter-xs">
          <q-btn
            class="gt-xs"
            size="12px"
            flat
            dense
            round
            :label="model.archived?$t('archive.unarchive'):$t('archive.archive')"
            :color="model.archived?'blue-grey-5':'primary'"
            :icon="model.archived?'unarchive':'archive'"
            @click="archivedOrUnarchivedJob(model)"
          />
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { mapActions } from 'vuex'
import htmlToText from '@/utils/html-to-text'
import { LocalStorage } from 'quasar'
export default {
  name: 'JobList',
  props: {
    modelList: { type: Array, required: true }
  },
  methods: {
    ...mapActions('job', ['archiveJob', 'unarchiveJob', 'startJob', 'doneJob']),
    htmlToText,
    openDetail (model) {
      let that = this
      that.$router.push({
        name: 'jobDetail',
        params: { id: +model.id }
      })
    },
    // 归档或解档岗位
    archivedOrUnarchivedJob (model) {
      let that = this
      // 归档===>解档
      if (model.archived) {
        that.unarchiveJob(model.id).then(res => {
          if (res) {
            model = res
          }
        })
      } else {
        // 解档===>归档
        that.archiveJob(model.id).then(res => {
          if (res) {
            model = res
          }
        })
      }
    }
  },
  computed: {
    // HR、系统管理员具有操作权限
    canOp () {
      return !!(_.find(LocalStorage.getItem('myself').roles, { code: 'HRSpecialist' }) || _.find(LocalStorage.getItem('myself').roles, { code: 'SystemAdministrator' }))
    }
  }
}
</script>

<style lang="scss" scoped>
.my-resource-list-item {
  min-width: 9vw;
  max-width: 9vw;
}
.wrapper {
  white-space: pre-wrap;
}
</style>
