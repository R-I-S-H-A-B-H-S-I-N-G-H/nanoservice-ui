import DialogComp from "@/components/custom/dilogComp";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { User } from "@/types/user";
import axios from "axios";
import { use, useEffect, useState } from "react";
import { Link, useParams } from "react-router";

async function getMembers(orgid: string) {
    const url = `http://localhost:8000/user/list?orgid=${orgid}`;
    const res = await axios.get(url)
    return res.data.data;
}

async function saveUser(payload: User) {
    const url = `http://localhost:8000/user`;
	const res = await axios.post(url, payload);
	return res.data.data;
}

async function addUserToOrg(orgid: string, userid: string) {
    const url = `http://localhost:8000/membership`;
    const payload = {
		org_id: orgid,
		user_id: userid,
	};
    const res = await axios.post(url, payload);
    return res.data.data;
}


/**
{
    "email":"member@gmail.com",
    "full_name":"Member 1"
}
 */

export default function Members() {
    const { orgid = "" } = useParams();
    const [userList, setUserList] = useState<User[]>([])
    const [userPaylod, setUserPaylod] = useState<User>({
        email: "",
        full_name: ""
    })

    useEffect(() => {
        updateMemberList();
    }, [])
    
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
        getMembers(orgid).then((data) => {
            console.log(data);
            setUserList(data);
        });
    }

    return (
		<div>
			<div className="flex justify-around">
				<div>orgid-- {orgid}</div>
                <DialogComp title="Create Member" onSubmit={() => {
                    saveUserHandler();
                }}>
					<Input placeholder="Email" value={userPaylod.email} onChange={(e) => setUserPaylod({ ...userPaylod, email: e.target.value })} />
                    <Input placeholder="Full Name" value={userPaylod.full_name} onChange={(e) => setUserPaylod({ ...userPaylod, full_name: e.target.value })}/>
                    <Input disabled placeholder="Org" value={orgid} />
				</DialogComp>
			</div>
			<div>
				{userList.map((user) => {
					return (
						<Link to={`/org/${orgid}/${user.id}`} key={user.id}>
							<div key={user.id}>{user.full_name}</div>
                            <div>{user.email}</div>
                            <div>{user.id}</div>
                            <div>{user.created_at}</div>
                            <div>{ user.updated_at}</div>
							<Separator />
						</Link>
					);
				})}
			</div>
		</div>
	);
}
