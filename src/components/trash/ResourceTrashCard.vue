<template>
  <div class="widget-card-section text-left full-height">
    <!-- 资源卡片 -->
    <div class="relative-position text-body2">
      <template>
        <q-scroll-area style="height: 180px; max-width: 300px;">
          <q-card-section class="q-pb-none">
            <div class="q-mb-sm text-center">
              <q-avatar
                :color="apps[model.resourceType].color"
                text-color="white"
                :icon="apps[model.resourceType].icon"
              />
            </div>
            <div class="q-mb-sm text-subtitle2 text-center text-weight-bold resource-title">{{model.title || model.name}}</div>
            <div
              class="q-mb-xs text-caption"
              v-html="model.content"
            ></div>
            <div>
            </div>
          </q-card-section>
          <!-- 成员 -->
          <q-card-section
            v-if="model.members && model.members.length"
            class="row q-pt-none no-wrap q-gutter-xs flex flex-center"
          >
            <template v-if="model.members.length<5">
              <tw-avatar
                v-for="member in model.members"
                :key="`order_${model.id}_${member}`"
                :id="member"
                size="sm"
              />
            </template>
            <template v-else>
              <tw-avatar
                v-for="member in model.members.slice(0,4)"
                :key="`${model.resourceType}_${model.id}_${member}`"
                :id="member"
                size="sm"
              />
              <q-avatar
                text-color="grey-7"
                style="border:1px solid #757575;letter-spacing:-1px;text-indent:-5px"
                size="sm"
                font-size="0.8rem"
              ><span>+{{model.members.length-4}}</span></q-avatar>
            </template>
          </q-card-section>
        </q-scroll-area>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ResourceTrashCard',
  components: {
    TwAvatar: () => import('components/base/TwAvatar')
  },
  props: {
    model: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('home', ['apps'])
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
/deep/ .q-checkbox__bg {
  display: inline-block;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  vertical-align: middle;
}
.trash-document-card.widget-card,
.trash-folder-card.widget-card {
  width: 100% !important;
}
.resource-title {
  word-break: break-all;
}
/deep/ .tw-icon {
  font-size: 24px;
}
</style>
