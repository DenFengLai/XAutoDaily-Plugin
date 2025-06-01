import render from "../puppeteer/render.js"
import Config from "../../components/Config.js"
import common from "../../../../lib/common/common.js"
import cfg from "../../../../lib/config/config.js"

/**
 * 休眠函数
 * @param {number} ms - 毫秒
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 处理消息内容
 * @param {object} e - 消息事件
 * @param {RegExp} Reg - 正则表达式
 * @returns {object} message - 处理后的消息内容数组
 */
function Replace(e, Reg) {
  let message = e.message.filter((item) => item.type !== "at")

  let alias = []
  if (e.hasAlias && e.isGroup) {
    const groupCfg = Config.getGroup(e.group_id, e.self_id)
    alias = Array.isArray(groupCfg.botAlias) ? groupCfg.botAlias : [ groupCfg.botAlias ]
  }

  message = message.filter((item) => {
    if (item.type === "text") {
      if (Reg) item.text = item.text.replace(Reg, "").trim()

      if (!item.text) return false

      for (let name of alias) {
        if (item.text.startsWith(name)) {
          item.text = item.text.slice(name.length).trim()
          break
        }
      }
    } else if (item.url) {
      item.file = item.url
    }

    return true
  })

  return message
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

export default {
  render,
  sleep,
  Replace,
  informMaster
}
