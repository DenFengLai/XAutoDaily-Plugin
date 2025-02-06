export default [
  {
    component: "Divider",
    label: "自动续火设置"
  },
  // {
  //   field: "auto_fire.auto",
  //   label: "自动续火开关",
  //   helpMessage: "修改后重启生效",
  //   component: "Switch"
  // },
  {
    field: "auto_fire.group",
    helpMessage: "群聊续火列表",
    label: "需要进行续火的群",
    componentProps: {
      placeholder: "点击选择群聊"
    },
    component: "GSelectGroup"
  },
  {
    field: "auto_fire.gp_text",
    label: "群聊续火消息列表",
    bottomHelpMessage: "可填多个(随机选取)",
    component: "GTags",
    componentProps: {
      allowAdd: true,
      allowDel: true
    },
    showPrompt: true,
    promptProps: {
      content: "请输入 续火消息",
      placeholder: "请输入消息内容",
      okText: "添加",
      rules: [ { required: true, message: "消息不可为空哦~" } ]
    }
  },
  {
    field: "auto_fire.gp_cron",
    label: "群聊续火定时表达式",
    helpMessage: "修改后重启生效",
    bottomHelpMessage: "群聊虚续火Cron表达式",
    component: "EasyCron",
    componentProps: {
      placeholder: "请输入Cron表达式"
    }
  },
  {
    field: "auto_fire.friend",
    helpMessage: "好友续火列表",
    label: "需要进行续火的好友",
    componentProps: {
      placeholder: "点击选择好友"
    },
    component: "GSelectFriend"
  },
  {
    field: "auto_fire.fl_cron",
    label: "好友续火定时表达式",
    helpMessage: "修改后重启生效",
    bottomHelpMessage: "好友续火Cron表达式",
    component: "EasyCron",
    componentProps: {
      placeholder: "请输入Cron表达式"
    }
  },
  {
    field: "auto_fire.fl_text",
    label: "好友续火消息列表",
    bottomHelpMessage: "可填多个(随机选取)",
    component: "GTags",
    componentProps: {
      allowAdd: true,
      allowDel: true
    },
    showPrompt: true,
    promptProps: {
      content: "请输入 续火消息",
      placeholder: "请输入消息内容",
      okText: "添加",
      rules: [ { required: true, message: "消息不可为空哦~" } ]
    }
  },
  {
    field: "auto_fire.cd",
    label: "续火间隔",
    helpMessage: "发送每个群/好友的间隔时间，单位：秒",
    component: "InputNumber",
    componentProps: {
      min: 1,
      max: 60
    }
  }
]
