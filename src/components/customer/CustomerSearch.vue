<template>
  <q-card>
    <q-card style="position: sticky;top:0;z-index:999;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          <q-icon
            class="q-mr-xs"
            name="img:icons/qcc.ico"
            style="font-size: 1.5rem;"
          />客户搜索
        </div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>
      <q-card-section class="q-py-sm">
        <q-input
          v-model="search"
          type="search"
          outlined
          label="搜索"
          debounce="500"
          @keyup.enter="searchByQcc"
        >
          <template v-slot:append>
            <q-avatar>
              <q-btn
                round
                dense
                flat
                icon="search"
                @click.prevent="searchByQcc"
              />
            </q-avatar>
          </template>
        </q-input>
      </q-card-section>
    </q-card>
    <div
      style="height: 50vh;max-height: 50vh"
      class="scroll"
    >
      <q-card-section v-if="isClickedQccSearch">
        <!-- 等待提示框 -->
        <div
          v-if="showLoading"
          class="row justify-center q-my-md"
        >
          <q-spinner-dots
            color="primary"
            size="40px"
          />
        </div>
        <div v-if="customerList.length > 0">
          <q-item-label
            class="q-ma-xs"
            caption
          >共搜索到<strong class="q-mx-xs text-orange">{{customerList.length}}</strong>个客户
          </q-item-label>
          <q-separator />
          <q-list separator>
            <q-item
              v-for="customer in customerList"
              :key="customer.KeyNo"
              clickable
              @click="selectedRow(customer)"
            >
              <q-item-section side>
                <q-radio
                  v-model="customerKeyNo"
                  :val="customer.KeyNo"
                  color="teal"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{customer.Name}}</q-item-label>
                <q-item-label caption>{{customer.OperName}} | {{customer.StartDate}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div v-else>
          <tw-banner-no-result info="未搜索到该客户信息" />
        </div>
      </q-card-section>
      <q-card-section v-else>
        <tw-banner-no-result info="使用企查查，可模糊搜索多个客户列表" />
      </q-card-section>

    </div>
    <div v-show="customerList.length > 0">
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          outline
          color="primary"
          :label="$t('label.reset')"
          @click="onReset"
        />
        <q-btn
          color="primary"
          :label="$t('action.confirm')"
          @click="onConfirm"
        />
      </q-card-actions>
    </div>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'CustomerSearch',
  props: {
    search: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      customerKeyNo: '',
      customerList: [],
      isClickedQccSearch: false, // 是否点击了企查查
      showLoading: false
    }
  },
  methods: {
    ...mapActions('customer', ['findAllEnterprises', 'findOneEnterprise']),
    searchByQcc () {
      this.isClickedQccSearch = true
      if (this.search.length > 0) {
        this.showLoading = true
        this.findAllEnterprises(this.search).then(res => {
          this.showLoading = false
          this.customerList = res.Result
        })
      }
    },
    selectedRow (customer) {
      this.customerKeyNo = customer.KeyNo
    },
    onConfirm () {
      let selectedCustomer = _.find(this.customerList, (customer) => customer.KeyNo === this.customerKeyNo)
      this.findOneEnterprise(selectedCustomer.Name).then(res => {
        let qccGSSJInfo = res.Result
        this.$emit('selectEvent', qccGSSJInfo)
      })
    },
    onReset () {
      this.customerKeyNo = ''
    }
  },
  components: {
    TwBannerNoResult: () => import('components/base/TwBannerNoResult')
  }
}
</script>

<style scoped  lang="scss">
</style>
