<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <tw-header
      :title="$t('task.mystuff.title')"
      noMenu
    ></tw-header>
    <!-- 头部logo -->
    <q-card-section
      v-if="!$q.platform.is.mobile"
      class="text-center q-px-none"
    >
      <!-- 顶部头像 -->
      <tw-avatar
        :id="person.id"
        :name="person.name"
        :img="person.img"
      />
      <div class=" text-h5 q-pt-sm">
        {{$t('task.mystuff.title')}}</div>
    </q-card-section>
    <q-card-section class="q-px-xxl">
      <q-tabs
        v-model="tab"
        dense
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
        no-caps
      >
        <q-tab
          name="all"
          :label="$t('task.mystuff.myTasks')"
        />
        <q-tab
          name="dates"
          :label="$t('task.mystuff.myTasksWithDate')"
        />
        <q-tab
          name="assigned"
          :label="$t('task.mystuff.assignedByme')"
        />
        <q-tab
          name="notify"
          :label="$t('task.mystuff.notifyTome')"
        />
      </q-tabs>
      <div class="q-px-md">
        <q-separator />
      </div>
      <q-tab-panels
        v-model="tab"
        animated
      >
        <q-tab-panel name="all">
          <tasks-all />
        </q-tab-panel>
        <q-tab-panel name="dates">
          <tasks-with-date />
        </q-tab-panel>
        <q-tab-panel name="assigned">
          <tasks-assigned />
        </q-tab-panel>
        <q-tab-panel name="notify">
          <tasks-notify />
        </q-tab-panel>
      </q-tab-panels>

      <q-btn
        flat
        class="q-mt-md"
        color="primary"
        :label="$t(`task.mystuff.showCompletedTask.${tab}`)"
        @click="toCompletedTasks(tab)"
      />
    </q-card-section>
  </q-card>
</template>
<script>
import { LocalStorage } from 'quasar'
export default {
  data () {
    return {
      tab: 'all',
      person: LocalStorage.getItem('myself')
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    'tasks-all': () => import('components/mystuff/tasks/TasksAll'),
    'tasks-with-date': () => import('components/mystuff/tasks/TasksWithDate'),
    'tasks-assigned': () => import('components/mystuff/tasks/TasksAssigned'),
    'tasks-notify': () => import('components/mystuff/tasks/TasksNotify'),
    TwHeader: () => import('components/base/TwHeader')
  },
  methods: {
    toCompletedTasks (tab) {
      this.$router.push({
        name: 'myTasksCompleted',
        params: {
          type: tab
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped></style>
