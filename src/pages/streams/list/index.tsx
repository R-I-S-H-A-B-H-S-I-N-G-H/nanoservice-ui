import { createStream, getStreamList } from "@/api/streamsApi";
import DialogComp from "@/components/custom/dilogComp";
import { TableComp } from "@/components/custom/tableComp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { CreateStreamPayload, Stream } from "@/types/stream";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function StreamsList() {
    const { userid, orgid } = useParams();
    const navigate = useNavigate()
    const [streamList, setStreamList] = useState<Stream[]>([]);
    const [streamPayload, setStreamPayload] = useState<CreateStreamPayload>({
        title :"",
        description:"",
        mediaSource:""
    })

    useEffect(() => {
        updateStreamList();
    }, [])
    
    async function updateStreamList() {
        const res = await getStreamList(orgid, userid);
        setStreamList(res)
        console.log(res);
    }

    async function createStreamHandler() {
        await createStream(orgid, userid, streamPayload)
        updateStreamList()
    }

    return (
        <div className="space-y-6 p-6">
            <Card>
                <CardHeader>
					<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
						<CardTitle>Streams</CardTitle>
						<DialogComp title="Create Stream" onSubmit={createStreamHandler}>
							<Input placeholder="Stream Name" value={streamPayload.title} onChange={(e) => setStreamPayload({ ...streamPayload, title: e.target.value })} />
							<Input placeholder="Stream Description" value={streamPayload.description} onChange={(e) => setStreamPayload({ ...streamPayload, description: e.target.value })} />
							<Input placeholder="Media Source" value={streamPayload.mediaSource} onChange={(e) => setStreamPayload({ ...streamPayload, mediaSource: e.target.value })} />

						</DialogComp>
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
                            navigate(`/watch/${stream.shortId}`);
                        }}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
