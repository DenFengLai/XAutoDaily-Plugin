export default [
    {
        component: "SOFT_GROUP_BEGIN",
        label: "自动任务"
    },
    {
        component: "Divider",
        label: "晋江文学城"
    },
    {
        field: "sign.晋江文学城签到",
        label: "晋江文学城签到",
        component: "Switch"
    },
    {
        field: "sign.晋江文学城签到cron",
        label: "晋江文学城签到cron",
        component: "EasyCron",
        componentProps: {
            placeholder: "请输入Cron表达式"
        }
    },
    {
        field: "sign.晋江文学城签到Token",
        label: "晋江文学城签到Token",
        component: "GTags"
    }
]
