<template>
  <div class="col text-body1 text-weight-bold text-left">
    <div class="row">
      <span>
        {{$t(`activity.${activity.widget.type}.${activity.description}`,{name:activity.actor})}}
      </span>
      <div
        v-if="activity.description === 'AssignTo' ||activity.description === 'ReAssignTo'"
        class="q-ml-sm text-weight-regular text-caption flex"
      >
        <div
          v-for="connector in Connector"
          :key="connector.id"
        >
          <tw-avatar
            :id="connector.id"
            :name="connector.name"
            :img="connector.img"
            size="sm"
          />
          {{connector.name}}
        </div>
      </div>
      <!--成员列表-->
      <div
        v-if="activity.description === 'AddMembers' || activity.description === 'DeleteMembers'"
        class="q-ml-sm text-weight-regular text-caption flex"
      >
        <div
          v-for="person in activity.widget.detail"
          :key="person.PsonID"
        >
          <tw-avatar
            :id="person.PsonID"
            :name="person.PsonName"
            :img="person.Icon"
            size="sm"
          />
          {{person.PsonName}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ServiceActivity',
  props: {
    activity: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    Connector () {
      return (this.selectPersons && _.filter(this.selectPersons, f => this.activity.widget.on.id === f.id))
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar')
  }
}
</script>

<style lang="scss" scoped>
</style>
