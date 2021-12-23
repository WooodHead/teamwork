<template>
  <q-card flat>
    <q-card-section class="row items-center q-px-none">
      <span :class="$q.screen.gt.xs?'text-h5':'text-subtitle1'">
        {{$t('consult.consultDetail.appraiseArea')}}
        <q-badge
          outline
          color="grey-8"
          align="middle"
          :label="$t('consult.consultDetail.anonymity')"
        />
      </span>
      <div class="col q-pl-sm">
        <q-separator
          color="dark"
          :style="$q.screen.gt.xs?'height:3px':'height:1px'"
        />
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none q-px-none">
      <div class="row justify-center">
        <q-rating
          v-model="ratingModel"
          max="5"
          size="3em"
          color="yellow"
          icon="star_border"
          icon-selected="star"
          no-dimming
          @click="showAppraiseCard=true"
        />
      </div>
      <div v-if="showAppraiseCard">
        <div class="text-center text-orange q-py-sm">{{ratingHint()}}</div>
        <q-input
          v-model="content"
          type="textarea"
          :placeholder="$t('consult.consultDetail.inputAppraise')"
          outlined
          autofocus
        />
        <q-btn
          class="q-mt-sm"
          color="primary"
          rounded
          :label="$t('consult.consultDetail.anonymousEvaluation')"
          @click="$emit('appraise',{rate:ratingModel,content:content})"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'ConsultAppraise',
  data () {
    return {
      ratingModel: 0,
      showAppraiseCard: false,
      content: ''
    }
  },
  methods: {
    ratingHint () {
      let ratingHint = ''
      switch (this.ratingModel) {
        case 1:
          ratingHint = this.$t('consult.consultDetail.appraise.one')
          break
        case 2:
          ratingHint = this.$t('consult.consultDetail.appraise.two')
          break
        case 3:
          ratingHint = this.$t('consult.consultDetail.appraise.three')
          break
        case 4:
          ratingHint = this.$t('consult.consultDetail.appraise.four')
          break
        case 5:
          ratingHint = this.$t('consult.consultDetail.appraise.five')
          break
      }
      return ratingHint
    }
  }
}
</script>
