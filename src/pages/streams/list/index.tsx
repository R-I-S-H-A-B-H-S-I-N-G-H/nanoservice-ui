import { getStreamList } from "@/api/streamsApi";
import { TableComp } from "@/components/custom/tableComp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Stream } from "@/types/stream";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function StreamsList() {
    const { userid, orgid } = useParams();
    const navigate = useNavigate()
    const [streamList, setStreamList] = useState<Stream[]>([]);

    useEffect(() => {
        updateStreamList();
    }, [])

    
    async function updateStreamList() {
        const res = await getStreamList(orgid, userid);
        setStreamList(res)
        console.log(res);
    }
    return (
        <div className="space-y-6 p-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <CardTitle>Streams</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <TableComp
                        columns={[
                            { header: "Name", accessor: "name" },
                            { header: "Created At", accessor: "created_at" },
                            { header: "Updated At", accessor: "updated_at" },
                            { header: "ID", accessor: "id" },
                        ]}
                        data={streamList}
                        onRowClick={(stream) => {
                            navigate(`${stream.id}`, { relative: "path" });
                        }}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
