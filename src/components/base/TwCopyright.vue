<template>
  <div
    v-if="copyright"
    class=" text-center text-grey-8 q-pa-sm"
  >
    <p
      class="q-ma-none text-center"
      style="font-size: 12px"
    >
      © 版权所有 {{copyright.owner}} | 法律声明 |
      <a
        class="text-grey-8"
        href="https://beian.miit.gov.cn"
        target="_blank"
      >
        备案号：{{copyright.beianCode}}
      </a>
      |
      <q-avatar size="xs">
        <img src="icons/beian.png">
      </q-avatar>
      <a
        :href="`http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${copyright.recordCode}`"
        target="_blank"
        class="text-grey-8"
      >
        {{copyright.wangan}}备{{copyright.recordCode}}号
      </a>
    </p>
  </div>
</template>
<script >
const { copyright } = require('app/app.config.js')
export default {
  name: 'TwCopyright',
  data () {
    return {
      copyright
    }
  }
}
</script>
