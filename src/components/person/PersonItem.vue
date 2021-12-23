<template>
  <q-item
    clickable
    :active="active"
    @click="$emit('click',person)"
    :class="{'q-px-none':$q.screen.lt.sm}"
  >
    <q-item-section avatar>
      <tw-avatar
        size="md"
        :id="person.id"
        :name="person.name"
        :img="person.img"
      />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ person.name }}
        <q-badge
          v-if="!person.inService"
          color="orange"
          :label="$t('person.leaveOffice')"
          outline
        />
        <q-badge
          v-else-if="!person.activated&&person.inService"
          color="orange"
          label="禁用"
          outline
        />
      </q-item-label>
      <q-item-label
        v-if="$q.screen.gt.xs"
        lines="1"
        caption
      >
        <span v-if="person.dutyName&&person.orgShortName">
          {{ person.dutyName?person.dutyName:''}} • {{ person.orgShortName?person.orgShortName:''}}
        </span>
        <span v-else>
          {{ person.dutyName?person.dutyName:''}} {{ person.orgShortName?person.orgShortName:''}}
        </span>
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <slot>
        <person-toolbar
          v-if="showTodo"
          size="0.7rem"
          color="indigo"
          :id="person.id"
        />
      </slot>
    </q-item-section>
  </q-item>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    id: {
      type: Number,
      required: false,
      default: 0
    },
    person: {
      type: Object,
      required: false,
      default: () => { }
    },
    active: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      showTodo: false
    }
  },
  components: {
    PersonToolbar: () => import('components/person/PersonToolbar'),
    'tw-avatar': () => import('components/base/TwAvatar')
  },
  mounted () {
    if (this.id) {
      this.loadPerson(this.id).then((p) => { Object.assign(this.person, p) })
    }
  },
  methods: {
    ...mapActions('person', ['loadPerson'])
  }
}
</script>
<style></style>
