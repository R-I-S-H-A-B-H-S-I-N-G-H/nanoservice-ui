import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// Import icons for the navigation links
import { Film, Settings, UserCog, ChevronRight } from "lucide-react";

// Define navigation options in an array for easy scalability
const navigationOptions = [
	{ to: "media", label: "Manage Media", icon: Film },
	{ to: "settings", label: "Account Settings", icon: Settings },
	{ to: "profile", label: "Edit Profile", icon: UserCog },
	// Add new navigation links here in the future
];

export default function UserDash() {
	const { userid, orgid } = useParams();

	return (
		<div className="flex justify-center items-center min-h-screen bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>User Dashboard</CardTitle>
					<CardDescription>Select an option below to manage user and organization details.</CardDescription>
				</CardHeader>
				<CardContent>
					{/* User and Org ID section remains the same */}
					<div className="space-y-3 mb-6">
						<div className="flex items-baseline justify-between p-3 rounded-lg bg-muted">
							<span className="text-sm font-medium text-muted-foreground">User ID</span>
							<span className="font-mono text-sm font-semibold tracking-wide">{userid}</span>
						</div>
						<div className="flex items-baseline justify-between p-3 rounded-lg bg-muted">
							<span className="text-sm font-medium text-muted-foreground">Organization ID</span>
							<span className="font-mono text-sm font-semibold tracking-wide">{orgid}</span>
						</div>
					</div>

					{/* Navigation Section */}
					<nav>
						<h3 className="text-sm font-semibold text-foreground mb-2">Actions</h3>
						<div className="flex flex-col space-y-2">
							{navigationOptions.map((option) => (
								<Button key={option.to} variant="outline" className="w-full justify-between" asChild>
									<Link to={option.to} relative="path">
										<div className="flex items-center">
											<option.icon className="mr-3 h-4 w-4 text-muted-foreground" />
											{option.label}
										</div>
										<ChevronRight className="h-4 w-4 text-muted-foreground" />
									</Link>
								</Button>
							))}
						</div>
					</nav>
				</CardContent>
				<CardFooter>
					<p className="text-xs text-muted-foreground text-center w-full">More options will be added in the future.</p>
				</CardFooter>
			</Card>
		</div>
	);
}
