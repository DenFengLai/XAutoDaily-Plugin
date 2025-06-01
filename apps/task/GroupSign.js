import { Config, common } from "#components"

let task = {}

if (Config.GroupSign.list.length > 0) {
  task = {
    cron: Config.GroupSign.cron,
    name: "打卡",
    fnc: async() => GroupSign()
  }
}

async function GroupSign() {
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

  common.informMaster(`[XAutoDaily] 打卡任务完成，成功: ${success}, 失败: ${failure}`)
  return { success, failure }
}

export default task
