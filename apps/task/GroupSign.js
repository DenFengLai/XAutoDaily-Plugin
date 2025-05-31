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
  logger.mark("[XAutoDaily] 开始执行打卡任务")
  let success = 0
  let failure = 0
  let processed = 0

  for (const item of Config.GroupSign.list) {
    const [ bot, gid ] = item.split(":")
    const groupSignApi = Bot[bot].pickGroup(gid)?.sign?.()

    for (let attempt = 0; attempt < 10; attempt++) {
      let res
      try {
        res = await groupSignApi.sign(gid, 10)
      } catch (error) {
        logger.error(`[XAutoDaily] ${bot} 给 ${gid} 打卡异常:`, error)
        failure++
        break
      }

      logger.debug(`[XAutoDaily] ${bot} 进行群 ${gid} 打卡`, res)

      if (res.result === 0) {
        success++
      } else {
        failure++
      }
    }

    await common.sleep(Config.GroupSign.cd * 1000)
  }

  logger.info(`[XAutoDaily] 打卡任务完成，成功: ${success}, 失败: ${failure}, 已打: ${processed}`)
  return { success, failure, processed }
}

export default task
