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
      <div v-html="$t('archive.someOneSometimeArchivedSomething',{
      sometime:timeAgo({ dateTime: archiveTime }),
      something:label,
      someone:someone,
      })"></div>
      <router-link
        class="q-px-xs"
        to=''
        @click.native='unarchive'
      >{{$t('archive.unarchiveIt')}}</router-link>
      {{$t('or')}}
      <router-link
        class="q-px-xs"
        to=''
        @click.native='putInTrash'
      >{{$t('action.putInTheTrash')}}</router-link>
    </div>
  </q-banner>
</template>

<script>
import { showConfirm } from '@/utils/show-confirm'
import timeAgo from '@/utils/time-ago'
import { format } from 'quasar'
const { capitalize } = format
export default {
  name: 'TwArchiveNotes',
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    type: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      required: true,
      default: ''
    },
    archiveTime: {
      type: String,
      required: true
    },
    archiveBy: {
      type: String,
      default: ''
    }
  },
  computed: {
    module () {
      const module = {
        event: 'schedule',
        question: 'checkins'
      }
      return module[this.type] || this.type
    },
    someone () {
      return this.archiveBy === this.$myinfo.name
        ? this.$t('fields.you') : this.archiveBy
    }
  },
  methods: {
    timeAgo,
    unarchive () {
      this.$store.dispatch(`${this.module}/unarchive${capitalize(this.type)}`, +this.id)
    },
    putInTrash () {
      showConfirm(this.$t('action.reallyDelete'), () => {
        // 放在dispatch.then中不能触发，就先放在这里了
        this.$emit('delete', +this.id)
        const params = ['event', 'project', 'productDev'].includes(this.type) ? { id: +this.id } : +this.id
        this.$store.dispatch(`${this.module}/delete${capitalize(this.type)}`, params)
      })
    }
  }
}
</script>

<style scoped>
</style>
