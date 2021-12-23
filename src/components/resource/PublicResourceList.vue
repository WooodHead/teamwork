<!--
@Name：公共的资源列表显示
@Author：陆欢
@date：2021/06/09
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-item
    clickable
    v-ripple
  >
    <q-item-section
      v-if="psonID"
      avatar
    >
      <tw-avatar
        size="lg"
        :id="psonID"
      />
    </q-item-section>
    <q-item-section
      v-if="$q.screen.gt.sm"
      class="my-resource-list-item"
    >
      <q-item-label
        class="ellipsis"
        :title="getOrganizeName"
      >
        {{getOrganizeName}}
      </q-item-label>
    </q-item-section>
    <q-item-section>
      <q-item-label
        class="ellipsis"
        :class="['text-bold', {'q-m-lg':$q.screen.gt.sm}]"
        :title="title"
      > {{title}}</q-item-label>
      <q-item-label
        v-if="$q.screen.lt.sm"
        class="ellipsis"
        caption
      >{{getOrganizeName}}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'PublicResourceList',
  props: {
    psonID: { type: Number, required: false, default: 0 },
    organizeID: { type: Number, required: false, default: 0 },
    organizeName: { type: String, required: false, default: '' },
    title: { type: String, required: false, default: '' }
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  computed: {
    ...mapState('organize', ['selectOrganizes']),
    getOrganizeName () {
      if (this.organizeName) {
        return this.organizeName
      } else {
        return this.organizeID && this.selectOrganizes && this.selectOrganizes[this.organizeID] ? this.selectOrganizes[this.organizeID].name : ''
      }
    }
  },
  methods: {
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar')
  }
}
</script>

<style scoped>
  .my-resource-list-item {
    min-width: 9vw;
    max-width: 20vw;
  }
</style>
