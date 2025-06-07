import render from "../puppeteer/render.js"
import Config from "../../components/Config.js"
import common from "../../../../lib/common/common.js"
import moment from "moment"
// import tasks from "../../apps/task/index.js"
import { CronExpressionParser } from "cron-parser"
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

/**
 * 任务是否已执行
 * @param {string} taskName - 任务名称
 * @returns {Promise<boolean>} - 是否已执行
 */
async function isTaskDone(taskName) {
  const today = moment().format("YYYYMMDD")
  return Boolean(await redis.get(`XAuto:task:${taskName}:${today}`))
}

/**
 * 设置任务已执行
 * @param {string} taskName - 任务名称
 * @param {string} message - 可选的消息内容，默认为 "1"
 */
async function setTaskDone(taskName, message = "1") {
  const today = moment().format("YYYYMMDD")
  const now = new Date()
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  const ttl = Math.floor((tomorrow - now) / 1000)
  return redis.set(`XAuto:task:${taskName}:${today}`, message, "EX", ttl)
}

/**
 * 获取任务最后执行状态
 * @param {string} taskName - 任务名称
 * @returns {Promise<string|null>} - 任务状态
 */
async function getLastTaskStatus(taskName) {
  let Task = await redis.keys(`XAuto:task:${taskName}:*`)
  if (Task.length === 0) return null
  Task.sort((a, b) => {
    const numA = parseInt(a.split(":").pop(), 10)
    const numB = parseInt(b.split(":").pop(), 10)
    return numB - numA
  })
  return redis.get(Task[0])
}

/**
 * 获取任务执行状态信息
 * @param {string} taskName - 任务名称
 * @returns {Promise<string>} - 任务状态信息
 */
async function getTaskStatusMessage(taskName) {
  let status = await getLastTaskStatus(taskName)
  let task = await getTaskByName(taskName)
  if (!task) return "未找到相关任务"
  let nextTime = getNextCronTime(task.cron) || "未知"
  if (!status) return "任务尚未被执行，下一次执行时间: " + nextTime
  if (status) {
    try {
      status = JSON.parse(status)
    } catch (e) {
      return "任务尚未被执行"
    }
  }
  return `上次: ${moment(status.Time).format("YYYY-M-D HH:mm:ss") || "未知"}，响应: ${status.Message || `成功: ${status.Success} 失败: ${status.Failure} ${status.Processed ? `已处理: ${status.Processed}` : ""}`}, 下次: ${nextTime}`.trim()
}

/**
 * 通过任务名称获取定时任务
 * @param {string} taskName - 任务名称
 */
async function getTaskByName(taskName) {
  const tasks = await import("../../apps/task/index.js").then((mod) => mod.default)
  const task = tasks.find((t) => t.name === taskName)
  return task || null
}

/**
 * 获取下一个 cron 时间
 * @param {string} cronExpr - cron 表达式
 * @param {Date} [fromDate] - 起始日期，可选
 * @returns {string|null} - 下一个时间点，格式为 "YYYY-MM-DD HH:mm:ss"，失败时返回 null
 */
function getNextCronTime(cronExpr, fromDate = new Date()) {
  try {
    const interval = CronExpressionParser.parse(cronExpr, { currentDate: fromDate })
    const next = interval.next().toDate()
    return moment(next).format("YYYY-MM-DD HH:mm:ss")
  } catch (err) {
    logger.error(`获取下一个 cron 时间失败: ${err.message}`, { cronExpr, fromDate })
    return null
  }
}

/**
 * 重置所有任务状态
 * @returns {Promise<void>}
 */
async function resetTaskAll() {
  const keys = await redis.keys("XAuto:task:*")
  if (keys.length === 0) return
  return redis.del(keys)
}

/**
 * 重置任务执行状态
 * @param {string} taskName - 任务名称
 */
async function resetTaskStatus(taskName) {
  const today = moment().format("YYYYMMDD")
  return redis.del(`XAuto:task:${taskName}:${today}`)
}

export default {
  getTaskStatusMessage,
  resetTaskAll,
  getLastTaskStatus,
  resetTaskStatus,
  setTaskDone,
  isTaskDone,
  render,
  sleep,
  Replace,
  informMaster
}
