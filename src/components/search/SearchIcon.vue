<template>
  <q-btn title="搜索中心" icon="search" flat round dense no-caps>
    <q-popup-proxy 
    @before-hide ="beforeHide"
    >
    <keep-alive>
      <q-card class="my-card" flat>
        <q-card-section>
            <search-panel ref="searchPanel"/>
        </q-card-section>
      </q-card>
      </keep-alive>
    </q-popup-proxy>
  </q-btn>
</template>
<script>
import { mapMutations } from 'vuex'
import { LocalStorage } from 'quasar'
export default {
  components: {
    'search-panel': () => import('components/search/SearchPanel.vue')
  },
  data () {
    return {
      myinfo: LocalStorage.getItem('myself'),
      isFirstShow: false
    }
  },
  computed: {},
  mounted () {},
  methods: {
    ...mapMutations('search', ['setList', 'setCount']),
    beforeHide () {
      let sR = this.$refs.searchPanel.$refs.searchResult
      if (sR) {
        this.setList(sR.list || [])
        this.setCount(sR.count || 0)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.my-card {
  max-width: 800px;
  min-width: 63vw;
}
</style>
