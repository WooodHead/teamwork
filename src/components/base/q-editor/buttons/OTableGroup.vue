<template>
  <section class="row o-table-group">
    <o-menubar-btn
      icon="mdi-table-remove"
      :tooltip="$t('editorTable.remove')"
      @click.native="commands.deleteTable"
    />

    <q-separator vertical />
    <o-menubar-btn
      icon="mdi-table-column-plus-before"
      :tooltip="$t('editorTable.insertColumnLeft')"
      @click.native="commands.addColumnBefore"
    />
    <o-menubar-btn
      icon="mdi-table-column-plus-after"
      :tooltip="$t('editorTable.insertColumnRight')"
      @click.native="commands.addColumnAfter"
    />
    <o-menubar-btn
      icon="mdi-table-column-remove"
      :tooltip="$t('editorTable.removeColumns')"
      @click.native="commands.deleteColumn"
    />

    <q-separator vertical />
    <o-menubar-btn
      icon="mdi-table-row-plus-before"
      :tooltip="$t('editorTable.insertRowUp')"
      @click.native="commands.addRowBefore"
    />
    <o-menubar-btn
      icon="mdi-table-row-plus-after"
      :tooltip="$t('editorTable.insertRowDown')"
      @click.native="commands.addRowAfter"
    />
    <o-menubar-btn
      icon="mdi-table-row-remove"
      :tooltip="$t('editorTable.removeRows')"
      @click.native="commands.deleteRow"
    />

    <q-separator vertical />
    <o-menubar-btn
      icon="mdi-table-merge-cells"
      :tooltip="$t('editorTable.merge')"
      @click.native="commands.toggleCellMerge"
    />
  </section>
</template>

<script>
import OMenubarBtn from '@/components/base/q-editor/buttons/OMenubarBtn'
export default {
  name: 'o-table-group',
  data () {
    return {
    }
  },
  props: {
    commands: {
      type: Object
    },
    isActive: {
      type: Object
    }
  },
  components: {
    OMenubarBtn
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style lang="stylus">
  .o-table-group {
    height: 40px;
  }
</style>
