import { format, formatRelative } from "date-fns"

import { AppearanceSwitch } from "~/components/appearance-switch"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { ps, usefulPsRowInfo } from "~/lib/ps"

export default async function Home() {
  const { data: psOut, timestamp } = await ps()

  const rows = psOut.map((p) => Object.values(p))

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto gap-4 justify-center items-center">
      <code className="text-2xl">docker ps -a</code>
      <Table>
        <TableCaption>
          {`Updated at ${format(timestamp, "yyyy-MM-dd HH:mm:ss")}`}
        </TableCaption>
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
                          ? formatRelative(new Date(cell), new Date())
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
      <AppearanceSwitch />
    </div>
  )
}
