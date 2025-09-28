import DialogComp from "@/components/custom/dilogComp";
import { Input } from "@/components/ui/input";
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

async function createOrg(payload: Org) {
	const url = `http://localhost:8000/org`;
	const res = await axios.post(url, payload);
	return res.data.data;
}

export default function OrgList() {
	const [orgList, setOrgList] = useState<Org[]>([]);
	const [orgPayload, setOrgPayload] = useState<Org>({
		name: "",
		owner_id: userId,
	});

	useEffect(() => {
		updatedOrgList();
	}, []);

	async function updatedOrgList() {
		getOrgList(userId).then((res) => {
			setOrgList(res);
		});
	}

	async function handleOrgCreate() {
		try {
			if (!orgPayload.name || !orgPayload.owner_id) return;
			await createOrg(orgPayload);
			await updatedOrgList();
			setOrgPayload({ name: "", owner_id: userId });
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<>
			<DialogComp title="Create Org" onSubmit={handleOrgCreate}>
				<Input placeholder="Org Name" value={orgPayload.name} onChange={(e) => setOrgPayload({ ...orgPayload, name: e.target.value })} />
				<Input placeholder="Owner Id" value={orgPayload.owner_id} onChange={(e) => setOrgPayload({ ...orgPayload, owner_id: e.target.value })} />
			</DialogComp>
			{orgList.map((org) => {
				return (
					<Link to={`/org/${org.id}`}>
						<div className="font-bold underline">
							{org.name} --- {org.id}
						</div>
					</Link>
				);
			})}
		</>
	);
}
