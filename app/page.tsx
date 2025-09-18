import type { Metadata } from "next"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Home",
}

export default function Home() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 px-6 py-12">
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome to CropBinary</CardTitle>
          <CardDescription>
            A simple authentication starter powered by Next.js, Prisma, and
            shadcn/ui.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Sign in to access the dashboard or create a new account to get
            started. This home page is built using native shadcn components so
            you can easily extend the layout.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/signup">Create account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
