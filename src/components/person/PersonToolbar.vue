<template>
  <div class="row justify-around">
    <q-btn
      :size="size"
      v-close-popup
      flat
      :color="color"
      round
      dense
      icon="chat"
      title="发起聊天"
      stack
      @click.stop="chat(person)"
    />
    <q-btn
      :size="size"
      dense
      v-close-popup
      flat
      :color="color"
      round
      icon="event"
      title="查看日程安排"
      stack
      @click="$router.push({name:'schedule',params:{category:'person',objectID:Number(id)}})"
    />
    <q-btn
      :size="size"
      dense
      v-close-popup
      flat
      :color="color"
      round
      title="查看最新动态"
      stack
      icon="av_timer"
      :to="{name:'activity',params:{category:'person',objectID:+id}}"
    />
  </div>
</template>

<script>
export default {
  name: 'PersonToolbar',
  props: {
    size: {
      type: String,
      required: false,
      default: 'md'
    },
    id: {
      type: [Number, String],
      required: true
    },
    color: {
      type: String,
      required: false,
      default: 'primary'
    }
  },
  computed: {
    person: {
      get () {
        return this.$store.getters['person/person'](this.id)
      }
    }
  },
  methods: {
    chat (person) {
      if (!this.$q.screen.lt.md) {
        this.$router.push({
          name: 'chat',
          params: { category: 'person', objectID: person.id }
        })
      } else {
        this.$router.push({
          name: 'chat',
          params: { category: 'person', objectID: person.id },
          query: { type: this.$route.params.type || 'organize' }
        })
      }
    }
  }
}
</script>

<style>
</style>
