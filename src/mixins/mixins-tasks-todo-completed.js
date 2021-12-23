import { mapGetters } from 'vuex'
export default {
  components: {
    TaskItem: () => import('components/tasks/TaskItem'),
    ListHeader: () => import('components/tasks/ListHeader')
  },
  computed: {
    ...mapGetters('settings', ['settings'])
  }
}
