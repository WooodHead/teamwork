
<template>
  <div>
    <a
      class="text-primary text-weight-bold "
      href="javascript:void(0);"
      @click="toDetail(team)"
      v-html="team.title"
    ></a>
    <div class="q-mt-xs q-gutter-xs">
      <span
        v-for="(id,index) in team.members"
        :key="index"
      >
        <tw-avatar
          size="md"
          :id="id"
        />
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    team: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    }
  },
  components: {
    'tw-avatar': () => import('components/base/TwAvatar')
  },
  methods: {
    toDetail (model) {
      this.$router.push({
        name: 'teamDetail',
        params: {
          id: +model.id
        }
      })
    }
  },
  mounted () {
  }
}

</script>

<style lang='stylus' scoped></style>
