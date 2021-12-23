<template>
  <q-list dense>
    <q-virtual-scroll
      :items="postions"
      separator
    >
      <template v-slot="{ item, index }">
        <q-item
          :key="item.id"
          dense
        >
          <q-item-section
            avatar
            class="col-2"
          >
            <q-item-label>
              <q-badge
                v-if="item.sendStatus!==1"
                :color="sendStatusStyle[item.sendStatus]"
                :label="sendStatusStr[item.sendStatus]"
              />
              <q-badge
                v-else
                :color="item.isRead===1?'positive':'grey-6'"
                :label="$t('position.filterOptions.'+(item.isRead===1?'isRead':'unRead'))"
              />
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label caption> {{item.recordNum }}</q-item-label>
            <q-item-label> {{ item.psonName }}</q-item-label>
          </q-item-section>
          <q-item-section>
            {{item.organizeName }}
          </q-item-section>
          <q-item-section>
            <q-btn
              flat
              dense
              :label="$t('position.showPosition')"
              @click="$emit('viewDetail',item.recordNum)"
              class="q-px-sm text-positive"
            />
          </q-item-section>
        </q-item>
        <q-separator
          spaced
          inset
        />
      </template>
    </q-virtual-scroll>
  </q-list>
</template>

<script>
export default {
  name: 'PositionList',
  props: {
    postions: {
      type: Array,
      require: false,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      sendStatusStr: [
        this.$t('position.filterOptions.unSend'),
        '',
        this.$t('position.filterOptions.mismatch'),
        this.$t('position.filterOptions.newData'),
        this.$t('position.filterOptions.error')
      ],
      sendStatusStyle: ['negative', '', 'orange', 'orange', 'negative']
    }
  }
}
</script>

<style>
</style>
