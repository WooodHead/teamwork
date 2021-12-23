<template>
  <q-card>
    <q-card-section
      class="bg-white"
      style="position:sticky;top:0;z-index:999;"
    >
      <q-input
        v-model="search"
        dense
        outlined
        debounce="500"
        label="搜索"
      >
        <template v-slot:before>
          <q-select
            v-model="toggleClassify"
            :options="dropdownOptions"
            option-value="value"
            option-label="label"
            dense
            class="toggleClassify"
          />
        </template>
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <template v-if="validManufacturers.length>0">
        <q-list>
          <q-item
            v-for="manufacturer in validManufacturers"
            :key="manufacturer.id"
            clickable
            :class="{'bg-grey-3':!multiple&&manufacturer.id===value}"
            @click="itemClick(manufacturer)"
          >
            <q-item-section avatar>
              <tw-avatar
                :id="manufacturer.leaderId"
                size="md"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label class="ellipsis">
                <span>{{manufacturer.title}}</span>
              </q-item-label>
            </q-item-section>

            <q-item-section
              v-if="multiple"
              side
            >
              <q-checkbox
                v-model="selectedItems"
                :val="manufacturer"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </template>
      <template v-else>
        <tw-banner-no-result :info="$t('manufacturer.warning.noManufacturers')" />
      </template>
    </q-card-section>

    <q-card-actions
      v-if="multiple"
      align="right"
      class="bg-white"
      style="position:sticky;bottom:0;z-index:999;"
    >
      <q-btn
        dense
        outline
        :label="$q.lang.label.cancel"
        color="primary"
        class="q-px-sm"
        v-close-popup
      />
      <q-btn
        dense
        :label="$q.lang.label.ok"
        color="primary"
        class="q-px-sm"
        @click="$emit('selected-event',selectedItems)"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ManufacturerSelectPanel',
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult')
  },
  props: {
    value: { type: [Number, Array], desc: '选中的生产单位' },
    multiple: { type: Boolean, default: false, desc: '是否多选' }
  },
  data () {
    return {
      search: '',
      selectedItems: [],
      dropdownOptions: [
        { label: '全部', value: 'all' },
        { label: '内部', value: 'internal' },
        { label: '外协', value: 'outsource' }
      ],
      toggleClassify: { label: '全部', value: 'all' }
    }
  },
  computed: {
    ...mapGetters('manufacturer', ['manufacturers']),
    validManufacturers () {
      return this.manufacturers.filter(m =>
        (this.search === '' || (this.search !== '' && m.title.includes(this.search))) &&
        (this.toggleClassify.value === 'all' ||
          (this.toggleClassify.value !== 'all' && m.classify === this.toggleClassify.value))
      )
    }
  },
  methods: {
    ...mapActions('manufacturer', ['loadManufacturers']),
    itemClick (item) {
      if (this.multiple) {
        this.selectedItems.some(m => m.id === item.id)
          ? this.selectedItems.splice(this.selectedItems.findIndex(m => m.id === item.id), 1)
          : this.selectedItems.push(item)
      } else {
        this.$emit('selected-event', item)
      }
    }
  },
  created () {
    let that = this
    this.loadManufacturers()
      .then(res => {
        if (that.multiple) {
          that.selectedItems = res.filter(m => that.value.includes(m.id))
        }
      })
  }
}
</script>

<style lang='scss' scoped>
/deep/.toggleClassify .q-field__control {
  padding-left: 8px;
}
/deep/.toggleClassify .q-field__native{
  padding: 6px 0px;
}
</style>
