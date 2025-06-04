export default [
  {
    component: "SOFT_GROUP_BEGIN",
    label: "群打卡设置"
  },
  {
    field: "GroupSign.list",
    helpMessage: "群聊打卡列表",
    label: "需要进行打卡的群",
    component: "Select",
    componentProps: {
      allowAdd: true,
      allowDel: true,
      mode: "multiple",
      placeholder: "点击选择群聊",
      get options() {
        return Array.from(Bot.gl.values()).map(item => ({
          label: `${item.bot_id || Bot.uin}-${item.group_name}-${item.group_id}`,
          value: `${item.bot_id || Bot.uin}:${item.group_id}`
        }))
      }
    }
  },
  {
    field: "GroupSign.cron",
    label: "群聊打卡定时表达式",
    helpMessage: "修改后重启生效",
    bottomHelpMessage: "群聊虚续火Cron表达式",
    component: "EasyCron",
    componentProps: {
      placeholder: "请输入Cron表达式"
    }
  },
  {
    field: "GroupSign.cd",
    label: "群打卡间隔时间",
    helpMessage: "单位为秒",
    component: "InputNumber",
    componentProps: {
      placeholder: "请输入打卡间隔时间",
      min: 0,
      max: 3600,
      step: 1
    }
  }
]
