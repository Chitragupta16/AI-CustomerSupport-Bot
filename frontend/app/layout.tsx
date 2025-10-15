import "./globals.css"

export const metadata = {
  title: "AI Customer Support Bot",
  description: "Automated AI customer support system",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  )
}
