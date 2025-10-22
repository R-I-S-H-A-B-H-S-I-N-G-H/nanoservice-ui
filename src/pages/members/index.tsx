import DialogComp from "@/components/custom/dilogComp";
import { TableComp } from "@/components/custom/tableComp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { User } from "@/types/user";
import { decodeToken, getLoggedUser, getTokenFromLocalStorage } from "@/utils/jwtUtil";
import axios from "axios";
import { conf } from "../../../config";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

async function getMembers(orgid: string, userid: string) {
	const url = `${conf.BASE_URL}/user/list?orgid=${orgid}&userid=${userid}`;
	const res = await axios.get(url, {
		headers: {
			Authorization: `Bearer ${getTokenFromLocalStorage()}`,
		},
	});
	return res.data.data;
}

async function saveUser(payload: User) {
	const url = `${conf.BASE_URL}/user`;
	const res = await axios.post(url, payload);
	return res.data.data;
}

async function addUserToOrg(orgid: string, userid: string) {
	const url = `${conf.BASE_URL}/membership`;
	const payload = {
		org_id: orgid,
		user_id: userid,
	};
	const res = await axios.post(url, payload);
	return res.data.data;
}

export default function Members() {
	const currentUser = getLoggedUser();
	const userId = currentUser?.id;

	if (!userId) {
		return <div>Invalid user</div>;
	}

	const { orgid = "" } = useParams();
	const navigate = useNavigate();
	const [userList, setUserList] = useState<User[]>([]);
	const [userPaylod, setUserPaylod] = useState<User>({
		email: "",
		full_name: "",
	});

	useEffect(() => {
		updateMemberList();
	}, []);

	async function saveUserHandler() {
		if (!userPaylod.email || !userPaylod.full_name) {
			console.warn("Cannont save user");

			return;
		}
		try {
			let user: User = await saveUser(userPaylod);
			if (!user.id) {
				return;
			}
			await addUserToOrg(orgid, user.id);
			updateMemberList();
		} catch (error) {}
	}

	async function updateMemberList() {
		if (!orgid || !userId) {
			console.warn("Missing orgid or userId");
			return;
		}

		const decoded = decodeToken(getTokenFromLocalStorage() || "") as { permissions?: Map<string, string[]> | Record<string, string[]> };
		const permittedUsers = decoded.permissions instanceof Map ? decoded.permissions.get(orgid) ?? [] : decoded.permissions?.[orgid] ?? [];

		getMembers(orgid, userId).then((data) => {
			setUserList(data.map((ele) => ({ ...ele, disabled: !(permittedUsers.includes(ele.id) || permittedUsers.includes("*")) })));
		});
	}

	return (
		<div className="space-y-6 p-6">
			<Card>
				<CardHeader>
					<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
						<CardTitle>Members</CardTitle>

						<DialogComp title="Create Member" onSubmit={saveUserHandler}>
							<div className="space-y-3 w-72">
								<Input placeholder="Email" value={userPaylod.email} onChange={(e) => setUserPaylod({ ...userPaylod, email: e.target.value })} />
								<Input placeholder="Full Name" value={userPaylod.full_name} onChange={(e) => setUserPaylod({ ...userPaylod, full_name: e.target.value })} />
								<Input disabled placeholder="Org" value={orgid} />
							</div>
						</DialogComp>
					</div>
				</CardHeader>
				<CardContent>
					<TableComp
						columns={[
							{ header: "Name", accessor: "full_name" },
							{ header: "Email", accessor: "email" },
							{ header: "Created At", accessor: "created_at" },
							{ header: "Updated At", accessor: "updated_at" },
							{ header: "ID", accessor: "id" },
						]}
						data={userList}
						onRowClick={(user) => {
							navigate(`${user.id}`, { relative: "path" });
						}}
						isRowDisabled={(user) => user.disabled ?? false}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
