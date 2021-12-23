<template>
  <!-- 职级展示 -->
  <q-page
    class="flex flex-center"
    :class="'bg-'+bg"
  >
    <q-card style="width:96vw;max-width:750px;">
      <q-card-section
        horizontal
        class="bg-primary text-white"
      >
        <q-card-section class="col-4 q-pa-none">
          <!-- 图片提示 -->
          <q-img src="emoji-jingdiaojun/精雕君-加油.gif" />
        </q-card-section>
        <q-card-section>
          <!-- 姓名部门信息 -->
          <div class="vertical-middle">
            <div class="text-h4 text-bold q-pb-md">{{position.psonName}}</div>
            <div class="text-subtitle1">{{position.organizeName}}</div>
          </div>
        </q-card-section>
      </q-card-section>

      <q-separator />
      <!-- 职级信息 -->
      <div class="q-pb-md text-center text-primary">
        <div class="text-h5 text-bold q-pt-xl">{{position.value}}</div>
        <div class="text-h5 text-bold q-pt-lg q-pb-xl">{{position.rank}}</div>
        <q-separator />
        <div class="text-caption text-bold q-pt-md">{{position.blessing}}</div>
      </div>
    </q-card>
    <div class="absolute-bottom text-center">
      <q-btn
        flat
        icon="chat"
        color="grey-9"
        :label="$t('feedback.module')"
        @click="feedback"
      />
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PositionCard',
  props: {
    position: {
      type: Object,
      require: true,
      default: () => {
        return {}
      }
    },
    bg: {
      type: String,
      default: 'blue-1',
      require: false,
      description: '背景色'
    }
  },
  methods: {
    feedback () {
      this.$router.push({
        name: 'chat',
        params: {
          category: 'person',
          objectID: +this.position.createByID
        }
      })
    }
  }
}
</script>

<style>
</style>
