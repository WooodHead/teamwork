<template>
  <q-avatar
    v-if="showImg&&popupCard"
    :size="size"
    :font-size="fontSize"
    text-color="white"
    @click.stop="showPersonCardFun"
    class="cursor-pointer"
    :title="fullName"
  >
    <q-img
      :src="image"
      :title="fullName"
      style="height:100%"
      @error="errorImg=true"
    >
      <template v-slot:loading>
        <q-avatar
          :size="size"
          :color="color"
          :font-size="fontSize"
          text-color="white"
          class="cursor-pointer"
        >
          <span>{{fullName|lastName|filterName(size)}}</span>
        </q-avatar>
      </template>
    </q-img>
    <slot></slot>
    <q-dialog v-model="showPersonCard">
      <person-card :id="id" />
    </q-dialog>
  </q-avatar>
  <q-avatar
    v-else-if="!showImg&&popupCard"
    :size="size"
    :color="color"
    text-color="white"
    :font-size="fontSize"
    @click.stop="showPersonCardFun"
    class="cursor-pointer"
    :title="fullName"
  >
    <slot></slot>
    <span>{{fullName|lastName|filterName(size)}}</span>
    <q-dialog v-model="showPersonCard">
      <person-card :id="id" />
    </q-dialog>
  </q-avatar>
  <q-avatar
    v-else-if="showImg&&!popupCard"
    :size="size"
    :font-size="fontSize"
    text-color="white"
    class="cursor-pointer"
    :title="fullName"
  >
    <slot></slot>
    <q-img
      :src="image"
      style="height:100%"
      @error="errorImg=true"
    >
      <template v-slot:loading>
        <q-avatar
          :size="size"
          :color="color"
          :font-size="fontSize"
          text-color="white"
          class="cursor-pointer"
          :title="fullName"
        >
          <span>{{fullName|lastName|filterName(size)}}</span>
        </q-avatar>
      </template>
    </q-img>
    <q-dialog v-model="showPersonCard">
      <person-card :id="id" />
    </q-dialog>
  </q-avatar>
  <q-avatar
    v-else-if="!showImg&&!popupCard"
    :size="size"
    :color="color"
    :font-size="fontSize"
    text-color="white"
    class="cursor-pointer"
    :title="fullName"
  >
    <slot></slot>
    <span>
      {{fullName|lastName|filterName(size)}}
    </span>
    <q-dialog v-model="showPersonCard">
      <person-card :id="id" />
    </q-dialog>
  </q-avatar>
</template>

<script>
import { randomColor } from '@/utils/random-color'
import { mapState } from 'vuex'
import { getUrl } from '@/boot/file'
/** 优先显示头像照片，其次是人员名称 */
export default {
  name: 'TwAvatar',
  components: {
    'person-card': () => import('components/person/PersonCard')
  },
  props: {
    id: {
      type: [Number, String],
      required: false,
      default: 0
    },
    name: {
      type: String,
      required: false,
      default: null
    },
    img: {
      type: String,
      required: false,
      default: null
    },
    size: {
      type: String,
      required: false
    },
    fontSize: {
      type: String,
      required: false,
      default: '0.8rem',
      description: '推荐：size:md,fontSize:0.6rem'
    },
    popupCard: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data: function () {
    return {
      errorImg: false,
      showPersonCard: false
    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    color () {
      return randomColor()
    },
    person () {
      return this.selectPersons[this.id] || {}
    },
    fullName () {
      return this.name || this.person.name || ''
    },
    image () {
      return (this.id === 0 && (this.img
        ? getUrl(this.img)
        : this.$logo['favicon-32x32.png'])) ||
        (this.img && getUrl(this.img)) ||
        (this.person && this.person.img && getUrl(this.person.img))
    },
    showImg () {
      return this.image && !this.errorImg
    }
  },
  filters: {
    lastName (value) {
      return value ? value.slice(-2) : ''
    },
    filterName (value, size) {
      if (['sm', 'xs'].includes(size)) {
        return _.last(value)
      } else {
        return value
      }
    }
  },
  methods: {
    showPersonCardFun () {
      if (!_.isEmpty(this.person)) {
        if (this.$store.getters['person/filterPersonsByContactsAcl']([this.person]).length) {
          this.showPersonCard = true
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.text-caption_dense {
  letter-spacing: 0;
}
.q-avatar {
  word-break: keep-all;
}
.bg-female {
  background: #f7931e;
}
.bg-man {
  background: #3fa9f5;
}
</style>
