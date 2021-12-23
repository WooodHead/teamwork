import { format } from 'quasar'
const { capitalize } = format
export default {
  mounted () {
    this.loadModule(this.category, this.objectID)
  },
  computed: {
    categoryModel () {
      return this.$store._modules.root._children[this.category] && this.category && +this.objectID
        ? this.$store.getters[`${this.category}/${this.category}`](+this.objectID)
        : {}
    },
    showEditMenu () {
      if (this.categoryModel) {
        return (
          this.categoryModel.isTemplate &&
          this.categoryModel.createByID === this.$myinfo.id
        ) ||
          !this.categoryModel.isTemplate
      } else {
        return true
      }
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.loadModule(this.category, this.objectID)
    next()
  },
  methods: {
    loadModule (category, objectID) {
      this.category !== 'wiki' && this.$store._modules.root._children[category] && objectID &&
        this.$store.dispatch(`${category}/load${capitalize(category)}`, +objectID)
    }
  }
}
