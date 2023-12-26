import { exec } from "node:child_process"
import { unstable_cache } from "next/cache"

export interface PS {
  Command: string
  CreatedAt: string
  ID: string
  Image: string
  Labels: string
  LocalVolumes: string
  Mounts: string
  Names: string
  Networks: string
  Ports: string
  RunningFor: string
  Size: string
  State: string
  Status: string
}

export const psRowInfo = [
  "Command",
  "CreatedAt",
  "ID",
  "Image",
  "Labels",
  "LocalVolumes",
  "Mounts",
  "Names",
  "Networks",
  "Ports",
  "RunningFor",
  "Size",
  "State",
  "Status",
] as const

export const usefulPsRowInfo = [
  // "Command",
  // "CreatedAt",
  // "ID",
  "Image",
  // "Labels",
  // "LocalVolumes",
  // "Mounts",
  "Names",
  // "Networks",
  "Ports",
  // "RunningFor",
  // "Size",
  // "State",
  "Status",
] as const
export type UsefulPSRowInfo = typeof usefulPsRowInfo

async function innerPs() {
  // run docker ps -a
  const process = exec("docker ps -a --no-trunc --format '{{ json . }}'")

  // return a promise that resolves with the output
  return new Promise<{
    timestamp: number
    data: PS[]
  }>((resolve, reject) => {
    let output = ""
    process.stdout?.on("data", (data) => {
      output += data
    })
    process.stderr?.on("data", (data) => {
      output += data
    })
    process.on("close", () => {
      try {
        resolve({
          data: output
            .split("\n")
            .filter(Boolean)
            .map((line) => JSON.parse(line) as PS),
          timestamp: Date.now(),
        })
      } catch (error) {
        reject(error)
      }
    })
    process.on("error", (error) => {
      reject(error)
    })
  })
}
export const ps = unstable_cache(
  innerPs,
  ["docker ps -a --no-trunc --format '{{ json . }}'"],
  {
    revalidate: 5 * 60,
  },
)
