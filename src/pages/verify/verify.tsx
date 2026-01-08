import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import { CheckCircle2, XCircle, Loader2, ArrowRight, Mail } from "lucide-react";
import { verifyUser } from "@/api/authApi";

// Shadcn Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Verify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorDetails, setErrorDetails] = useState<string>("");
  
  // 1. Add state for the countdown
  const [countdown, setCountdown] = useState(4);
  
  const verificationStarted = useRef(false);

  // Effect for API call
  useEffect(() => {
    if (verificationStarted.current) return;

    async function performVerification() {
      if (!token) {
        setStatus("error");
        setErrorDetails("The verification link is invalid or missing a token.");
        return;
      }

      verificationStarted.current = true;
      setStatus("loading");

      try {
        await verifyUser(token);
        setStatus("success");
        // We handle the redirect in the countdown effect below
      } catch (error: any) {
        setStatus("error");
        setErrorDetails(
          error?.response?.data?.message || 
          "The link may have expired or already been used."
        );
      }
    }

    performVerification();
  }, [token]);

  // 2. Effect for the Countdown Timer
  useEffect(() => {
    let interval: any;

    if (status === "success") {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate("/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Account Verification
          </CardTitle>
          <CardDescription>
            {status === "loading" && "Confirming your email address..."}
            {status === "success" && "Identity confirmed!"}
            {status === "error" && "Verification failed"}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center py-4">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground animate-pulse">
                Verifying with server...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-4 text-center py-2">
              <CheckCircle2 className="h-12 w-12 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Your email is now verified.</p>
                {/* 3. Show the countdown timer in the UI */}
                <p className="text-xs text-muted-foreground">
                  Redirecting to login in <span className="font-bold text-primary">{countdown}s</span>...
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <Alert variant="destructive" className="my-2">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="text-xs">
                {errorDetails}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-4">
          {status === "success" && (
            <Button asChild className="w-full">
              <Link to="/login">
                Login Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}

          {status === "error" && (
            <>
              <Button asChild variant="default" className="w-full">
                <Link to="/resend-verification">Request New Link</Link>
              </Button>
              <Button variant="ghost" asChild className="w-full">
                <Link to="/">Back to Home</Link>
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}