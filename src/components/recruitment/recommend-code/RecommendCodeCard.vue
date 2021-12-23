<template>
  <q-card
    flat
    bordered
    class="cursor-pointer base-card"
    style="height: 100%;border-radius: 0.6rem;"
  >
    <q-card-section @click="openDetail" class="text-subtitle2 code-card">
      <!-- 推荐码/类型 -->
      <div :title="model.code" class="flex items-center q-mb-md">
        <span
          class="text-weight-bold text-h2-g text-text1"
          style="vertical-align: middle;"
          >{{ model.code }}</span
        >
        <q-space />
        <q-badge
          align="middle"
          :color="codeType[model.type].type ? 'auxiliary5' : 'primary1'"
          class="code-badge"
          >{{ codeType[model.type].label }}</q-badge
        >
      </div>

      <div class="col q-mr-xl">
        <!--持有者姓名-->
        <q-icon size="20px" name="person" color="primary1" class="q-pr-xs" />
        <span class="text-text2">{{ model.owner }}</span>
      </div>
      <div class="col q-pt-sm" @click.capture.stop="openTel">
        <!--持有者电话-->
        <q-icon
          name="
              local_phone"
          color="primary1"
          class="q-pr-xs"
          size="20px"
        />
        <span class="text-text2">{{ model.ownerTel }}</span>
      </div>
      <div v-if="showStatistics" class="row q-pt-sm">
        <q-badge
          style="margin-left:5px"
          align="middle"
          color="orange"
          class="code-badge"
          >{{ $t("recommendCode.rankingList.deliver") }}：{{
            model.count
          }}</q-badge
        >
        <q-badge
          style="margin-left:5px"
          align="middle"
          color="orange"
          class="code-badge"
          >{{ $t("recommendCode.rankingList.job") }}：{{
            model.jobNumber
          }}</q-badge
        >
      </div>
      <div class="text-text2 col column justify-end">
        <q-separator class="q-my-sm" />
        <div class="flex text-body-g q-mb-xs">
          <span>上次修改</span>：
          <span class="">{{ model.modifyTime }}</span>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'recommendCodeCard',
  props: {
    model: { type: Object },
    showStatistics: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('recommendCode', ['codeType'])
  },
  methods: {
    // 跳转详情页
    openDetail () {
      this.$router.push({
        name: 'recommendCodeDetail',
        params: {
          id: this.model.id,
          model: this.model
        }
      })
    },

    openTel () {
      console.log(this.$q.platform.is.mobile)
      if (this.$q.platform.is.mobile) {
        window.location.href = 'tel:' + this.model.ownerTel
      } else {
        this.openDetail()
      }
    }
  }
}
</script>

<style scoped>
.code-card {
  position: relative;
  height: 80%;
  padding-bottom: 20px;
}
.code-badge {
  display: inline-block;
  vertical-align: middle;
}
.q-badge {
  padding: 4px 6px;
}
</style>
