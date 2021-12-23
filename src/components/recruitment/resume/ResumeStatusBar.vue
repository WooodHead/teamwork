<!-- TwResume顶部按钮区域 -->
<template>
  <q-toolbar>
    <div class="row q-gutter-x-sm">
      <q-btn
        flat
        dense
        v-for="status in normalStatus"
        :key="status"
        no-caps
        class="text-weight-regular"
        :label="getLabel(status)"
        :color="selectedStatus === status ? 'primary' : ''"
        :class="selectedStatus === status ? 'text-primary' : 'text-black'"
        @click="onClick(status)"
      />
    </div>
  </q-toolbar>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'ResumeStatusBar',
  data () {
    return {
    }
  },
  computed: {
    ...mapState('resume', ['frontStatus', 'endStatus', 'normalStatus', 'selectedStatus', 'statusCount'])
  },
  methods: {
    ...mapMutations('resume', ['setSelectedStatus']),
    getLabel (key) {
      if (_.isEmpty(this.statusCount)) {
        return this.$t('resume.status.' + key)
      } else {
        if (key === 'waitTest') {
          let number = Number(this.statusCount[this.endStatus.waitTest].length) +
            Number(this.statusCount[this.endStatus.inTest].length)
          return this.$t('resume.status.' + key) + '(' + number + ')'
        } else if (key === 'waitInvite') {
          let number = Number(this.statusCount[this.endStatus.waitInviteFirstInterview].length)
          return this.$t('resume.status.' + key) + '(' + number + ')'
        } else if (key === 'waitInterview') {
          let number = Number(this.statusCount[this.endStatus.waitFirstInterview].length) +
            Number(this.statusCount[this.endStatus.inFirstInterview].length)
          return this.$t('resume.status.' + key) + '(' + number + ')'
        } else if (key === 'inService' || key === 'inStorage') {
          return this.$t('resume.status.' + key)
        } else {
          return this.$t('resume.status.' + key) + '(' + this.statusCount[this.endStatus[key]].length + ')'
        }
      }
    },
    onClick (status) {
      this.$emit('statusChanged', status)
    }
  }
}

</script>

<style lang='scss' scoped>
</style>
