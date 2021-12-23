<template>
  <event-content
    class="q-pt-xl"
    :event="event"
    :withs="withs"
    onlyShow
  />
</template>

<script>
import Event from '@/store/schedule/model'
import Person from '@/store/person/model'
export default {
  name: 'PublicEvent',
  props: {
    publicContent: {
      type: Object,
      required: true
    }
  },
  components: {
    EventContent: () => import('components/calendar/EventContent')
  },
  data () {
    return {
      event: Event.from(this.publicContent.Event),
      withs: _.keyBy(Person.from(this.publicContent.Withs), 'id')
    }
  }
}
</script>

<style>
</style>
