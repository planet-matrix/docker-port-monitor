import { format } from "date-fns"
import { cookies, headers } from "next/headers"

import { AppearanceSwitch } from "~/components/appearance-switch"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { env } from "~/env"
import { ps, usefulPsRowInfo } from "~/lib/ps"

import { DataTable } from "./table"

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

  return (
    <div className="h-full p-10">
      <div className="flex flex-col mx-auto justify-center items-center">
        <div className="flex gap-4 items-center">
          <code className="text-2xl my-4">docker ps -a</code>
          <AppearanceSwitch className="my-5" />
        </div>
        <p className="text-sm opacity-60 mb-6">
          Hi! I'm running on port <code className="font-bold">3000</code>.{" "}
          {`Updated at ${format(timestamp, "yyyy-MM-dd HH:mm:ss")}.`}
        </p>
        <DataTable
          psOut={psOut}
          hostWithoutPort={hostWithoutPort ?? ""}
          usefulPsRowInfo={usefulPsRowInfo}
        />
      </div>
    </div>
  )
}
