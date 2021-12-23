import { i18n } from '@/boot/i18n'
export default function () {
  return {
    categorys: {},
    // 平台内建模块，
    // 与其对应的概念有用户自定义模块,如会议室room
    // 和第三方模块，如产品选型、精雕招聘
    // 第三方模块的定义：第三方应用中特有的模块，
    // TeamWork中第三方应用的定义是：
    // 可自定义自己的设计风格，具有自己的应用标签栏,不包含在全局搜索中
    builtInModules: [
      'organize',
      'person',
      'customer',
      'opportunity',
      'order',
      'productDev',
      'team',
      'project',
      'product',
      'service',
      'consult',
      'workRecord',
      'manufacturer',
      'feedback',
      'wiki'
    ],
    // 有多个子工具的模块
    haveWidgets: [
      'organize',
      'productDev',
      'team',
      'project',
      'product',
      'customer',
      'opportunity',
      'order',
      'service',
      'manufacturer'
    ],
    customResources: ['room', 'equipment'],
    items: {
      machinetool: [],
      equipment: [],
      room: []
    },
    selectedCategory: {
      id: 1,
      name: 'person',
      label: '人员',
      custom: false,
      wantToSee: '谁的',
      widgetLabel: '待办日程',
      icon: 'account_circle',
      color: 'red',
      widgets: {
        chat: {
          value: 'chat',
          label: '聊天室',
          order: 1,
          color: 'cyan-6',
          icon: 'forum',
          notes: '有啥想说的么？可与我私聊哦，放心，只有咱俩能看到。'
        },
        notice: {
          value: 'notice',
          label: '个人动态',
          order: 2,
          notes: '在这里我会分享一些个人动态，记得关注哦。'
        },
        task: {
          value: 'task',
          label: '待办任务',
          order: 3,
          notes: '列出需要完成的工作（备忘），设置到期日并进行讨论。'
        },
        document: {
          value: 'document',
          label: '文档中心',
          order: 4,
          notes:
            '创建文档，上传文件、图片、视频等，灵活的组织文件夹，以便轻松查找。'
        },
        schedule: {
          value: 'schedule',
          label: '日程安排',
          order: 5,
          notes: '在共享日历上查看工作排程，添加工作事项提醒。'
        },
        project: {
          value: 'project',
          label: '项目',
          order: 7,
          notes: '您未来负责和参与的所有项目都能在这里找到。'
        },
        product: {
          value: 'productDev',
          label: i18n.t('productDev.title'),
          order: 8,
          notes: `您未来负责和参与的所有${i18n.t(
            'productDev.title'
          )}都能在这里找到。`
        },
        customer: {
          value: 'customer',
          label: '客户',
          order: 9,
          notes: '您可查询客户的详情信息'
        },
        order: {
          value: 'order',
          label: '订单',
          order: 10,
          notes: '您可查询订单的详情信息'
        },
        activity: {
          value: 'activity',
          label: '最新动态',
          color: 'primary',
          icon: 'av_timer',
          order: 11,
          notes: '查看人员、项目、产品等模块最新动态'
        },
        evaluation: {
          value: 'evaluation',
          label: '服务评价',
          color: 'primary',
          icon: 'border_color',
          order: 12,
          notes: '可以针对工程服务的结果，进行评价打分。'
        },
        customerInfo: {
          value: 'customerInfo',
          label: '客户档案',
          order: 18,
          notes: '这里是您客户的档案库，请妥善管理客户信息。'
        }
      }
    },
    selectedItem: null,
    // 是否分页
    byPage: true,
    page: {
      offset: 0,
      limit: 20,
      total: 100
    },
    // 模糊查询
    search: '',
    // 排序
    sort: 'orderNumber',

    // 资源关联关系
    resourceRelations: [],
    // 关联的资源对象列表，包含teamList\projectList\productList等
    categoryRelations: {},
    relationType: {
      project: {
        team: 'correlation',
        productDev: 'correlation',
        project: 'inherit',
        organize: 'correlation',
        customer: 'correlation'
      },
      team: {
        productDev: 'correlation',
        project: 'correlation'
      },
      productDev: {
        team: 'correlation',
        project: 'correlation'
      },
      product: {
        product: 'correlation'
      },
      customer: {
        project: 'correlation'
      },
      order: {}
    },
    // 图标资源
    resourceIcon: {
      person: {
        icon: 'account_circle',
        color: 'red'
      },
      organize: {
        icon: 'business',
        color: 'grey-8'
      },
      team: {
        icon: 'group',
        color: 'indigo'
      },
      project: {
        icon: 'inbox',
        color: 'orange-10'
      },
      productDev: {
        icon: 'explore',
        color: 'indigo-10'
      },
      product: {
        icon: 'devices',
        color: 'indigo-10'
      },
      customer: {
        icon: 'people',
        color: 'blue'
      },
      order: {
        icon: 'people',
        color: 'blue-10'
      },
      service: {
        icon: 'polymer',
        color: 'orange-10'
      },
      task: {
        icon: 'check',
        color: 'green'
      },
      notice: {
        icon: 'assignment',
        color: 'yellow-8'
      },
      document: {
        icon: 'insert_drive_file',
        color: 'primary'
      },
      schedule: {
        icon: 'event',
        color: 'red'
      },
      folder: {
        icon: 'folder',
        color: 'secondary'
      },
      checkins: {
        icon: 'help',
        color: 'green-14'
      },
      wiki: {
        icon: 'book',
        color: 'teal-14'
      }
    }
  }
}
