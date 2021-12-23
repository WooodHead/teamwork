<template>
  <q-card
    flat
    class="q-ma-md bg-primary5"
    style="border-radius: 12px;"
    v-if="show"
  >
    <div class="row justify-end">
      <q-btn
        icon="close"
        flat
        round
        dense
        @click="close"
      />
    </div>
    <q-card-section class="q-pt-none">
      <div class="row justify-center">
        <q-chat-message
          name="TeamWork支持团队"
          :avatar="$logo['favicon.ico']"
          :text="['系统新增了咨询受理时间的监控和匿名评价功能，欢迎大家使用！',
            '<strong class=\'text-negative text-subtitle1 \'>我们承诺：</strong>每个咨询都将跟踪到底，直到最终解决。']"
          text-html
          stamp="2021.07.22"
          size="16"
        >
        </q-chat-message>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { LocalStorage } from 'quasar'
const recommendClose = 'recommendClose'
export default {
  name: 'TwRecommend',
  props: {
    module: {
      type: String,
      require: true
    },
    text: {
      type: Array,
      require: true
    },
    stamp: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      show: true
    }
  },
  mounted () {
    LocalStorage.has(recommendClose) &&
      LocalStorage.getItem(recommendClose).includes(this.module) &&
      (this.show = false)
  },
  methods: {
    close () {
      this.show = false
      if (LocalStorage.has(recommendClose)) {
        let rc = LocalStorage.getItem(recommendClose)
        rc.push(this.module)
        LocalStorage.set(recommendClose, rc)
      } else {
        LocalStorage.set(recommendClose, [this.module])
      }
    }
  }
}
</script>

<style>
</style>
