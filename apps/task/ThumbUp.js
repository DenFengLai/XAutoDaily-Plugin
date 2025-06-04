import { Config, common } from "#components"
import { ThumbUpApi } from "#model"

let task = {}

if (Config.ThumbUp.auto) {
  task = {
    cron: Config.ThumbUp.cron,
    name: "好友点赞",
    fnc: async() => ThumbUp()
  }
}

async function ThumbUp() {
  let taskName = "ThumbUp"
  if (await common.isTaskDone(taskName)) {
    common.informMaster("[XAutoDaily] 今日好友点赞任务已完成，将跳过执行")
    return false
  }
  common.informMaster("[XAutoDaily] 开始执行好友点赞任务" + "..." + Config.ThumbUp.list.length + " 个好友，预计需要 " + (Config.ThumbUp.list.length * Config.ThumbUp.cd) + " 秒")
  let success = 0
  let failure = 0
  let processed = 0

  for (const item of Config.ThumbUp.list) {
    const [ bot, uid ] = item.split(":")
    let totalLikes = 0
    const thumbUpApi = new ThumbUpApi(bot)

    for (let attempt = 0; attempt < 10; attempt++) {
      let res
      try {
        res = await thumbUpApi.thumbUp(uid, 10)
      } catch (error) {
        logger.error(`[XAutoDaily] ${bot} 给 ${uid} 点赞异常:`, error)
        failure++
        break
      }

      logger.debug(`[XAutoDaily] ${bot} 给 ${uid} 点赞`, res)

      if (res?.code) {
        if (res.code === 1) {
          logger.mark(`[XAutoDaily] ${bot} 给 ${uid} 点赞失败：`, res.msg)
          failure++
          break
        } else if (
          [ 51, 20003 ].includes(res.code) ||
          /上限|已点/.test(res.msg)
        ) {
          logger.mark(`[XAutoDaily] ${bot} 给 ${uid} 点赞上限（今日已点）：`, res.msg)
          processed++
          break
        }
      } else {
        totalLikes += 10
      }
    }

    if (totalLikes > 0) {
      logger.debug(`[XAutoDaily] ${bot} 给 ${uid} 点赞成功，次数: ${totalLikes}`)
      success++
    }

    await common.sleep(Config.ThumbUp.cd * 1000)
  }

  common.informMaster(`[XAutoDaily] 好友点赞任务完成，成功: ${success}, 失败: ${failure}, 已点: ${processed}`)
  common.setTaskDone(taskName)
  return { success, failure, processed }
}

export default task
