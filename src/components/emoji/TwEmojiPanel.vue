<template>
  <q-card
    class="emoji-card "
    :class="{ 'emoji-font':$q.platform.is.win}"
  >
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab
        name="emoji表情"
        icon="insert_emoticon"
      />
      <q-tab
        name="精雕君"
        icon="child_care"
      />
    </q-tabs>
    <q-tab-panels v-model="tab">
      <q-tab-panel
        name="emoji表情"
        class="tw-emoji"
      >
        <q-btn
          v-for="(r,index) in other"
          :key="index"
          flat
          size="24px"
          :title="r.title"
          :label="r.emoji"
          @click="$emit('add',r.emoji)"
        />
      </q-tab-panel>

      <q-tab-panel
        name="精雕君"
        class="tw-jingdiaojun"
        :style="$q.platform.is.mobile ? 'grid-template-columns: repeat(auto-fill, 60px);':'grid-template-columns: repeat(auto-fill, 100px);'"
      >
        <q-btn
          v-for="(r,index) in jingdiaojun"
          :key="index"
          flat
          :title="r.title"
          :label="r.emoji"
          @click="$emit('add',r.path)"
        >
          <img
            :style="$q.platform.is.mobile ? 'height:40px;':'height:60px;'"
            :src="r.path"
          >
        </q-btn>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>
<script>
import emojis from '../emoji/emojis'
export default {
  name: 'TwEmojiPanel',
  data () {
    return {
      emojis,
      tab: 'emoji表情'
    }
  },
  computed: {
    other () {
      return this.emojis.other
    },
    jingdiaojun () {
      return this.emojis.jingdiaojun
    }
  }
}
</script>
<style lang="scss" scoped>
.emoji-card {
  width: 750px;
  height: 400px;
  max-width: 100%;
}
.tw-emoji {
  display: grid;
  justify-content: space-between;
  grid-template-columns: repeat(auto-fill, 50px);

}
.tw-jingdiaojun {
  display: grid;
  justify-content: space-between;
}
</style>
