export default {
  components: {
    ModalHeader: () => import('components/tasks/modals/shared/ModalHeader'),
    FormFields: () => import('components/tasks/modals/shared/FormFields'),
    FormAction: () => import('components/tasks/modals/shared/FormAction')
  }
}
