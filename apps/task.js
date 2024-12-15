import task from "./task/index.js"

export class Task extends plugin {
  constructor() {
    super({
      name: "XAutoDaily-定时任务",
      dsc: "自动签到任务",
      task
    })
  }
}
