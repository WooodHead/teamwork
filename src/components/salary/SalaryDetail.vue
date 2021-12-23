<template>
  <q-card
    flat
    :class="[$q.screen.gt.sm?'q-pa-lg':'q-pa-md', 'detail-card']"
  >
    <q-card-section
      class="flex justify-between items-center text-white"
      :class="`bg-${primaryColor}`"
    >
      <div>
        <p class="text-weight-bold text-subtitle1">{{modelList.salaryYear}} 年 {{modelList.salaryMonth}} 月{{$t(`salary.salaryType.${modelList.type}`)}}</p>
        <div>
          <span>{{actualSalaryFields}}</span>
          <q-icon
            v-if="!isPreview"
            :name="seeActualSalary?'visibility':'visibility_off'"
            class="q-ml-sm cursor-pointer"
            @click="seeActualSalary = !seeActualSalary"
          />
        </div>
      </div>
      <div>
        <p class="text-h4 q-mb-none">{{actualSalary}}</p>
      </div>
    </q-card-section>
    <q-card-section class="q-pb-none">
      <p
        class="flex justify-between q-mb-none q-py-sm text-subtitle1 salary-item"
        v-for="(item, key) in modelList.value"
        :key="key"
      >
        <span class="text-grey-7">{{key}}</span>
        <span class="text-grey-9">{{seeActualSalary?item:'****'}}</span>
        <!-- <span class="text-grey-9">{{item}}</span> -->
      </p>
    </q-card-section>
  </q-card>
</template>

<script>
const config = require('app/app.config.js')
export default {
  name: 'SalaryDetail',
  props: {
    isPreview: {
      type: Boolean,
      default: false
    },
    model: {
      type: Object
    },
    primaryColor: {
      type: String,
      default: 'primary'
    },
    type: {
      type: String,
      default: 'salary'
    }
  },
  data () {
    return {
      seeActualSalary: true,
      modelList: {},
      actualSalaryFields: config.salary.defaultActual[this.type]
    }
  },
  computed: {
    actualSalary () {
      if (this.seeActualSalary) {
        return `${this.model.value[config.salary.defaultActual[this.type]]}`
      } else {
        return '****'
      }
    }
  },
  watch: {
    model () {
      this.modelList = this.model
    }
  },
  methods: {
  },
  mounted () {
    // if (typeof module !== 'undefined' && module.exports) { // CMD
    //   module.exports = __svgWM
    // } else if (typeof define === 'function' && define.amd) { // AMD
    //   define(function () {
    //     return __svgWM
    //   })
    // } else {
    //   window.__svgWM = this.__svgWM
    // }
    this.modelList = this.model
  }
}
</script>

<style lang="scss" scoped>
.salary-item {
  border-bottom: 1px solid $grey-2;
}
.salary-item:last-child {
  border-bottom: none;
}
</style>
