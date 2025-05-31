import schedule from "node-schedule"
import tasks from "./task/index.js"
import { Plugin_Name } from "#components"

tasks.forEach(task => {
  logger.debug(`[${Plugin_Name}] 加载定时任务: ${task.name}`)
  schedule.scheduleJob(task.cron.split(/\s+/).slice(0, 6).join(" "), task.fnc)
})
