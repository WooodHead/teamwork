<template>
  <div
    class="column date "
    :class="color()"
  >
    <div class="col-5 text-grey-1 text-center vertical-middle text-caption text-weight-bold moz-date-style">
      {{month}}
      <small v-if="diffYear">
        {{year}}
      </small>
    </div>
    <div class="col-7 text-center bg-white vertical-middle text-subtitle1 text-dark moz-date-style">
      {{day}}
    </div>
  </div>
</template>

<script>

import { date } from 'quasar'
const { formatDate, getDateDiff } = date
export default {
  name: 'TwDate',
  props: {
    date: {
      type: String,
      required: true
    }
  },
  computed: {
    dateFormat () {
      return this.date.replace(/-/g, '/')
    },
    diffYear () {
      const date = new Date(this.dateFormat)
      const today = new Date()
      return getDateDiff(date, today, 'years') !== 0
    },
    year () {
      const date = new Date(this.dateFormat)
      return formatDate(date, 'YY')
    },
    month () {
      const date = new Date(this.dateFormat)
      return formatDate(date, 'MMM')
    },
    day () {
      const date = new Date(this.dateFormat)
      return formatDate(date, 'D')
    }
  },
  methods: {
    color () {
      const rd = _.random(6, 9)
      const color = this.diffYear ? 'deep-orange' : 'light-green'
      return `bg-${color}-${rd} text-${color}-${rd}`
    }
  }
}
</script>

<style lang="scss" scoped>
  .date {
    min-width: 3.4em;
    height: 3.4em;
    border: 2px solid;
    border-radius: 4px;
  }
  @-moz-document url-prefix() {
    .moz-date-style {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
