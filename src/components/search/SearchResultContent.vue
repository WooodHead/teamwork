<template>
  <div>
    <div v-if="results.length>0">
      <div
        v-for="result in results"
        :key="result.index"
        class="q-pt-md row q-gutter-md"
      >
        <div avatar>
          <tw-avatar
            size="lg"
            :id="convertToId(result)"
          >
            <template>
              <q-badge
                floating
                :color="resultType[result.modules]&&resultType[result.modules].color"
              >
                <q-icon
                  :name="resultType[result.modules].isSvg?
                  `img:icons/${resultType[result.modules].icon}.svg`:
                  resultType[result.modules].icon"
                  color="white"
                />
              </q-badge>
            </template>
          </tw-avatar>
        </div>
        <div class="col">
          <q-item-label
            caption
            lines="0"
            v-if="!['project','productDev','team'].includes(result.modules)"
          >{{result.resource}} {{timeAgo({ dateTime: result.modifyTime||result.createTime })}}
          </q-item-label>
          <q-item-label lines="5">
            <task-result
              v-if="result.modules==='task'"
              :task="result"
            />
            <task-result
              v-if="result.modules==='list'"
              :task="result"
            />
            <answer-result
              v-if="result.modules==='checkins'"
              :answer="result"
            />
            <notice-result
              v-if="result.modules==='notice'"
              :notice="result"
            />
            <discuss-result
              v-if="result.modules==='discuss'"
              :discuss="result"
            />
            <document-result
              v-if="result.modules==='document'"
              :document="result"
            />
            <schedule-result
              v-if="result.modules==='schedule'"
              :schedule="result"
            />
            <project-result
              v-if="result.modules==='project'"
              :project="result"
            />
            <product-dev-result
              v-if="result.modules==='productDev'"
              :productDev="result"
            />
            <team-result
              v-if="result.modules==='team'"
              :team="result"
            />
          </q-item-label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import timeAgo from '@/utils/time-ago'
export default {
  props: {
    // 资源类型
    results: {
      type: Array,
      required: false,
      default () {
        return {}
      }
    }
  },
  computed: {
    ...mapState('search', ['resultType', 'modules'])
  },
  components: {
    'tw-avatar': () => import('components/base/TwAvatar'),
    'task-result': () => import('components/search/TaskResult'),
    'answer-result': () => import('components/search/AnswerResult'),
    'notice-result': () => import('components/search/NoticeResult'),
    'discuss-result': () => import('components/search/DiscussResult'),
    'document-result': () => import('components/search/DocumentResult'),
    'schedule-result': () => import('components/search/ScheduleResult'),
    'project-result': () => import('components/search/ProjectResult'),
    'product-dev-result': () => import('components/search/ProductDevResult'),
    'team-result': () => import('components/search/TeamResult')
  },
  methods: {
    timeAgo,
    convertToId (model) {
      if (model.modules === 'schedule') {
        return model.editor
      } else if (model.modules === 'document') {
        return model.authorID
      } else if (['project', 'team', 'organize', 'productDev'].includes(model.modules)) {
        return model.leaderID
      } else {
        return model.createByID
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.q-badge {
  padding: 4px;
  border-radius: 50%;
}
</style>
