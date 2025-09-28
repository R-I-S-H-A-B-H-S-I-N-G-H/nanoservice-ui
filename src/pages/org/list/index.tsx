import DialogComp from "@/components/custom/dilogComp";
import { TableComp } from "@/components/custom/tableComp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Org } from "@/types/org";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

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
	const navigate = useNavigate();
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
		<div className="space-y-6 p-6">
			<Card>
				<CardHeader>
					<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
						<CardTitle>Organizarions</CardTitle>
						<DialogComp title="Create Org" onSubmit={handleOrgCreate}>
							<Input placeholder="Org Name" value={orgPayload.name} onChange={(e) => setOrgPayload({ ...orgPayload, name: e.target.value })} />
							<Input disabled placeholder="Owner Id" value={orgPayload.owner_id} onChange={(e) => setOrgPayload({ ...orgPayload, owner_id: e.target.value })} />
						</DialogComp>
					</div>
				</CardHeader>
				<CardContent>
					<TableComp
						columns={[
							{ header: "Name", accessor: "name" },
							{ header: "Owner", accessor: "owner_id" },
							{ header: "Created At", accessor: "created_at" },
							{ header: "Updated At", accessor: "updated_at" },
							{ header: "ID", accessor: "id" },
						]}
						data={orgList}
						onRowClick={(user) => {
							navigate(`${user.id}`, { relative: "path" });
						}}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
