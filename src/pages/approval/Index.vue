<template>
  <q-page>
    <tw-breadcrumbs></tw-breadcrumbs>
    <template v-if="$route.name!=='approvalHome'">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
      <router-view v-else></router-view>
    </template>
    <q-card
      v-else
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page"
    >

        <q-carousel
          arrows
          animated
          v-model="slide"
          height="10rem"
        >
          <q-carousel-slide name="first" img-src="icons/approval-background.png">
            <div class="custom-caption">
              <div class="text-h4">OA审批</div>
              <div class="text-subtitle1">请假、加班单据提交</div>
            </div>
          </q-carousel-slide>
        </q-carousel>

      <q-card-section class="row">
        <q-btn
          v-for="item in quickLinks"
          class="col-3"
          :key="item.name"
          stack
          flat
          :color="item.color"
          :icon="item.icon"
          @click="toList(item)"
          size="lg"
        >
          <template>
            <div class="text-dark q-pt-sm text-body2">{{item.label}}</div>
          </template>
        </q-btn>
      </q-card-section>
      <q-separator v-if="quickLinks.length>0" />
      <q-card-section class="row">
        <q-btn
          stack
          flat
          class="col-3"
          v-for="template in templates"
          :key="template.name"
          :color="template.color"
          :icon="template.icon"
          @click="toForm(template)"
        >
          <template>
            <div class="text-dark q-pt-sm text-body2">{{template.label}}</div>
          </template>
        </q-btn>
      </q-card-section>
    </q-card>
    <tw-page-scroller />
  </q-page>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'approvalHome',
  props: {},
  data () {
    return {
      slide: 'first'
    }
  },
  computed: {
    ...mapGetters('approval', ['quickLinks', 'templates'])
  },
  created () { },
  mounted () { },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      handler (route) {
        if (this.$q.platform.is.mobile) return
        if (!route.path.includes('approval')) return
        this.setModuleBreadcrumbs()
        route.name !== 'approvalHome' &&
          this.pushWidgetBreadcrumb({ id: `approvalHome`, title: 'OA审批', to: { name: 'approvalHome' } })
      }
    }
  },
  methods: {
    ...mapMutations('breadcrumbs', ['pushWidgetBreadcrumb']),
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs']),
    toForm (item) {
      this.$router.push({ name: 'approvalForm', params: { type: item.name, templateId: item.templateId } })
    },
    toList (item) {
      this.$router.push({ name: 'approvalList', params: { type: item.name } })
    }
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwPageScroller: () => import('components/base/TwPageScroller')
  }
}
</script>

<style scoped lang="scss">
.custom-caption {
  position: absolute;
  left:10vw;
  top:40px;
  text-align: center;
  padding: 12px;
  color: white;
  background-size: cover;
  background-color: rgba(0, 0, 0, 0);
}
</style>
