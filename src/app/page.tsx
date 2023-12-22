import { format } from "date-fns"
import { cookies, headers } from "next/headers"

import { AppearanceSwitch } from "~/components/appearance-switch"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { env } from "~/env"
import { ps, usefulPsRowInfo } from "~/lib/ps"
import { cn } from "~/lib/utils"

export const dynamic = "force-dynamic"

// eslint-disable-next-line @typescript-eslint/require-await
async function login(formData: FormData) {
  "use server"
  const password = formData.get("password")?.toString() ?? ""

  const cookieStore = cookies()
  cookieStore.set("password", password)
}

export default async function Home() {
  const headersList = headers()
  const host = headersList.get("host")
  const hostWithoutPort = host?.split(":")[0]

  const cookieStore = cookies()
  const password = cookieStore.get("password")?.value
  if (!password || password !== env.PASSWORD) {
    return (
      <div className="h-full flex flex-col gap-4 justify-center max-w-sm mx-auto">
        <h1 className="text-2xl">Please login first.</h1>
        <form action={login} className="flex gap-2">
          <Input
            type="password"
            placeholder="Password"
            id="password"
            name="password"
          ></Input>
          <Button type="submit">Login</Button>
        </form>
      </div>
    )
  }

  const { data: psOut, timestamp } = await ps()

  const rows = psOut.map((p) => Object.values(p))

  return (
    <div className="h-full p-10">
      <div className="flex flex-col mx-auto justify-center items-center">
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
      </div>
    </div>
  )
}
