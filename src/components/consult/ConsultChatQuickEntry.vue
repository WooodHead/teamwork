<template>
  <div class="q-pb-sm q-gutter-x-sm">
    <q-btn
      dense
      rounded
      outline
      color="primary"
      :label="$t('consult.consultTitle')"
      @click="toConsultItemForm"
    >
      <q-dialog
        :maximized="$q.screen.lt.sm"
        v-model="showConsultItemForm"
        transition-show="slide-up"
        transition-hide="slide-down"
        :position="$q.screen.lt.sm ? 'bottom' : 'standard'"
      >
        <q-card class="full-width">
          <q-card-section class="row items-center justify-center relative-position q-pb-none">
            <span class="text-subtitle1">{{$t('consult.addSelect.consultItem')}}</span>
            <div
              class="absolute-right q-mr-md"
              style="top:auto"
            >
              <q-btn
                icon="close"
                flat
                round
                dense
                v-close-popup
                @click.stop="showConsultItemForm=false"
              />
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-item
              clickable
              v-ripple
              v-for="item in items"
              :key="item.Id"
            >
              <q-item-section @click.stop="toConsultForm(item.Id)">{{item.Title}}</q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog
        persistent
        :maximized="$q.screen.lt.sm"
        v-model="showConsultForm"
        transition-show="slide-up"
        transition-hide="slide-down"
        class="full-width"
      >
        <consult-form
          class="fit"
          openType="add"
          :transactorId="+person.id"
          :itemId="+itemId"
          @cancel="showConsultForm=false"
        >
          <template v-slot:header>
            <q-bar class="bg-white">
              <q-space />
              <q-btn
                dense
                flat
                icon="close"
                @click="showConsultForm=false"
              />
            </q-bar>
          </template>
        </consult-form>
      </q-dialog>
    </q-btn>
    <q-btn
      v-if="!$q.screen.gt.xs"
      dense
      rounded
      outline
      color="primary"
      label="打电话"
      type="a"
      :href="person&&person.phone!=''?'tel:'+person.phone:'javascript:void(0);'"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    person: {
      type: Object,
      required: false,
      default: null
    }
  },
  data () {
    return {
      showConsultForm: false,
      showConsultItemForm: false,
      items: [],
      itemId: 0
    }
  },
  methods: {
    ...mapActions('consult', ['loadTransactor']),
    toConsultItemForm () {
      this.person.id && this.loadTransactor(Number(this.person.id)).then(res => {
        if (res) {
          if (res.items && res.items.length === 1) {
            this.itemId = res.items[0].Id
            this.showConsultForm = true
          } else {
            this.items = res.items
            this.showConsultItemForm = true
          }
        }
      })
    },
    toConsultForm (id) {
      this.itemId = +id
      this.showConsultItemForm = false
      this.showConsultForm = true
    }
  },
  components: {
    ConsultForm: () => import('components/consult/ConsultForm')
  }
}
</script>

<style scoped lang="scss">
</style>
