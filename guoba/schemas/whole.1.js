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
  }
]
