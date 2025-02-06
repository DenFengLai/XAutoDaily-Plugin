import _ from "lodash"
import cfg from "../../../../lib/config/config.js"
import common from "../../lib/common/common.js"
import { Config } from "#components"

const task = []

if (Config.auto_fire.group.length > 0) {
  task.push({
    cron: Config.auto_fire.gp_cron,
    name: "[自动续火]群聊续火",
    fnc: () => auto_fire(Config.auto_fire.group, Config.auto_fire.gp_text, "群聊续火")
  })
}

if (Config.auto_fire.friend.length > 0) {
  task.push({
    cron: Config.auto_fire.fl_cron,
    name: "[自动续火]好友续火",
    fnc: () => auto_fire(Config.auto_fire.friend, Config.auto_fire.fl_text, "好友续火")
  })
}

export default task

/**
 * 自动续火
 * @param {Array} targets 群聊或好友列表
 * @param {Array} texts 续火内容数组
 * @param {string} taskDesc 任务描述
 */
async function auto_fire(targets, texts, taskDesc) {
  if (targets.length < 1 || texts.length < 1) return false

  const isGroup = taskDesc.includes("群聊")
  informMaster(`开始${taskDesc}\n共：${targets.length}${isGroup ? "个群聊" : "人"}\n预计需要：${targets.length * Config.auto_fire.cd}秒`)

  let Success = 0
  let Failure = 0

  for (const id of targets) {
    const text = _.sample(texts)
    try {
      const sendResult = isGroup ? await Bot.pickGroup(id).sendMsg(text) : await Bot.pickFriend(id).sendMsg(text)
      if (sendResult?.message_id?.length) Success++
      else Failure++
    } catch (error) {
      Failure++
      logger.error(`发送消息失败：${error.message}`)
    }
    await common.sleep(Config.auto_fire.cd * 1000)
  }

  informMaster(`${taskDesc}任务完成\n成功：${Success}${isGroup ? "个" : ""} 失败：${Failure}${isGroup ? "个" : ""}`)
}

/**
 * 通知主人
 * @param {string} msg 发送的文本
 * @returns {string} 消息id
 */
async function informMaster(msg) {
  const masterQQ = cfg.master?.[Bot.uin] || cfg.masterQQ

  if (Config.auto_fire.notificationsAll && Bot.sendMasterMsg) {
    return Bot.sendMasterMsg(msg, Bot.uin, Config.auto_fire.cd * 1000)
  } else {
    for (const qq of masterQQ) {
      await common.relpyPrivate(qq, msg, Bot.uin)
      await common.sleep(Config.auto_fire.cd * 1000)
    }
  }
}
