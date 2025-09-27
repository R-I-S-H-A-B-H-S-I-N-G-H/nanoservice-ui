import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { StrictMode } from 'react';
import Media from './pages/media';

const router = createBrowserRouter([
	{
		path: "/:orgid",
		children: [
			{
				path: ":userid",
				children: [
					{
						path: "media",
						element: <Media />,
					}
				]
			},
		],
	},
	{
		path: "*",
		element: (
			<>
				404 not found
			</>
		),
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
