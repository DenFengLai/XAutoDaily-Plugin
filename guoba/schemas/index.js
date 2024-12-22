import { Config } from "#components"
import ThumbUp from "./ThumbUp.js"

export const schemas = [ ...ThumbUp ]

export function getConfigData() {
  return {
    ThumbUp: Config.ThumbUp
  }
}

export function setConfigData(data, { Result }) {
  for (let key in data) {
    Config.modify(...key.split("."), data[key])
  }
  return Result.ok({}, "Ciallo～(∠・ω< )⌒☆")
}
