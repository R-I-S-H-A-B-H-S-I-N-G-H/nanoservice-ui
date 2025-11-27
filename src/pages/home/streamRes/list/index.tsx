import { getStreamResList } from '@/api/streamsApi';
import { TableComp } from '@/components/custom/tableComp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StreamRes } from '@/types/stream';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';

export default function StreamResList() {
    const { userid, orgid, streamid } = useParams();
    const [streamResList, setStreamResList] = useState([])
    const navigate = useNavigate()

    useEffect(() => { 
        updateStreamRes()
    }, [])
    
    async function updateStreamRes() {
        const res = await getStreamResList(orgid, userid, streamid);
        setStreamResList(res)
    }

    return (
        <div className="space-y-6 p-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <CardTitle>Stream Res</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <TableComp
                        columns={[
                            { header: "Resolution", accessor: "res"},
                            { header: "ID", accessor: "id" },
                            { header: "Created At", accessor: "created_at" },
                            { header: "Updated At", accessor: "updated_at" },
                            { header: "Stream", accessor: "stream_id" },
                        ]}
                        data={streamResList}
                        onRowClick={(stream: StreamRes) => {
                            navigate(`${stream?.id}`, { relative: "path" });
                        }}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
