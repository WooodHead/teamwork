<!--  -->
<template>

  <div class="flex col items-center">
    <div v-if="Resource">
      {{Resource.title}}
    </div>
    <q-separator
      v-if="showSeparator"
      style="height:1px;"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'TasksTitle',
  props: {
    category: {
      type: String,
      required: false,
      default: 'project'
    },
    objectID: {
      type: [Number, String],
      required: false,
      default: 0
    },
    showSeparator: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      Resource: ''
    }
  },
  computed: {

  },
  methods: {
    ...mapActions('resource', ['loadResourceItem'])
  },
  mounted () {
    this.loadResourceItem({
      objectID: +this.objectID,
      objectType: this.category
    }).then(res => {
      if (res) {
        this.Resource = res
      }
    })
  }
}

</script>

<style lang='scss' scoped>

</style>
