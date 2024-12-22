import { Config, common } from "#components"
import { ThumbUpApi } from "#model"

let task = {}

if (Config.ThumbUp.auto) {
  task = {
    cron: Config.ThumbUp.cron,
    name: "[XAutoDaily]自动好友点赞任务",
    fnc: async() => ThumbUp()
  }
}

async function ThumbUp() {
  logger.mark("[XAutoDaily] 开始执行好友点赞任务")
  let success = 0
  let failure = 0
  let processed = 0
  for (const i of Config.ThumbUp.list) {
    const [ bot, uid ] = i.split(":")
    let n = 0
    let thumbUpApi = new ThumbUpApi(bot)
    for (let i = 0; i < 10; i++) {
      let res = null
      try {
        res = await (await thumbUpApi.thumbUp(uid, 10))
      } catch (error) {
        logger.error(error)
      }
      logger.debug(`[XAutoDaily] ${bot} 给 ${uid} 点赞`, res)
      if (res.code) {
        if (res.code == 1) {
          logger.mark(`[XAutoDaily] ${bot} 给 ${uid} 点赞失败：`, res.msg)
          failure++
        } else if ((res.code == 51 || res.code == 20003 || /上限|已点/.test(res.msg)) && n < 10) {
          logger.mark(`[XAutoDaily] ${bot} 给 ${uid} 点赞上限（今日已点）：`, res.msg)
          processed++
        }
        break
      } else {
        n += 10
      }
    }
    if (n > 0) {
      logger.debug(`[XAutoDaily] ${bot} 给 ${uid} 点赞成功，次数: ${n}`)
      success++
    }
    await common.sleep(Config.ThumbUp.cd * 1000)
  }
  logger.info(`[XAutoDaily] 好友点赞任务完成，成功: ${success}, 失败: ${failure}, 已点: ${processed}`)
}

export default task
