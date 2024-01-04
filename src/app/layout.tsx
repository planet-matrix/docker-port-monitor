import "~/styles/globals.css"

import { Inter } from "next/font/google"

import { cn } from "~/lib/utils"

import { Providers } from "./providers"
import { ThemeProvider } from "./theme-provider"

const inter = Inter({
  subsets: ["latin"],
})

export const metadata = {
  title: "Big Brother",
  description: "A web interface for Docker containers status",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-Hans" suppressHydrationWarning className="h-full">
      <body className={cn("h-full", inter.className)}>
        <Providers>
          <ThemeProvider>{children}</ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
