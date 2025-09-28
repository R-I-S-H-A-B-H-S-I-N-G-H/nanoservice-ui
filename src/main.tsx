import { createRoot } from 'react-dom/client'
import "./index.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { StrictMode } from "react";
import Media from "./pages/media";
import OrgList from "./pages/org/list/index.tsx";
import UserDash from './pages/userDash/index.tsx';
import Members from "./pages/members/index.tsx";

const router = createBrowserRouter([
	{
		path: "/org",
		element: <OrgList />,
	},
	{
		path: "/org/:orgid",
		children: [
			{
				path: "",
				element: <Members />,
			},
			{
				path: ":userid",
				children: [
					{
						path: "",
						element: <UserDash />,
					},
					{
						path: "media",
						element: <Media />,
					},
				],
			},
		],
	},
	{
		path: "*",
		element: <>404 not found</>,
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
