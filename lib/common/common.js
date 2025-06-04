import render from "../puppeteer/render.js"
import Config from "../../components/Config.js"
import common from "../../../../lib/common/common.js"

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
 * @param {boolean} all 是否发送给全部主人
 */
async function informMaster(msg, all = Config.whole.notificationsAll) {
  /** 获取配置信息 */
  let masterQQ = Config.masterQQ

  /** 发送全部主人 */
  if (all) {
    /** TRSS发全部主人函数 */
    if (Bot.sendMasterMsg) {
      await Bot.sendMasterMsg(msg, Bot.uin, 2000)
    } else {
      /** 遍历发送主人 */
      for (const i of masterQQ) {
        await common.relpyPrivate(i, msg)
        await common.sleep(2000)
      }
    }
  } else {
    await common.relpyPrivate(masterQQ[0], msg)
  }
}

export default {
  render,
  sleep,
  Replace,
  informMaster
}
