import type { Org } from "@/types/org";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const userId = "p1RODZxD";
async function getOrgList(userid = "", orgid = "") {
	const url = `http://localhost:8000/org/list?orgid=${orgid}&userid=${userid}`;

	let res = await axios.get(url);
	return res.data.data;
}

export default function OrgList() {
	const [orgList, setOrgList] = useState<Org[]>([]);

	useEffect(() => {
		getOrgList(userId).then((res) => {
			setOrgList(res);
		});
	}, []);
	return (
		<>
			{orgList.map((org) => {
				return (
					<Link to={`/org/${org.id}/${userId}`}>
						<div className="flex items-center underline font-bold">
							<h2>{org.name}</h2>
							<h4> shortid - {org.id}</h4>
						</div>
					</Link>
				);
			})}
		</>
	);
}