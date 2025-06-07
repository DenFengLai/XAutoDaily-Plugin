export default [
  {
    component: "SOFT_GROUP_BEGIN",
    label: "通用设置"
  },
  {
    field: "whole.notificationsAll",
    label: "通知全部主人",
    component: "Switch"
  },
  {
    label: "开始签到",
    bottomHelpMessage: "手动执行所有签到流程",
    component: "GButtons",
    componentProps: {
      spaceSize: 8,
      buttons: [
        {
          label: "开始执行",
          type: "primary",
          action: "runTask",
          icon: "codicon:debug-start"
          // args: []
        }
      ]
    }
  },
  {
    label: "重置所有任务",
    bottomHelpMessage: "重置所有的任务状态",
    component: "GButtons",
    componentProps: {
      buttons: [
        {
          label: "重置任务",
          type: "primary",
          danger: true,
          action: "resetTask",
          icon: "solar:restart-circle-bold",
          args: [ "all" ],
          confirm: {
            title: "提示",
            content: "确定要重置所有任务状态吗？",
            iconType: "warning",
            okText: "确定",
            cancelText: "蒜鸟蒜鸟"
          }
        }
      ]
    }
  }
]
