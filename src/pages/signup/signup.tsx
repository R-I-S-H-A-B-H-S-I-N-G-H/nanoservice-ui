"use client"

import { useState } from "react"
import { signUpUser } from "@/api/authApi"
import type { SignUpPayload } from "@/types/user"

// Shadcn UI Components
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, XCircle, MailCheck } from "lucide-react"

export default function SignUp() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false) // Track success state
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const [userSignUpPayload, setUserSignUpPayload] = useState<SignUpPayload>({
    email: "",
    fullName: "",
    password: "",
  })

  const passwordRequirements = {
    length: userSignUpPayload.password.length >= 8,
    hasNumber: /\d/.test(userSignUpPayload.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(userSignUpPayload.password),
  }

  const isPasswordStrong = Object.values(passwordRequirements).every(Boolean)
  const passwordsMatch = 
    userSignUpPayload.password === confirmPassword && confirmPassword.length > 0

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setUserSignUpPayload((prev) => ({ ...prev, [id]: value }))
  }

  async function signupHandler(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!isPasswordStrong || !passwordsMatch) return

    try {
      setLoading(true)
      await signUpUser(userSignUpPayload)
      setIsSuccess(true) // Trigger success view
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // --- Success View ---
  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-border bg-card shadow-xl text-center">
          <CardHeader>
            <div className="flex justify-center pb-4">
              <div className="rounded-full bg-primary/10 p-3">
                <MailCheck className="h-10 w-10 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
            <CardDescription className="text-base pt-2">
              We've sent a verification link to <br />
              <span className="font-semibold text-foreground">{userSignUpPayload.email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Please click the link in the email to verify your account. If you don't see it, check your spam folder.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button variant="outline" className="w-full" onClick={() => setIsSuccess(false)}>
              Try another email
            </Button>
            <a href="/login" className="text-sm text-primary underline-offset-4 hover:underline">
              Back to Login
            </a>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // --- Form View ---
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border bg-card shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
          <CardDescription>Enter your information to get started</CardDescription>
        </CardHeader>

        <form onSubmit={signupHandler}>
          <CardContent className="grid gap-4">
            {error && (
              <Alert variant="destructive" className="py-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" placeholder="Rishabh Singh" value={userSignUpPayload.fullName} onChange={handleChange} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" value={userSignUpPayload.email} onChange={handleChange} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={userSignUpPayload.password}
                onChange={handleChange}
                required
                className={isPasswordStrong ? "border-green-500/50 focus-visible:ring-green-500" : ""}
              />
              <div className="grid grid-cols-2 gap-1 pt-1 text-xs">
                <div className={`flex items-center gap-1 ${passwordRequirements.length ? "text-green-600" : "text-muted-foreground"}`}>
                  {passwordRequirements.length ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-current" />}
                  8+ characters
                </div>
                <div className={`flex items-center gap-1 ${passwordRequirements.hasNumber ? "text-green-600" : "text-muted-foreground"}`}>
                  {passwordRequirements.hasNumber ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-current" />}
                  Contains number
                </div>
                <div className={`flex items-center gap-1 ${passwordRequirements.hasSpecial ? "text-green-600" : "text-muted-foreground"}`}>
                  {passwordRequirements.hasSpecial ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-current" />}
                  Special character
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Verify Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={passwordsMatch ? "border-green-500/50 focus-visible:ring-green-500" : ""}
                />
                <div className="absolute right-3 top-2.5">
                  {passwordsMatch ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : confirmPassword.length > 0 ? (
                    <XCircle className="h-4 w-4 text-destructive" />
                  ) : null}
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-6">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !isPasswordStrong || !passwordsMatch}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4 hover:text-primary">Login</a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}