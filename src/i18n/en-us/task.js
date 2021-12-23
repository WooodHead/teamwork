export default {
  Title: 'To-dos ',
  addLabel: 'New List',
  fields: {
    name: 'Task name',
    dueDate: 'Due date',
    dueTime: 'Due time'
  },
  sortBy: {
    name: 'Name',
    date: 'Date'
  },
  view: {
    list: 'View to-dos in a list',
    card: 'View to-dos as cards'
  },
  detailView: {
    separate: 'View separate model',
    mixture: 'View mixture model'
  },
  list: {
    name: 'name',
    description: 'Add extra detail or attach a file',
    placeholder: 'Add a new list'
  },
  group: {
    name: 'name',
    description: 'Add extra detail or attach a file',
    placeholder: 'Add a new group'
  },
  item: {
    name: 'name',
    description: 'Add extra detail or attach a file',
    placeholder: 'Describe this todo',
    assignedTo: 'Assigned To',
    notify: 'When Done,notify',
    isSplitSingleTask: 'Split as single task',
    isnotify: 'Notify them about this assignment',
    date: {
      none: 'No due Date',
      day: 'A spacial day',
      range: 'Runs for mutiple days',
      start: 'Start date',
      end: 'End date;'
    }
  },
  todo: 'Todo',
  completed: 'Completed',
  add: 'Add task',
  edit: 'Edit task ',
  added: 'Task added.',
  updated: 'Task updated.',
  deleted: 'Task deleted.',
  noToday: 'No tasks to do today!',
  startTime: 'Start time',
  endTime: 'End time',
  detail: {
    addedBy: 'Added by {createBy}',
    assignedTo: 'Assigned to',
    notifyTo: 'When done, notify',
    dueOn: 'Due on',
    notes: 'Notes',
    extraNotes: 'Add extra details or attach a file...',
    assignHint: 'Type names to assign...',
    notifyHint: 'Type names to notify...',
    assign: 'Assign',
    schedule: 'Schedule',
    reassign: 'Reassign...',
    renotify: 'Notify...',
    reschedule: 'Schedule...',
    notifyAssignedTo: 'Notify them about this assignment',
    markdone: 'Mark this done!',
    selectDate: 'Select a date...',
    saveChanges: 'Save changes',
    discardChanges: 'Discard changes',
    saveSuccess: 'Task saved'
  },
  publicFrom: 'From:',
  publicTitle: 'To-dos',
  publicDateRange: 'From',
  publicDateDay: 'Due',
  moveCopy: {
    choose: 'Please select a specific ',
    moveTo: 'Move here',
    copyTo: 'Copy here',
    nowhereMove:
      "This {type} doesn't have any to-do lists to move this to. Add a to-do list first, or choose a different one.",
    nowhereCopy:
      "This {type} doesn't have any to-do lists to copy this to. Add a to-do list first, or choose a different one."
  },
  error: {
    tooMuchData:
      'The exported data exceeds 50,000 rows. Please narrow the scope of the query to reduce the amount of data. '
  }
}
