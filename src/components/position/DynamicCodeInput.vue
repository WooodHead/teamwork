<template>
  <q-page class="flex flex-center">
    <div
      class="q-mt-md verify-container"
      :class="smallMode?'small-mode':''"
    >
      <div class="relative-position verify-inner">
        <div class="verify-info">
          <p class="q-mb-sm text-h5 text-weight-bold">
            查看职级
          </p>
          <p
            class="q-mb-lg text-grey-5 text-subtitle2"
            v-html="$t(`salary.view.verifyTips`)"
          ></p>
          <div class="flex justify-center dynamic-code">
            <q-input
              outlined
              dense
              autofocus
              v-model="code"
              type="tel"
              :placeholder="$t('position.inputCodeTip')"
              @keyup.enter="ok"
              class="col"
            ></q-input>
            <q-btn
              :disable="!code"
              color="primary"
              :label="$t('label.ok')"
              @click="ok"
              class="col-auto q-ml-md q-px-sm"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'DynamicCodeInput',
  props: {
    smallMode: {
      type: Boolean,
      default: false,
      description: '是否小窗口模式'
    }
  },
  data () {
    return {
      code: ''
    }
  },
  methods: {
    ok () {
      if (this.code && this.code.trim()) {
        this.$emit('ok', this.code)
      } else {
        this.$refs.codeInput.focus()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.verify-container {
  width: 100%;
  max-width: 884px;
  .verify-inner {
    width: 100%;
    padding-bottom: calc((570 / 1295) * 100%);
    background-image: url("/icons/secrecy/verify.png");
    background-repeat: no-repeat;
    background-size: cover;
    .verify-info {
      position: absolute;
      top: 15%;
      left: 50%;
      transform: translateX(-50%);
      width: 35%;
      text-align: center;
    }
  }
}
.verify-container.small-mode {
  .verify-inner {
    padding-bottom: calc((644 / 750) * 100%);
    background-image: url("/icons/secrecy/verify_m.png");
    .verify-info {
      width: 80%;
      top: 12%;
      left: 50%;
      transform: translateX(-50%);
      .text-subtitle2 {
        font-size: 12px;
      }
      .dynamic-code {
        width: 85%;
        max-width: 300px;
        margin: 0 auto;
      }
    }
  }
}
@media screen and (max-width: 1024px) {
  .verify-container {
    .verify-inner {
      padding-bottom: calc((644 / 750) * 100%);
      background-image: url("/icons/secrecy/verify_m.png");
      .verify-info {
        width: 80%;
        top: 12%;
        left: 50%;
        transform: translateX(-50%);
        .text-subtitle2 {
          font-size: 12px;
        }
        .dynamic-code {
          width: 85%;
          max-width: 300px;
          margin: 0 auto;
        }
      }
    }
  }
  // .dynamic-code {
  //   /deep/ .q-input,
  //   /deep/ .q-btn {
  //     width: 100%;
  //   }
  //   /deep/ .q-btn {
  //     max-width: 250px;
  //     margin-left: 0;
  //     margin-top: 16px;
  //   }
  // }
}
</style>
