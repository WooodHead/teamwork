<template>
  <div class="row q-col-gutter-md">
    <div
      v-for="item in data"
      :key="item.key"
      :class="item.type==='textarea'?'col-12':'col-12 col-md-6'"
    >
      <div class="row text-left">
        <span class="text-grey" v-html="item.key"></span>&emsp;&emsp;
        <span class="text-black ellipsis" v-html="item.value"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KeyValueLayout',
  props: {
    data: {
      type: Array,
      require: true,
      default: () => [],
      desc: "格式：[{key:'',value:'',type:''}]，其中的type可以是:tel,mail,link,text,person,分别表示电话，邮箱，链接，多行文本，人员"
    }
  }
}
</script>

<style lang="scss" scoped>
</style>>
