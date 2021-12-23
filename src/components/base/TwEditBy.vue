<template>
  <div>
    {{$t('base.editedBy',{
    action:$t(`action.${action}`),
    person:modifyBy,
    time:timeAgo({dateTime:modifyTime})})
    }}
  </div>
</template>

<script>
import timeAgo from '@/utils/time-ago'
export default {
  name: 'TwEditBy',
  props: {
    action: {
      type: String,
      required: false,
      default: 'edit' // add,update
    },
    modifyBy: {
      type: String,
      required: true
    },
    modifyTime: {
      type: String,
      required: true
    }
  },
  methods: {
    timeAgo
  }
}
</script>

<style>
</style>
