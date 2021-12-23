<!-- 任务动态 -->
<template>
  <div>
    <!-- 标题 -->
    <div class="flex">
      <span>
        {{$t('activity.on')}}
        <router-link
          class="text-primary"
          :to="{name:'taskDetail',params:{category:activity.objectType,objectID:activity.objectId,id:activity.widget.on.id}}"
        >
          {{activity.widget.on.title}}
        </router-link>
        {{$t('activity.among')}}{{activity.actor}}{{$t(`activity.task.${activity.description}`)}}
      </span>
    </div>
    <!-- 列表 -->
    <div class="q-ml-sm content text-weight-regular text-caption">
      <div
        v-for="widget in activity.widgets"
        :key="widget.actTime"
        @click.capture.stop="toDetail(widget.id)"
      >
        <widget-task-item
          :task="{
          id: widget.id,
          name: widget.title,
          objectId: activity.objectId,
          objectType: activity.objectType,
          assignedTo: widget.detail.assignedTo,
          type: 'item',
          dateType: widget.detail.dateType,
          startTime: widget.detail.startTime,
          endTime: widget.detail.endTime,
          finished: activity.action === 'finish' ? true : false
        }"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskActivity',
  props: {
    activity: {
      type: Object,
      required: true
    }
  },
  components: {
    WidgetTaskItem: () => import('components/task/WidgetTaskItem')
  },
  data () {
    return {
    }
  },
  methods: {
    toDetail (id) {
      this.$router.push({
        name: 'taskDetail',
        params: {
          id: +id,
          category: this.activity.objectType,
          objectID: +this.activity.objectId
        }
      })
    }
  }
}

</script>

<style lang='scss' scoped>
/deep/.content {
  font-size: 0.85rem;
}
</style>
