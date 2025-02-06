import { Config } from "#components"
import ThumbUp from "./ThumbUp.js"
import auto_fire from "./auto_fire.js"

export const schemas = [
  ...ThumbUp,
  ...auto_fire
]

export function getConfigData() {
  return {
    ThumbUp: Config.ThumbUp,
    auto_fire: Config.auto_fire
  }
}

export function setConfigData(data, { Result }) {
  for (let key in data) {
    Config.modify(...key.split("."), data[key])
  }
  return Result.ok({}, "Ciallo～(∠・ω< )⌒☆")
}
