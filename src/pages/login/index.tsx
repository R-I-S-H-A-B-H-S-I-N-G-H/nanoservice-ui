import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { login } from "@/api/authApi";
import { saveTokenToLocalStorage } from "@/utils/jwtUtil";
import { useNavigate } from "react-router";
import { Spinner } from "@/components/ui/spinner";

export default function Login() {
	const navigator = useNavigate();
	const [authPayload, setAuthPayload] = useState<{ email?: string; password?: string }>({});
	const [loginState, setLoginState] = useState<{ isLogging: boolean }>({ isLogging: false });

	async function loginHandler(e: any) {
		e.preventDefault();
		if (authPayload.email === undefined || authPayload.password === undefined) {
			return;
		}
		try {
			setLoginState({ ...loginState, isLogging: true });
			const res = await login(authPayload.email, authPayload.password);
			saveTokenToLocalStorage(res);
			navigator("/org");
			setLoginState({ ...loginState, isLogging: false });
		} catch (error) {
			setLoginState({ ...loginState, isLogging: false });
		}
	}

	return (
		<div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="w-full max-w-sm">
				<div className={cn("flex flex-col gap-6")}>
					<form>
						<div className="flex flex-col gap-6">
							<div className="flex flex-col items-center gap-2">
								<a href="#" className="flex flex-col items-center gap-2 font-medium">
									<div className="flex size-8 items-center justify-center rounded-md">
										<GalleryVerticalEnd className="size-6" />
									</div>
									<span className="sr-only">Nanoservice</span>
								</a>
								<h1 className="text-xl font-bold">Welcome to Nanoservice</h1>
								<div className="text-center text-sm">
									Don&apos;t have an account?{" "}
									<a href="#" className="underline underline-offset-4">
										Sign up
									</a>
								</div>
							</div>
							<div className="flex flex-col gap-6">
								<div className="grid gap-3">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="m@example.com"
										required
										value={authPayload.email}
										onChange={(e) => setAuthPayload({ ...authPayload, email: e.target.value })}
									/>
								</div>
								<div className="grid gap-3">
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										type="password"
										placeholder="*******"
										required
										value={authPayload.password}
										onChange={(e) => setAuthPayload({ ...authPayload, password: e.target.value })}
									/>
								</div>
								<Button disabled={loginState.isLogging} type="submit" className="w-full" onClick={loginHandler}>
									{loginState.isLogging && <Spinner />}
									Login
								</Button>
							</div>
						</div>
					</form>
					<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
						By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
					</div>
				</div>
			</div>
		</div>
	);
}
