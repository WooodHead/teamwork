<template>
  <q-form
    autofocus
    @submit="onSubmit"
  >
    <q-input
      dense
      rounded
      standout
      v-model="title"
      ref="boost"
      class="boost-input "
      :class="{ 'emoji-font':$q.platform.is.win}"
      maxlength="16"
    >
      <template v-slot:prepend>
        <tw-avatar
          :id="person.id"
          :name="person.name"
          :img="person.img"
          size="sm"
        />
      </template>
      <template v-slot:append>
        <div class="row justify-center q-gutter-xs">
          <tw-emoji-btn
            :size="btnSize"
            class="bg-white "
            @addEmoji="addEmoji"
          />

          <q-btn
            dense
            round
            :size="btnSize"
            class="bg-white text-green"
            @click="onSubmit"
          >
            <q-avatar
              color="white"
              icon="done"
            />
          </q-btn>
          <q-btn
            dense
            round
            :size="btnSize"
            class="bg-white text-red"
            @click="$emit('cancel')"
          >
            <q-avatar
              color="white"
              icon="close"
            />
          </q-btn>
        </div>

      </template>
    </q-input>
  </q-form>
</template>

<script>
import { LocalStorage } from 'quasar'
export default {
  name: 'TwBoostAdd',
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    TwEmojiBtn: () => import('components/emoji/TwEmojiBtn')
  },
  data () {
    return {
      title: '👍',
      btnSize: '9.335px',
      person: LocalStorage.getItem('myself')
    }
  },
  methods: {
    addEmoji (emoji) {
      this.title += emoji
      this.$refs.boost.focus()
    },
    onSubmit () {
      this.$refs.boost.validate()
      if (!this.$refs.boost.hasError) {
        this.$emit('ok', { title: this.title })
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.q-field__control.q-field--standout.q-field--focused .q-field__control {
  background: $grey-3;
}
</style>
