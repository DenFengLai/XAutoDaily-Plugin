import { schemas, getConfigData, setConfigData } from "./schemas/index.js"
import tasks from "../apps/task/index.js"

const actions = {
  /**
   * 运行所有任务
   * @param {any} _ - 未使用的参数
   * @param {object} params - 参数对象
   * @param {object} params.Result - 结果对象
   */
  async runTask(_, { Result }) {
    const taskFns = tasks.map(t => t.fnc).filter(fn => typeof fn === "function")
    if (taskFns.length) {
      taskFns.forEach(fn => fn())
      return Result.ok({}, "开始执行辣")
    } else {
      return Result.error("没有可执行的任务")
    }
  }
}

export default {
  schemas,
  getConfigData,
  setConfigData,
  actions
}
