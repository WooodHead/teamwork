<template>
  <q-page
    padding
    class="q-gutter-md"
  >
    <h5>echarts 图表</h5>
    <div class="row q-mb-md">
      <div
        class="col-6"
        style="height:400px;"
      >
        <v-chart
          :options="echartDemoOptions.line"
          theme="macarons"
        />
      </div>
      <div
        class="col-6"
        style="height:400px;"
      >
        <v-chart
          :options="echartDemoOptions.bar"
          theme="macarons"
        />
      </div>
      <div
        class="col-3"
        style="height:400px;"
      >

        <v-chart
          :options="echartDemoOptions.pie"
          theme="macarons"
        />
      </div>
      <div
        class="col-3"
        style="height:400px;"
      >

        <v-chart
          :options="polar"
          theme="macarons"
        />
      </div>
    </div>
    <h5>
      Project
    </h5>
    <p>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque possimus
      recusandae dolorem quia eum dolores quae. Sapiente, eligendi. Porro earum
      aspernatur nostrum sunt assumenda dolorem magni nulla, adipisci deleniti
      laborum?
    </p>
    <div class="text-h6">
      任务编号：{{ this.$route.query.tId }}<br />
      任务名称：{{ this.$route.query.tName }}
      <div class="q-gutter-md row">
        <div class="col-12">
          <tw-city-select
            label="请选择收货地址"
            icon="place"
          ></tw-city-select>
        </div>
        <div class="col-12 col-6">
          <tw-select-tree
            outlined
            emit-value
            :nodes="selectOrganizesTree"
            :model.sync="model"
            node-key="id"
            label-key="name"
            position="bottom"
            label="请选择机构（单选）"
          />
        </div>
        <div class="col-12 col-6">
          <tw-select-tree
            outlined
            multiple
            emit-value
            :nodes="selectOrganizesTree"
            :model.sync="model"
            node-key="id"
            label-key="name"
            position="bottom"
            label="请选择机构（多选）"
          />
        </div>
      </div>
    </div>
    <discuss-board />
    <h5>
      Product
    </h5>
    <p>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque possimus
      recusandae dolorem quia eum dolores quae. Sapiente, eligendi. Porro earum
      aspernatur nostrum sunt assumenda dolorem magni nulla, adipisci deleniti
      laborum?
    </p>

    <tw-select-person
      outlined
      v-model="persons"
      multiple
      emit-value
      by-group
      :label="$t('base.selectPerson')"
    />
    <tw-select-person
      outlined
      v-model="person"
      emit-value
      :label="$t('base.selectPerson')"
    />
    <tw-boost-pack
      class="q-ma-sm"
      objectID="0"
      objectType=""
      messageTitle=""
      messageType=""
      messageTag=""
      subTitle=""
      :boostTo="曹冠雄"
    />
    <q-avatar
      size="0.6rem"
      color="red"
      text-color="white"
      icon="done"
      class="cursor-pointer"
      @mouseover="showClose=true"
      @mouseleave="showClose=false"
      title="标为已读"
      @click.stop="$q.notify('已读')"
      v-ripple
    />
    <q-avatar
      size="0.6rem"
      :color="showUndo?'red':'grey'"
      text-color="white"
      icon="done"
      class="cursor-pointer"
      @mouseover="showUndo=true"
      @mouseleave="showUndo=false"
      title="恢复未读"
      @click.stop="$q.notify('未读')"
      v-ripple
    />
    <div class="q-gutter-none">
      <q-avatar
        rounded
        v-for="n in 10"
        :key=n
        text-color="red"
        style="width:auto;height:auto;"
      >•</q-avatar>
    </div>
    <div class="q-pa-md row items-start q-gutter-md">
      <avatar-crop
        size="150px"
        :img-src.sync="imgSrc1"
      />
      <avatar-crop :img-src.sync="imgSrc2" />
    </div>

    <!-- table to array -->
    <h5>table to array</h5>
    <div v-html="tableHtml">{{tableHtml}}</div>
    <q-btn label="显示table" color="primary" @click="showTable" />
    <q-btn label="打印table array" color="primary" @click="printTableArray" />
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import echartDemoOptions from '@/assets/echarts/demo-options.json'
import { tableToArray, arrayToTable } from '@/utils/table-to-array'
export default {
  name: 'PageDemo',
  components: {
    TwBoostPack: () => import('components/boost/TwBoostPack'),
    TwSelectPerson: () => import('components/base/TwSelectPerson.vue'),
    'tw-select-tree': () => import('components/base/TwSelectTree'),
    'discuss-board': () => import('components/discuss/DiscussBoard.vue'),
    'avatar-crop': () => import('components/profile/AvatarCrop')
  },
  data () {
    let data = []

    for (let i = 0; i <= 360; i++) {
      let t = i / 180 * Math.PI
      let r = Math.sin(2 * t) * Math.cos(2 * t)
      data.push([r, i])
    }
    return {
      tableHtml: '',
      persons: [1, 2, 3],
      person: 3,
      showClose: false,
      showUndo: false,
      model: null,
      imgSrc1: '/01.jpg',
      imgSrc2: '',
      echartDemoOptions: echartDemoOptions,
      polar: {
        title: {
          text: '极坐标双数值轴'
        },
        legend: {
          data: ['line']
        },
        polar: {
          center: ['50%', '54%']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        angleAxis: {
          type: 'value',
          startAngle: 0
        },
        radiusAxis: {
          min: 0
        },
        series: [
          {
            coordinateSystem: 'polar',
            name: 'line',
            type: 'line',
            showSymbol: false,
            data: data
          }
        ],
        animationDuration: 2000
      }
    }
  },
  computed: {
    ...mapGetters('organize', ['selectOrganizesTree'])
  },
  methods: {
    showTable () {
      let inputHtml = '<table><tbody><tr><td colspan="6" data-colwidth="0,0,117,0,0,0"><p>检测报告&lt;sub&gt;35&lt;/sub&gt;&lt;sup&gt;21&lt;/sup&gt;</p></td></tr><tr><td colspan="2"><p>检测位置</p></td><td data-colwidth="117"><p>1</p></td><td><p>2</p></td><td><p>3</p></td><td><p>4</p></td></tr><tr><td rowspan="2"><p>尺寸(mm)</p><p>&nbsp;</p></td><td><p>公差</p></td><td colspan="4" data-colwidth="117,0,0,0"><p><img src="/api/files/preview?filePath=teamwork-dev%2FproductDev%2F3D%E7%8E%BB%E7%92%83%E9%92%A8%E9%92%A2%E7%83%AD%E5%BC%AF%E6%A8%A1%E5%85%B7%E6%B5%8B%E8%AF%95%E4%BB%B6-1.png&amp;extranet=true"></p></td></tr><tr><td colspan="2" data-colwidth="0,117"><p>测量值0.0039</p></td><td rowspan="2"><p>0.0022</p><p>0.239</p></td><td><p>0.0037</p></td><td><p>0.0028</p></td></tr><tr><td><p>粗糙度(μm)</p></td><td><p>Sa≤0.400</p></td><td data-colwidth="117"><p>0.245</p></td><td><p>0.240</p></td><td><p>0.244</p></td></tr><tr><td colspan="2"><p>检测仪器</p></td><td colspan="2" data-colwidth="117,0"><p>ZEISS三坐标</p></td><td colspan="2"><p>三丰接触式粗糙度仪</p></td></tr></tbody></table>'
      this.tableHtml = arrayToTable(tableToArray(inputHtml))
    },
    printTableArray () {
      console.log(tableToArray(this.tableHtml))
    }
  }
}
</script>
<style lang="scss" scoped>
// 设置表格边框
/deep/table {
  width: 100%;
  font-size: 0.938em;
  border-collapse: collapse; /*边框会合并为一个单一的边框*/
}

/deep/th {
  text-align: left;
  padding: 0.5em 0.5em;
  font-weight: bold;
  background: #66677c;
  color: #fff;
}

/deep/td {
  padding: 0.5em 0.5em;
  border-bottom: solid 1px #ccc;
}

/deep/table,
/deep/table tr th,
/deep/table tr td {
  border: 1px solid $grey-5;
} /*设置边框的*/
</style>
