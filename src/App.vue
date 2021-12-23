<template>
  <div id="q-app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
import { LocalStorage } from 'quasar'
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  },
  created () {
    // 支持自定义图标库
    this.$q.iconMapFn = (iconName) => {
      if (iconName.startsWith('app:') === true) {
        // we strip the "app:" part
        const name = iconName.substring(4)

        return {
          cls: 'tw-icon ' + name
        }
      }
    }
  },
  mounted () {
    document.getElementById('incoming-info') && document.getElementById('incoming-info').remove()
    // 能清除之前缓存的地图信息,否则容易把LocalStorage占满
    const amapKeys = Object.keys(LocalStorage.getAllKeys()).filter(key => key.match(/^_AMap_/))

    amapKeys.forEach(key => {
      // console.log(key)
      LocalStorage.remove(key)
    })
  }
}
</script>
