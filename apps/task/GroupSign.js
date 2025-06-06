import { Config, common } from "#components"

let task = {}

if (Config.GroupSign.list.length > 0) {
  task = {
    cron: Config.GroupSign.cron,
    name: "GroupSign",
    fnc: async() => GroupSign()
  }
}

async function GroupSign() {
  let taskName = "GroupSign"
  if (await common.isTaskDone(taskName)) {
    common.informMaster("[XAutoDaily] 今日打卡任务已完成，将跳过执行")
    return false
  }
  common.informMaster("[XAutoDaily] 开始执行打卡任务, 共 " + Config.GroupSign.list.length + " 个群，预计需要 " + (Config.GroupSign.list.length * Config.GroupSign.cd) + " 秒")
  let success = 0
  let failure = 0
  // let processed = 0

  for (const item of Config.GroupSign.list) {
    const [ bot, gid ] = item.split(":")

    let res
    try {
      res = await Bot[bot].pickGroup(gid).sign()
    } catch (error) {
      logger.error(`[XAutoDaily] ${bot} 在 ${gid} 打卡异常:`, error)
      failure++
      break
    }

    logger.debug(`[XAutoDaily] ${bot} 进行群 ${gid} 打卡`, res)

    if (res?.result === 0) {
      success++
    } else {
      failure++
    }
    await common.sleep(Config.GroupSign.cd * 1000)
  }

  let Message = `成功：${success}个 失败：${failure}个`
  common.informMaster(`[XAutoDaily] 打卡任务完成，${Message}`)
  common.setTaskDone(taskName, JSON.stringify({ Time: new Date(), Message, Success: success, Failure: failure }))
  return { success, failure }
}

export default task
