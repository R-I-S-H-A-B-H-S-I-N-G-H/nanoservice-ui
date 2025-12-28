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
                            { header: "Name", accessor: "title" },
                            { header: "Created At", accessor: "createdAt" },
                            { header: "Updated At", accessor: "updatedAt" },
                            { header: "ID", accessor: "shortId" },
                        ]}
                        data={streamList}
                        onRowClick={(stream) => {
                            navigate(`/watch/${stream.shortId}`, {  });
                        }}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
