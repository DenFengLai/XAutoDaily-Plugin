import { Config, Plugin_Path } from "#components"
import fs from "fs/promises"

import { pathToFileURL } from "node:url"
import { join } from "node:path"

const schemaDir = join(Plugin_Path, "guoba", "schemas")

const files = (await fs.readdir(schemaDir))
  .filter(file => file.endsWith(".js") && file !== "index.js")

export const schemas = await Promise.all(
  files.map(async file => {
    const mod = await import(pathToFileURL(join(schemaDir, file)).href)
    return mod.default || []
  })
).then(results => results.flat())

export function getConfigData() {
  const proto = Object.getPrototypeOf(Config)
  const getters = Object.entries(Object.getOwnPropertyDescriptors(proto))
    .filter(([ name, descriptor ]) => typeof descriptor.get === "function")
    .map(([ name ]) => name)
  return Object.fromEntries(
    getters.map(key => [ key, Config[key] ])
  )
}

export function setConfigData(data, { Result }) {
  for (let key in data) {
    Config.modify(...key.split("."), data[key])
  }
  return Result.ok({}, "Ciallo～(∠・ω< )⌒☆")
}
