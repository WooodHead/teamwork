<template>
  <div
    ref="wrap"
    class="atwho-wrap col"
    @compositionstart="handleCompositionStart"
    @compositionend="handleCompositionEnd"
    @input="handleInput()"
    @keydown.capture="handleKeyDown"
  >
    <div
      v-if="atwho"
      class="atwho-panel"
      :style="style"
    >
      <div class="atwho-inner">
        <div
          class="atwho-view"
          ref="atwhoView"
        >
          <ul class="atwho-ul">
            <li
              v-for="(item, index) in atwho.list"
              class="atwho-li"
              :class="isCur(index) && 'atwho-cur'"
              :ref="isCur(index) && 'cur'"
              :data-index="index"
              @mouseenter="handleItemHover"
              @click="handleItemClick"
              :key="'attho-li-' + index"
            >
              <slot
                name="item"
                :item="item"
              >
                <!-- <tw-avatar
                  size="md"
                  :id="item.id"
                  :name="item[nameKey]"
                  :popupCard='false'
                /> -->
                <q-item-label
                  class="q-ml-sm"
                  v-html="item[nameKey]"
                />
              </slot>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 用于插入自定义模板 -> 有bug -->
    <span
      v-show="false"
      ref="embeddedItem"
    >
      <slot
        name="embeddedItem"
        :current="currentItem"
      ></slot>
    </span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'AtTemplate',
  components: {
    // TODO 太多的TwAvatar容易卡住，暂时不展示头像
    // TwAvatar: ()=> import('components/base/TwAvatar')
  }
}
</script>

<style lang="scss" scoped>
.atwho-view {
  color: black;
  border-radius: 3px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  min-width: 120px;
  z-index: 11110 !important;
}
.atwho-ul {
  list-style: none;
}
.atwho-li {
  display: block;
}
.atwho-view {
  border-radius: 6px;
  box-shadow: 0 0 10px 0 rgba(101, 111, 122, 0.5);
}
.atwho-ul {
  padding: 0;
  margin: 0;
}
.atwho-li {
  box-sizing: border-box;
  // 此项值与 At.vue openPanel()方法有关联
  height: 40px;
  padding: 0 12px;
  white-space: nowrap;
  display: flex;
  align-items: center;
}
.atwho-cur {
  background: #5bb8ff;
  color: white;
}
.atwho-wrap {
  position: relative;
}
.atwho-panel {
  position: absolute;
}
.atwho-inner {
  position: relative;
}
.atwho-view {
  position: absolute;
  bottom: 0;
  left: -0.8em; // 抵消左边距
  cursor: default;
  background-color: rgba(255, 255, 255, 0.94);
  min-width: 160px;
  max-width: 360px;
  // 此项值与 At.vue openPanel()方法有关联
  max-height: 300px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 11px;
    height: 11px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    min-height: 36px;
    border: 2px solid transparent;
    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;
    background-clip: padding-box;
    border-radius: 7px;
    background-color: #c4c4c4;
  }
}
</style>
