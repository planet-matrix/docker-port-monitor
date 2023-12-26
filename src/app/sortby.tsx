"use client"

import { useAtom } from "jotai"
import { atomWithHash } from "jotai-location"
import { Router } from "next/router"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

export const sortByAtom = atomWithHash("sortBy", "default", {
  setHash: "replaceState",
  subscribe: (callback) => {
    Router.events.on("routeChangeComplete", callback)
    window.addEventListener("hashchange", callback)
    return () => {
      Router.events.off("routeChangeComplete", callback)
      window.removeEventListener("hashchange", callback)
    }
  },
})

export function SortBy() {
  const [sortBy, setSortBy] = useAtom(sortByAtom)
  return (
    <div className="flex gap-2 items-center self-end">
      <p>Sort by:</p>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px] self-end">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="names">Names</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
