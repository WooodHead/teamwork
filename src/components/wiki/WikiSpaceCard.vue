<!--
@Name：知识空间卡片
@Author：陆欢
@date：2021/12/07
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-img
    class="cursor-pointer widget-card"
    :class="{'bigger-widget-card':bigger}"
    clickable
    :ratio="9/13"
    :src="model.snapshotPath"
    @click="cardDetail"
  >
    <div
      class="absolute-top text-weight-bold card-title"
      :class="textColor"
      style="top: 5px;"
    >
      <span class="ellipsis-3-lines text-bold text-subtitle2">{{model.title}}</span>
      <span class="ellipsis-3-lines text-caption q-mt-sm">{{model.content||model.notes}}</span>
    </div>
    <div
      class="absolute-bottom text-center update-snapshot"
      style="padding:5px;"
      @click.capture.stop="updateSnapshot"
      v-if="cardCanEdit"
    >
      <q-icon name="settings" />
      {{$t('wiki.action.updateSnapshot')}}
    </div>
  </q-img>
</template>

<script>
import showCardDetail from '@/components/document/folder/mixins-file-click.js'
import { mapState } from 'vuex'
export default {
  name: 'WikiSpaceCard',
  mixins: [showCardDetail],
  props: {
    model: {
      type: Object,
      default: function () {
        return {}
      }
    },
    cardCanClick: {
      type: Boolean,
      default: true
    },
    bigger: {
      type: Boolean,
      default: false,
      require: false
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('wiki', ['allWikiCoverPictures']),
    // 卡片字体颜色
    textColor () {
      let wikiCoverPicture = _.find(this.allWikiCoverPictures, { 'path': this.model.snapshotPath })
      return wikiCoverPicture && wikiCoverPicture.intensity
    },
    cardCanEdit () {
      return this.cardCanClick && (this.model.objectType === 'wiki' && this.$store.getters['wiki/editWikiAuth'](+this.model.objectID))
    }
  },
  methods: {
    cardDetail () {
      if (this.cardCanClick) {
        this.showFolderDetail(this.model.objectType, this.model.objectID, this.model.id)
      }
    },
    updateSnapshot () {
      this.$router.push({
        name: 'wikiEdit',
        params: {
          id: +this.model.objectID,
          openType: 'edit'
        }
      })
    }
  },
  components: {
  }
}
</script>

<style lang="scss" scoped>
  .widget-card:before {
    content: "";
    display: block;
    padding-top: 0 !important;
  }
  .widget-card {
    width: 100%;
  }
  .widget-card.bigger-widget-card {
    width: 166px !important;
  }
  @media (min-width: $breakpoint-xs-max) {
    .widget-card {
      width: 9rem !important;
      display: block;
    }
    .widget-card.bigger-widget-card {
      width: 195px !important;
    }
  }
  /deep/ .card-title {
    background: none;
  }
  .update-snapshot {
    opacity: 0;
    transition: all 0.4s;
    -moz-transition: all 0.4s;
    -webkit-transition: all 0.4s;
  }
  .update-snapshot:hover {
    opacity: 1;
  }
</style>
