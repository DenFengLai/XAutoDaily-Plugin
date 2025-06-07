import { Plugin_Path } from "#components"
import { join, extname } from "node:path"
import { pathToFileURL } from "node:url"
import { readdir } from "node:fs/promises"

const taskDir = join(Plugin_Path, "apps", "task")

/**
 * 加载任务文件
 * @returns {Promise<Array>} 返回符合条件的任务数组
 */
export async function loadTasks() {
  const tasks = []

  try {
    const files = await readdir(taskDir)

    for (const file of files) {
      if (file === "index.js" || extname(file) !== ".js") continue
      logger.info(`加载定时任务：${file}`)

      const fileUrl = pathToFileURL(join(taskDir, file)).href
      const taskModule = await import(fileUrl)
      const task = taskModule.default
      const addTask = (task) => {
        if (task && task.name && task.cron && task.fnc && typeof task.fnc === "function") {
          tasks.push(task)
        }
      }

      if (Array.isArray(task)) {
        task.forEach(addTask)
      } else {
        addTask(task)
      }
    }
  } catch (error) {
    logger.error("加载定时任务错误:", error)
  }

  return tasks
}
const tasks = await loadTasks()
export default tasks
