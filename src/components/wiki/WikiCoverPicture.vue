<template>
  <div class="wiki-cover-picturer-content">
    <!-- 左侧区域 -->
    <div class="wiki-cover-picturer-content-left">
      <wiki-space-card bigger :model="model" :cardCanClick="false"/>
    </div>
    <!-- 右侧区域 -->
    <div class="wiki-cover-picturer-content-right">
      <div class="wiki-tabs-selector-wrap">
      <div class="wiki-cover-picturer-content-right-card-list standard-scrollbar">
        <div class="wiki-cover-picturer-content-right-card-list-img-list">
            <div 
              class="img-item"
              v-for="wikiCoverPicture in allWikiCoverPictures"
              :key="wikiCoverPicture.name">
              <img  
                :src="wikiCoverPicture.path" 
                :class="model.snapshotPath===wikiCoverPicture.path?'wiki-cover-picturer-content-right-card-active':''"
                @click="model.snapshotPath = wikiCoverPicture.path"/>
                <div class="text-grey-7 text-caption" style="text-indent:6px;">{{wikiCoverPicture.name}}</div>
              
            </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'WikiCoverPicture',
  props: {
    model: {
      type: Object,
      default: function () {
        return {
          title: '标题',
          notes: '备注内容',
          coverpicture: '/icons/wiki-cover-picture/picture_11.PNG'
        }
      }
    }
  },
  components: {
    WikiSpaceCard: () => import('components/wiki/WikiSpaceCard')
  },
  computed: {
    ...mapState('wiki', ['allWikiCoverPictures']),
    // 卡片字体颜色
    textColor () {
      let wikiCoverPicture = _.find(this.allWikiCoverPictures, { 'path': this.model.snapshotPath })
      return wikiCoverPicture && wikiCoverPicture.intensity
    }
  }
}
</script>

<style lang="scss" scoped>
.wiki-cover-picturer-content {
 display:-webkit-box;
 display:-ms-flexbox;
 display:flex;
 height:343px;
 padding:14px 0;
 margin-top:10px;
 border-radius: 4px;
 background: rgba(0, 0, 0, 0.05);
 width:100%
}
.wiki-cover-picturer-content-left {
 position:relative;
 -ms-flex-negative:0;
 flex-shrink:0;
 height:100%;
 margin-left:12px;
 padding:14px 22px;
 overflow:auto;
 color:$grey-9;
 -webkit-transition:all .3s;
 -o-transition:all .3s;
 transition:all .3s
}
.wiki-cover-picturer-content-right {
 margin:0px 32px 0px 12px;
 position:relative;
 display:-webkit-box;
 display:-ms-flexbox;
 display:flex;
 -webkit-box-orient:vertical;
 -webkit-box-direction:normal;
 -ms-flex-direction:column;
 flex-direction:column;
 -webkit-box-flex:1;
 -ms-flex-positive:1;
 flex-grow:1
}
.wiki-cover-picturer--content-right .wiki-tabs-selector-wrap {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    overflow: hidden;
    height: 100%;
}
.wiki-cover-picturer-content-right .wiki-tabs-selector-container {
 -ms-flex-negative:0;
 flex-shrink:0;
 padding-left:4px
}
.wiki-cover-picturer-content-right-card-list {
 position:relative;
 width:100%;
 display:-webkit-box;
 display:-ms-flexbox;
 display:flex;
 -ms-flex-wrap:wrap;
 flex-wrap:wrap;
 height:316px;
 padding-top:12px;
 padding-left: 3px;
 overflow-y:auto;
 right: -8px;
}
.wiki-cover-picturer-content-right-card-list::-webkit-scrollbar {
 -webkit-appearance:none;
 background:rgba(0,0,0,0);
 width:6px
}
.wiki-cover-picturer-content-right-card-list::-webkit-scrollbar-thumb {
 background:$grey-8;
 width:6px;
 border-radius:3.5px;
 display:none
}
.wiki-cover-picturer-content-right-card-list::-webkit-scrollbar-track {
 background-color:rgba(0,0,0,0);
 display:none
}
.wiki-cover-picturer-content-right-card-list:hover::-webkit-scrollbar-thumb {
 display:block;
 width:6px
}
.wiki-cover-picturer-content-right-card-list:hover::-webkit-scrollbar-track {
 display:block
}
.wiki-cover-picturer-content-right-card-list .ps__rail-y {
 height:0!important;
 right:-2px!important
}
.wiki-cover-picturer-content-right-card-list .ps__rail-y.ps--clicking,
.wiki-cover-picturer-content-right-card-list .ps__rail-y:focus,
.wiki-cover-picturer-content-right-card-list .ps__rail-y:hover {
 height:0
}
.wiki-cover-picturer-content-right-card-list .ps__rail-y.ps--clicking>.ps__thumb-y,
.wiki-cover-picturer-content-right-card-list .ps__rail-y:focus>.ps__thumb-y,
.wiki-cover-picturer-content-right-card-list .ps__rail-y:hover>.ps__thumb-y {
 background-color:rgba(31,35,41,.3);
 width:6px
}
@-moz-document url-prefix() {
 .wiki-cover-picturer-content-right-card-list {
  scrollbar-width:none
 }
}
.wiki-cover-picturer-content-right-card-list-img-list .img-item{
 width:84.48px;
 margin-bottom:12px;
 cursor:pointer;
 margin-right:8px;
 display: inline-block;
 padding-top: 1px;
}
.wiki-cover-picturer-content-right-card-list-img-list img {
 width:84.48px;
 height:113.52px;
 border:1px solid $grey-4;
 background-color:$grey-4;
 cursor:pointer;
 border-radius:4px;
}
.wiki-cover-picturer-content-right-card-list-img-list img:not([src]) {
 display:none
}
.wiki-cover-picturer-content-right-card-list-img-list img:not(.wiki-cover-picturer-content-right-card-active):hover {
 padding:1px;
 border:1px solid $primary;
 -webkit-box-sizing:border-box;
 box-sizing:border-box;
 -webkit-box-shadow:0 6px 25px $grey-4;
 box-shadow:0 6px 25px $grey-4;
 -webkit-transform:scale(1.04) translateY(-1px);
 -ms-transform:scale(1.04) translateY(-1px);
 transform:scale(1.04) translateY(-1px);
 -webkit-transition:all .3s ease-out 0s;
 -o-transition:all .3s ease-out 0s;
 transition:all .3s ease-out 0s
}
.wiki-cover-picturer-content-right img.wiki-cover-picturer-content-right-card-active {
 border-color:rgba(0,0,0,0);
 -webkit-box-shadow:$primary 0 0 0 2px;
 box-shadow:$primary 0 0 0 2px
}
.wiki-cover-picturer-content-right .wiki-tabs-selector-container {
    -ms-flex-negative: 0;
    flex-shrink: 0;
    padding-left: 4px;
    position: relative;
    overflow-x: auto;
    overflow-y: hidden;
}
.wiki-tabs-selector-wrap .wiki-tabs-selector {
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
}
.wiki-tabs-selector-wrap .wiki-tabs-selector-item {
    padding: 2px 8px;
    margin-right: 8px;
    border-radius: 6px;
    text-align: center;
    list-style: none;
    cursor: pointer;
    color: $grey-10;
    white-space: nowrap;
    font-size: 12px;
    line-height: 20px;
}
.wiki-tabs-selector-wrap .wiki-tabs-selector-active {
    font-weight: 700;
    color: $primary;
    background: $blue-2;
}
</style>
