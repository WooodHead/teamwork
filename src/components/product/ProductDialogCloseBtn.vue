<template functional>
  <q-btn
    unelevated
    color="grey-3"
    text-color="primary"
    icon="keyboard_arrow_down"
    class="full-width"
    style="position:sticky;top:0;z-index:999;"
    @click.stop="props.callBack()"
  />
</template>
