"use client"

import { useAtomValue } from "jotai"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { usefulPsRowInfo } from "~/lib/state"
import { cn } from "~/lib/utils"

import { SortBy, sortByAtom } from "./sortby"

import type { PS } from "~/lib/state"

export function DataTable({
  psOut,
  hostWithoutPort,
}: {
  psOut: PS[]
  hostWithoutPort: string
}) {
  const sortBy = useAtomValue(sortByAtom)
  const rows = [...psOut].sort((a, b) => {
    return -a[sortBy].localeCompare(b[sortBy])
  })
  return (
    <>
      <SortBy />
      <Table>
        <TableHeader>
          <TableRow>
            {usefulPsRowInfo.map((h) => (
              <TableHead key={h}>{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={row.ID}>
              {usefulPsRowInfo.map((key) => {
                const cell = rows[rowIndex]![key as keyof PS]!
                return (
                  <TableCell
                    key={cell}
                    title={cell}
                    className={cn(
                      "space-y-2",
                      key === "Status" &&
                        (cell.includes("Exited")
                          ? "text-red-500"
                          : "text-green-500"),
                    )}
                  >
                    {key === "Ports"
                      ? cell
                          .split(", ")
                          .filter((port) => !port.startsWith(":::"))
                          .map((port) => {
                            if (/0\.0\.0\.0:\d+->\d+\/tcp/.test(port)) {
                              const hostPort = port
                                .split("->")[0]
                                ?.split(":")[1]
                              if (hostPort) {
                                return (
                                  <div key={port}>
                                    <a
                                      href={`http://${hostWithoutPort}:${hostPort}`}
                                      target="_blank"
                                      rel="noreferrer noopener"
                                      className="hover:underline"
                                    >
                                      {`${hostWithoutPort}:${hostPort}`}
                                    </a>
                                  </div>
                                )
                              }
                            }
                            return <div key={port}>{port}</div>
                          })
                      : cell}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
