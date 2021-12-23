
<template>
  <q-btn
    title="搜索中心"
    icon="search"
    flat
    round
    dense
    no-caps
  >
    <q-popup-proxy>
      <q-card class="my-card">
        <q-card-section>
          <search-panel />
        </q-card-section>
      </q-card>
    </q-popup-proxy>
  </q-btn>
</template>
<script>
import { LocalStorage } from 'quasar'
export default {
  components: {
    'search-panel': () => import('components/search/SearchPanel.vue')
  },
  data () {
    return {
      myinfo: LocalStorage.getItem('myself')
    }
  },
  computed: {
  },
  mounted () {

  },
  methods: {
  }
}
</script>
<style lang='scss' scoped>
.my-card {
  max-width: 800px;
  min-width: 63vw;
}
</style>
