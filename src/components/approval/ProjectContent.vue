<!-- 内容中项目自己需要显示的内容-->
<template>
  <div>
    <div>
      <span class="text-grey-7">{{$t('approval.isScientificProject')}}</span>
      <div class="text-subtitle1 q-py-md q-px-lg">{{classify}}</div>
    </div>
    <div>
      <span class="text-grey-7">{{$t('approval.isSaled')}}</span>
      <div class="text-subtitle1 q-py-md q-px-lg">{{saled?'是':'否'}}</div>
    </div>
    <div>
      <span class="text-grey-7">{{$t('productDev.relate')}}</span>
      <div class="text-subtitle1 q-py-md q-px-lg q-gutter-x-md">
        <span
          v-for="obj in relatedProductDev"
          :key="obj.id"
        >
          {{obj.title}}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'ProjectContent',
  props: {
    classify: {
      type: String,
      required: true,
      description: '是否研发类项目'
    },
    saled: {
      type: Boolean,
      required: false,
      description: '是否形成销售'
    },
    id: {
      type: [String, Number],
      required: true,
      description: '项目ID'
    }
  },
  computed: {
    ...mapState('resource', ['relationType']),
    ...mapGetters('resource', ['resourceRelations', 'categoryRelations']),
    relatedIds () {
      let realtions = this.resourceRelations({ category1: 'project', id1: +this.id, category2: 'productDev', type: this.relationType['project']['productDev'] })
      return realtions && realtions.map(r => r.selectId)
    },
    relatedProductDev () {
      return this.categoryRelations({ category: 'productDev', ids: this.relatedIds })
    }
  },
  mounted () {
    this.loadResourceRelations({ category1: 'project', id1: +this.id, category2: 'productDev', type: this.relationType['project']['productDev'], fields: 'Select' })
  },
  methods: {
    ...mapActions('resource', ['loadResourceRelations'])
  }
}
</script>

<style lang='scss' scoped>
</style>
