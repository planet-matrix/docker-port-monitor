import { format } from "date-fns"

import { AppearanceSwitch } from "~/components/appearance-switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { ps, usefulPsRowInfo } from "~/lib/ps"

export const dynamic = "force-dynamic"

export default async function Home() {
  const { data: psOut, timestamp } = await ps()

  const rows = psOut.map((p) => Object.values(p))

  return (
    <div className="h-full p-10">
      <div className="flex flex-col max-w-4xl mx-auto justify-center items-center">
        <code className="text-2xl my-4">docker ps -a</code>
        <p className="text-sm opacity-60 my-2">
          Hi! I'm running on port <code className="font-bold">3000</code>.{" "}
          {`Updated at ${format(timestamp, "yyyy-MM-dd HH:mm:ss")}.`}
        </p>

        <AppearanceSwitch className="my-5" />
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
              <TableRow key={row[0]}>
                {usefulPsRowInfo.map((key) => {
                  const cell = psOut[rowIndex]![key]!
                  return (
                    <TableCell key={cell} title={cell} className="space-y-2">
                      {
                        // eslint-disable-next-line @eslint-react/jsx/no-complicated-conditional-rendering
                        key === "ID"
                          ? cell.slice(0, 6) + "..."
                          : key === "CreatedAt"
                            ? format(new Date(cell), "yyyy-MM-dd HH:mm:ss")
                            : key === "Ports"
                              ? cell
                                  .split(", ")
                                  .filter((port) => !port.startsWith(":::"))
                                  .map((port) => <div key={port}>{port}</div>)
                              : cell
                      }
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
