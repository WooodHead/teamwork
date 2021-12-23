# 组件接收的值格式和类型
{
  "props": {
    "rowKey": {
      "type": "string",
      "desc": "Property of each row that defines the unique key of each row (the result must be a primitive, not Object, Array, etc); The value of property must be string.",
      "examples": [
        ":rowKey=\"id\""
      ]
    },
    "group": {
      "type": "string",
      "desc": "group name for vuedraggable. If this props not provided, drag and drop will be enabled only in children.",
      "examples": [
        ":group=\"name\""
      ]
    }
  },
  "slots": {
    "left": {
      "extends": "default",
      "desc": "Slot to define the left section which may include avatar, icon, etc."
    },
    "body": {
      "extends": "default",
      "desc": "Slot to define the body which will be the main part to display labels."
    }
  },
  "General": {
    "data": {
      "type": "Array",
      "desc": "Rows of data to display",
      "examples": [
        ":data=\"treeData\""
      ]
    }
  }
}

# QDraggableTree Defining the data

        [
            {
                id: 1,
                label: 'Satisfied customers',
                children: [
                    {
                        id: 2,
                        label: 'Good food',
                        children: [
                            {
                                id: 3,
                                label: 'Quality ingredients',
                            },
                            {
                                id: 4,
                                label: 'Good recipe',
                            }
                        ]
                    },
                    {
                        id: 5,
                        label: 'Good service',
                        children: [
                            {id: 6, label: 'Prompt attention'},
                            {id: 7, label: 'Professional waiter'}
                        ]
                    },
                    {
                        id: 8,
                        label: 'Pleasant surroundings',
                        children: [
                            {id: 9, label: 'Happy atmosphere'},
                            {id: 10, label: 'Good table presentation'},
                            {id: 11, label: 'Pleasing decor'}
                        ]
                    }
                ]
            }
        ]
