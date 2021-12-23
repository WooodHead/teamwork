<template>
  <resource-layout
    category='service'
    :objectID='+id'
    :model="model"
  >
    <template v-slot:prepend>
      <div class="q-pb-md q-px-xxl">
        <service-stepper
          :status="model.status"
          :id="id"
          :model="model"
        />
      </div>
    </template>

  </resource-layout>
</template>

<script>
export default {
  name: 'ServiceDetail',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    model: {
      get () {
        var service = this.$store.getters['service/service'](+this.id)
        service.members = _.filter(service.members, s => s !== service.connectorId && s !== service.managerId)
        service.connectorId && service.members.unshift(service.connectorId)
        service.managerId && !service.members.includes(service.managerId) && service.members.push(service.managerId)
        return service
      }
    }
  },
  components: {
    ResourceLayout: () => import('layouts/ResourceLayout'),
    ServiceStepper: () => import('components/service/ServiceStepper')
  }
}
</script>

<style lang="scss" scoped>
</style>
