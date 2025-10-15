import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/lib/auth-context"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Sanjeev Kumar Das | Portfolio",
  description: "Sanjeev Kumar Das's personal portfolio - Software Engineer & Full Stack Developer",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script 
          src="https://seo-fixer.writesonic.com/site-audit/fixer-script/index.js" 
          id="wsAiSeoMb" 
          type="application/javascript"
        ></script>
        <script id="wsAiSeoInitScript" dangerouslySetInnerHTML={{
          __html: `
            wsSEOfixer.configure({
              hostURL: 'https://seo-fixer.writesonic.com',
              siteID: '68ef236b0951fe63f010713c'
            });
          `
        }} />
      </head>
      <body className={`${jetbrainsMono.variable} font-mono bg-black text-white min-h-screen flex flex-col`}>
        <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0"></div>
        <AuthProvider>
          <Navigation />
          <main className="flex-1 container mx-auto px-4 py-8 relative z-10">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}


import './globals.css'
