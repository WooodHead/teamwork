<template>
  <q-card>
    <q-card-section
      :key="'activity'+activityID"
      v-for="(records,activityID) in resumeDeliveryRecords(+resumeID)"
    >
      <div class="text-bold">{{jobActivity(activityID).name}}</div>
      <q-list
        bordered
        class="rounded-borders"
      >
        <q-expansion-item
          :key="'record'+record.id"
          v-for="record in records"
        >
          <template v-slot:header>
            <q-item-section avatar>
              <tw-avatar
                size="xl"
                :id="record.createByID"
              />
            </q-item-section>
            <q-item-section>
              {{recordTypes[record.type-1]}}
            </q-item-section>
            <q-item-section>
              {{record.result}}
            </q-item-section>
            <q-item-section side>
              {{record.createTime}}
            </q-item-section>
          </template>
          <q-card>
            <q-card-section>
              <template v-if="record.type===4">
              </template>
              <template v-else-if="record.type===5">
              </template>
              <template v-else>
                {{record.detail}}
              </template>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ResumeDeliveryRecord',
  props: {
    resumeID: {
      type: [Number, String],
      default: 0,
      required: false
    }
  },
  data () {
    return {
      recordTypes: ['简历初筛', '在线测评', '笔试', '人事面试', '技术面试', '综合面试', '终极面试']
    }
  },
  mounted () {
    console.log(this.resumeDeliveryRecords(this.resumeID))
  },
  computed: {
    ...mapGetters('resumeDeliveryRecord', ['resumeDeliveryRecords']),
    ...mapGetters('jobActivity', ['jobActivity'])
  },
  components: {
    'TwAvatar': () => import('components/base/TwAvatar')
  }

}
</script>

<style lang="sass" scoped>
</style>
