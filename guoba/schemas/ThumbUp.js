export default [
  {
    component: "Divider",
    label: "自动点赞设置"
  },
  {
    field: "ThumbUp.auto",
    label: "自动点赞开关",
    helpMessage: "修改后重启生效",
    component: "Switch"
  },
  {
    field: "ThumbUp.cron",
    label: "自动点赞定时表达式",
    helpMessage: "修改后重启生效",
    bottomHelpMessage: "自动检查Cron表达式",
    component: "EasyCron",
    componentProps: {
      placeholder: "请输入Cron表达式"
    }
  },
  {
    field: "ThumbUp.num",
    label: "点赞数",
    component: "InputNumber",
    componentProps: {
      placeholder: "请输入点赞数;会员20次 非会员10次"
    }
  }
]
