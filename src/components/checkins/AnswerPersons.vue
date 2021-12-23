/*
 * @Author: 贺建波
 * @Date: 2021-09-10 10:06:25
 * @LastEditTime: 2021-09-10 10:06:25
 * @LastEditors: 贺建波
 * @Description: 回答过某问题的所有人员
 * @FilePath: \components\checkins\AnswerPersons.vue
 */
<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
   <tw-header-card title="查看某人的回答" />
    <q-card-section class="q-px-xxl">
      <tw-search-sort class="q-py-sm" :search.sync="search" />
      <q-list>
        <resource-item
          v-for="person in resourcesFiltered"
          :key="person.id"
          :resource="person"
          :category="'person'"
          @click="seeSomeoneAnswers(person.id)"
        ></resource-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'AnswerPersons',
  props: {
    category: {
      type: String,
      required: false,
      default: () => 'person'
    },
    objectID: {
      type: [Number, String],
      required: false,
      default: 0
    },
    id: {
      type: [Number, String],
      required: true,
      default: 0
    },
    createBy: {
      type: [Number, String],
      required: false,
      default: 0
    }
  },
  components: {
    TwSearchSort: () => import('components/base/TwSearchSort'),
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    ResourceItem: () => import('components/resource/ResourceItem')
  },
  data () {
    return {
      personIds: []
    }
  },
  mounted () {  
    this.loadAnswererIds(+this.id).then((res) => {
      this.personIds = res
    })
  },
  methods: {
    ...mapActions('checkins', ['loadAnswererIds']),
    seeSomeoneAnswers (personId, person) {
      // 查看某个人的回答
      this.$router.push({
        name: 'allAnswers',
        params: {
          // category: this.category,
          // objectID: +this.objectID,
          questionID: +this.id,
          personID: +personId
        }
      })
    }
  },
  computed: {
    answers () {
      return this.$store.getters['checkins/answers'](+this.id)
    },
    persons () {
      let selectPersons = this.$store.state.person.selectPersons
      const persons = _.map(this.personIds, p => selectPersons[p])
      return persons
    },
    search: {
      get () {
        return this.$store.state['person'] && this.$store.state['person'].search
      },
      set (value) {
        this.$store.commit('person/setSearch', value)
      }
    },
    // 搜索
    resourcesFiltered () {
      if (this.search) {
        let tempValue = _.filter(
          this.persons,
          val =>
            (val.title && val.title.toLowerCase().includes(this.search.toLowerCase())) ||
            (val.notes && val.notes.toLowerCase().includes(this.search.toLowerCase())) ||
            (val.name && val.name.toLowerCase().includes(this.search.toLowerCase())) ||
            (val.pinyin && val.pinyin.toLowerCase().includes(this.search.toLowerCase()))
        )
        return _.orderBy(tempValue, ['isInService', 'activated', 'status'], ['desc', 'desc', 'desc'])
      } else {
        return _.orderBy(this.persons, ['isInService', 'activated', 'status'], ['desc', 'desc', 'desc'])
      }
    }
  } 
}
</script>

<style></style>
