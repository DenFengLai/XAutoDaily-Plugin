export default [
  {
    component: "SOFT_GROUP_BEGIN",
    label: "自动点赞设置"
  },
  {
    field: "ThumbUp.auto",
    label: "自动点赞开关",
    helpMessage: "修改后重启生效",
    component: "Switch"
  },
  {
    field: "ThumbUp.list",
    helpMessage: "好友列表",
    label: "需要进行点赞的好友",
    component: "Select",
    componentProps: {
      allowAdd: true,
      allowDel: true,
      mode: "multiple",
      placeholder: "点击选择好友",
      get options() {
        return Array.from(Bot.fl.values()).map(item => ({
          label: `${item.bot_id || Bot.uin}-${item.nickname}-${item.user_id}`,
          value: `${item.bot_id || Bot.uin}:${item.user_id}`
        }))
      }
    }
  },
  {
    field: "ThumbUp.cron",
    label: "自动点赞定时表达式",
    helpMessage: "修改后重启生效",
    bottomHelpMessage: "自动点赞Cron表达式",
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
