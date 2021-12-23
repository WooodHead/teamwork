<!-- 应用网格 -->
<template>
  <q-card
    flat
    bordered
    class="q-pa-none"
    :style="$q.platform.is.mobile? '': 'min-width:543px;max-height: 80vh;'"
  >
    <!-- 常用功能 -->
    <q-card-section class="row q-pb-none">
      <div class="relative-position full-width text-center text-weight-bold text-subtitle1 q-py-xs">
        <span>{{$t(`home.myApps.usuallyNotes`)}}</span>
        <!-- edit -->
        <q-btn
          v-if="editing"
          color="positive"
          :label="$t(`label.ok`)"
          class="absolute-right"
          @click="edit"
        />
        <q-btn
          v-else
          color="primary"
          :label="$t(`label.edit`)"
          class="absolute-right"
          @click="editing=!editing"
        />
      </div>
      <div
        v-if="editing"
        class="full-width text-center"
      >
        {{$t(`home.myApps.dragNotes`)}}
      </div>
      <q-separator class="full-width q-mt-xs q-mb-md" />
      <!-- 列表 -->
      <draggable
        v-bind="dragOptions"
        v-model="commonUseApps"
        handle=".handle"
        class="row full-width"
      >
        <div
          v-for="(app,index) in commonUseApps"
          class="myapp-container q-mb-sm relative-position col-3"
          :key="app.name"
        >
          <!-- delete -->
          <q-btn
            v-if="editing"
            stack
            flat
            dense
            round
            icon="remove_circle_outline"
            color="negative"
            class="absolute-top-right"
            :size="$q.platform.is.mobile?'11px':'13px'"
            style="z-index: 9"
            @click="remove(index)"
          />
          <!-- 角标 -->
          <template v-else>
            <q-badge
              v-if="app.recommend"
              class="absolute-top-right"
              color="red"
              floating
            >
              推荐
            </q-badge>
            <q-badge
              v-if="app.latest"
              class="absolute-top-right"
              color="red"
              floating
            >
              最新
            </q-badge>
          </template>
          <q-btn
            v-if="app.to.external"
            stack
            flat
            :title="app.notes"
            :color="app.color"
            :icon="app.icon"
            :size="$q.platform.is.mobile?'md':'lg'"
            class="full-width"
            type="a"
            :href="app.to.path"
            target="_blank"
          >
            <template>
              <div class="text-dark q-pt-sm text-body2">
                {{app.label}}
              </div>
            </template>
          </q-btn>
          <q-btn
            v-else
            stack
            flat
            :title="app.notes"
            :color="app.color"
            :icon="app.icon"
            :size="$q.platform.is.mobile?'md':'lg'"
            class="full-width"
            :to="app.to"
          >
            <template>
              <div class="text-dark q-pt-sm text-body2">
                {{app.label}}
              </div>
            </template>
          </q-btn>
        </div>
      </draggable>
    </q-card-section>
    <!-- 其他功能 -->
    <q-card-section class="row">
      <div class="full-width text-center text-weight-bold text-subtitle1 q-py-xs">
        {{$t(`home.myApps.selectNotes`)}}
      </div>
      <q-separator class="full-width q-mt-xs q-mb-md" />
      <div
        v-for="app in otherApps"
        class="myapp-container q-mb-sm relative-position col-3"
        :key="app.name"
      >
        <!-- 添加按钮 -->
        <q-btn
          v-if="editing"
          stack
          flat
          dense
          round
          icon="add_circle"
          color="positive"
          class="absolute-top-right"
          :size="$q.platform.is.mobile?'11px':'13px'"
          style="z-index: 9"
          @click="add(app)"
        />
        <!-- 角标 -->
        <template v-else>
          <q-badge
            v-if="app.recommend"
            class="absolute-top-right"
            color="red"
            floating
          >
            推荐
          </q-badge>
          <q-badge
            v-if="app.latest"
            class="absolute-top-right"
            color="red"
            floating
          >
            最新
          </q-badge>
        </template>
        <!-- 应用按钮 -->
        <q-btn
          v-if="app.to.external"
          stack
          flat
          :title="app.notes"
          :color="app.color"
          :icon="app.icon"
          :size="$q.platform.is.mobile?'md':'lg'"
          class="full-width"
          type="a"
          :href="app.to.path"
          target="_blank"
        >
          <template>
            <div class="text-dark q-pt-sm text-body2">
              {{app.label}}
            </div>
          </template>
        </q-btn>
        <q-btn
          v-else
          stack
          flat
          :title="app.notes"
          :color="app.color"
          :icon="app.icon"
          :size="$q.platform.is.mobile?'md':'lg'"
          class="full-width"
          :to="app.to"
        >
          <template>
            <div class="text-dark q-pt-sm text-body2">
              {{app.label}}
            </div>
          </template>
        </q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import Person from '@/store/person/model'
import { mapState, mapGetters, mapActions } from 'vuex'
import draggable from 'vuedraggable'
import setMyinfo from '@/utils/local-storage-myinfo'
import { showSuccessMessage } from '@/utils/show-message'
export default {
  name: 'AppGrid',
  props: {
  },
  data () {
    return {
      editing: false,
      dragOptions: {
        animation: 300,
        delay: 100,
        scroll: true,
        scrollSensitivity: '500',
        // 样式
        ghostClass: 'ghost',
        chosenClass: 'chosen'
      },
      commonUseApps: _.cloneDeep(this.$store.getters['home/commonUseApps'])
    }
  },
  computed: {
    ...mapState('home', ['apps']),
    ...mapGetters('home', ['myAppsOfOnlyName']),
    otherApps () {
      const commonUseAppsOfOnlyName = this.commonUseApps.map(item => item.name)
      const other = _.difference(this.myAppsOfOnlyName, commonUseAppsOfOnlyName)
      return other.map(item => this.apps[item])
    }
  },
  methods: {
    ...mapActions('person', ['updatePersonField']),
    // 弹框中增加、移除功能
    remove (index) {
      this.$delete(this.commonUseApps, index)
      // _.remove(this.commonUseApps, { name: app.name })
    },
    add (app) {
      this.commonUseApps.push(app)
    },
    // 切换编辑、确定按钮
    edit () {
      this.$myinfo.settings.commonUseApps = this.commonUseApps.map(item => item.name)
      const toPerson = Person.to(this.$myinfo)
      this.updatePersonField({ id: this.$myinfo.id, fieldName: 'settings', value: JSON.stringify(toPerson.Settings) })
        .then(res => {
          setMyinfo(this.$myinfo)
          this.$emit('edit', this.commonUseApps)
          showSuccessMessage(this.$t(`settings.settingSucceed`))
        })
    }
  },
  components: {
    draggable
  }
}

</script>

<style lang='scss' scoped>
.ghost {
  border-radius: 4px;
  background-color: #ecf9fd;
}
.chosen {
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12);
}
/deep/.myapp-container .q-btn__wrapper {
  padding: 4px 1px;
}
</style>
