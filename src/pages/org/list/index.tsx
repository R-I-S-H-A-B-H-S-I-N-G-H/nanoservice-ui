import DialogComp from "@/components/custom/dilogComp";
import { TableComp } from "@/components/custom/tableComp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Org } from "@/types/org";
import { getLoggedUser, getTokenFromLocalStorage, saveTokenToLocalStorage } from "@/utils/jwtUtil";
import axios from "axios";
import { conf } from "../../../../config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { self } from "@/api/authApi";

async function getOrgList(userid = "", orgid = "") {
	const url = `${conf.BASE_URL}/account/org/list?orgId=${orgid}&userId=${userid}`;

	let res = await axios.get(url, {
		headers: {
			Authorization: `Bearer ${getTokenFromLocalStorage()}`,
		},
	});
	return res.data.data;
}

async function createOrg(payload: Org, userId = "") {
	const url = `${conf.BASE_URL}/account/org?userId=${userId}`;
	const res = await axios.post(url, payload, {
		headers: {
			Authorization: `Bearer ${getTokenFromLocalStorage()}`,
		},
	});
	return res.data.data;
}

export default function OrgList() {
	const userId = getLoggedUser()?.id;
	const [orgList, setOrgList] = useState<Org[]>([]);
	const navigate = useNavigate();
	const [orgPayload, setOrgPayload] = useState<Org>({
		name: "",
		creatorId: userId ?? "",
		slug: ""
	});

	useEffect(() => {
		updatedOrgList();
	}, [userId]);

	async function updatedOrgList() {
		// if (!userId) return;
		getOrgList(userId).then((res) => {
			setOrgList(res);
		});
	}

	async function handleOrgCreate() {
		try {
			if (!orgPayload.name || !orgPayload.creatorId) return;
			await createOrg(orgPayload, userId);
			
			const res = await self(userId);
			saveTokenToLocalStorage(res.jwt);
			
			await updatedOrgList();
			setOrgPayload({ name: "", creatorId: userId ?? "" });
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<div className="space-y-6 p-6">
			<Card>
				<CardHeader>
					<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
						<CardTitle>Organizations</CardTitle>
						<DialogComp title="Create Org" onSubmit={handleOrgCreate}>
							<Input placeholder="Org Name" value={orgPayload.name} onChange={(e) => setOrgPayload({ ...orgPayload, name: e.target.value })} />
							<Input placeholder="Org Slug" value={orgPayload.slug} onChange={(e) => setOrgPayload({ ...orgPayload, slug: e.target.value })} />
							<Input disabled placeholder="Owner Id" value={orgPayload.creatorId} onChange={(e) => setOrgPayload({ ...orgPayload, creatorId: e.target.value })} />
						</DialogComp>
					</div>
				</CardHeader>
				<CardContent>
					<TableComp
						columns={[
							{ header: "Name", accessor: "name" },
							{ header: "Owner", accessor: "creatorId" },
							{ header: "Created At", accessor: "createdAt" },
							{ header: "Updated At", accessor: "updatedAt" },
							{ header: "ID", accessor: "shortId" },
						]}
						data={orgList}
						onRowClick={(user) => {
							navigate(`${user.shortId}`, { relative: "path" });
						}}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
