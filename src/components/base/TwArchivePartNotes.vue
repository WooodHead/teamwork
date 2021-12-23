<template>
  <q-banner
    rounded
    class="bg-grey-3 text-subtitle1"
  >
    <template v-slot:avatar>
      <q-icon
        name="info"
        color="info"
      />
    </template>
    <div class="row">
      <div v-html="$t('archive.thisIsPartOfAnArchived',{something:parentLabel})"></div>
      <router-link
        class="q-px-xs"
        to=''
        @click.native='goBack()'
      >{{$t('archive.goAndRestore',{something:parentLabel})}}
      </router-link>
    </div>
  </q-banner>
</template>

<script>
export default {
  name: 'TwArchivePartNotes',
  props: {
    type: {
      type: String,
      default: ''
    },
    parentID: {
      type: [Number, String],
      required: true
    },
    parentLabel: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: false,
      default: ''
    },
    objectID: {
      type: [Number, String],
      required: false,
      default: 0
    }

  },
  computed: {
  },
  methods: {
    goBack () {
      this.$router.push({
        name: this.type + 'Detail',
        params: {
          category: this.category,
          objectID: +this.objectID,
          id: +this.parentID
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
