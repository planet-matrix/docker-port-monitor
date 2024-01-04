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
import { psRowInfo } from "~/lib/state"

import type { PS } from "~/lib/state"

export const sortByAtom = atomWithHash<keyof PS>("sortBy", "CreatedAt", {
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
    <div className="flex gap-4 items-center self-end">
      <p>Sort by</p>
      <Select
        value={sortBy}
        onValueChange={(newSortBy) => {
          setSortBy(newSortBy as keyof PS)
        }}
      >
        <SelectTrigger className="w-[180px] self-end">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {psRowInfo.map((key) => (
            <SelectItem key={key} value={key}>
              {key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
