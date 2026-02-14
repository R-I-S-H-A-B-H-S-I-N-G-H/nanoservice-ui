import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import {
    Trash2,
    Copy,
    CheckCircle2,
    ShieldAlert,
    AlertOctagon,
} from "lucide-react";

// Shadcn & Custom Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DialogComp from "@/components/custom/dilogComp";
import { TableComp } from "@/components/custom/tableComp";

// Utils
import { conf } from "../../../config";
import { getTokenFromLocalStorage } from "@/utils/jwtUtil";

// --- API Services ---
async function getApiKeyList(userid = "", orgid = "", page = 0, pageSize = 8) {
    const url = `${conf.BASE_URL}/account/apikey/list?orgId=${orgid}&userId=${userid}&page=${page}&pageSize=${pageSize}`;
    const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
    });
    return res.data.data;
}

async function createApiKey(payload: { name: string; description: string }, orgid = "", userid = "") {
    const url = `${conf.BASE_URL}/account/apikey?orgId=${orgid}&userId=${userid}`;
    const res = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
    });
    return res.data.data;
}

async function revokeApiKey(id: string, orgid = "", userid = "") {
    const url = `${conf.BASE_URL}/account/apikey/${id}?orgId=${orgid}&userId=${userid}`;
    const res = await axios.delete(url, {
        headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
    });
    return res.data.data;
}

export default function ApiList() {
    const { userid, orgid } = useParams();

    // States
    const [apiKeys, setApiKeys] = useState<any[]>([]);
    const [listFilters, setListFilters] = useState({ page: 0, totalPages: 1 });
    
    // Key Creation States
    const [newKeyData, setNewKeyData] = useState({ name: "", description: "" });
    const [createdKey, setCreatedKey] = useState<string | null>(null);
    const [showKey, _] = useState(false);
    const [copied, setCopied] = useState(false);

    // Revoke States
    const [revokeId, setRevokeId] = useState<string | null>(null);

    useEffect(() => {
        updateApiList();
    }, [listFilters.page, userid, orgid]);

    async function updateApiList() {
        if (!userid || !orgid) return;
        const res = await getApiKeyList(userid, orgid, listFilters.page);
        setApiKeys(res.items || []);
        setListFilters({
            page: res.pagination.page,
            totalPages: res.pagination.totalPages,
        });
    }

    async function handleCreateKey() {
        if (!newKeyData.name) return;
        try {
            const res = await createApiKey(newKeyData, orgid, userid);
            setCreatedKey(res.apiKey);
        } catch (err) {
            console.error("Failed to create key", err);
        }
    }

    async function handleRevokeConfirm() {
        if (!revokeId || !orgid || !userid) return;
        try {
            await revokeApiKey(revokeId, orgid, userid);
            setRevokeId(null);
            updateApiList();
        } catch (err) {
            console.error("Failed to revoke key", err);
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        // setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6 p-6">
            {/* --- Revoke Confirmation Dialog --- */}
            <AlertDialog open={!!revokeId} onOpenChange={() => setRevokeId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="flex items-center gap-2 text-destructive mb-2">
                            <AlertOctagon className="h-5 w-5" />
                            <AlertDialogTitle>Revoke API Key?</AlertDialogTitle>
                        </div>
                        <AlertDialogDescription>
                            This action cannot be undone. Any applications or scripts using this 
                            key will <span className="font-bold text-foreground">immediately lose access</span> to the API.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleRevokeConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Revoke Access
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold">API Keys</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Manage and revoke access tokens for {orgid}
                            </p>
                        </div>

                        <DialogComp
                            title={createdKey ? "Success! Copy Your Key" : "Generate API Key"}
                            onSubmit={createdKey ? () => {
                                setCreatedKey(null);
                                setNewKeyData({ name: "", description: "" });
                                updateApiList();
                            } : handleCreateKey}
                            submitText={createdKey ? "I have saved my key" : "Generate"}
                        >
                            {/* ... Key Creation Form (Same as your original code) ... */}
                            {!createdKey ? (
                                <div className="space-y-4 pt-2">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider">Key Label</Label>
                                        <Input
                                            placeholder="e.g. Production-Server"
                                            value={newKeyData.name}
                                            onChange={(e) => setNewKeyData({ ...newKeyData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider">Description</Label>
                                        <Input
                                            placeholder="What will this key be used for?"
                                            value={newKeyData.description}
                                            onChange={(e) => setNewKeyData({ ...newKeyData, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 pt-4">
                                    <Alert variant="destructive" className="bg-amber-50 dark:bg-amber-950/20 border-amber-200">
                                        <ShieldAlert className="h-4 w-4 text-amber-600" />
                                        <AlertTitle className="font-bold">Save this key now!</AlertTitle>
                                        <AlertDescription className="text-xs">
                                            For security, we won't show this key again.
                                        </AlertDescription>
                                    </Alert>
                                    <div className="flex gap-2">
                                        <Input 
                                            readOnly 
                                            type={showKey ? "text" : "password"} 
                                            value={createdKey} 
                                            className="font-mono text-sm"
                                        />
                                        <Button onClick={() => copyToClipboard(createdKey)} variant={copied ? "outline" : "default"}>
                                            {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </DialogComp>
                    </div>
                </CardHeader>

                <CardContent>
                    <TableComp
                        columns={[
                            {
                                header: "Key Name",
                                accessor: "name",
                                render: (item) => (
                                    <div className="flex flex-col">
                                        <span className="font-bold">{item.name || "Unnamed"}</span>
                                        <span className="text-[10px] text-muted-foreground truncate max-w-[200px]">{item.description}</span>
                                    </div>
                                ),
                            },
                            {
                                header: "Prefix",
                                accessor: "keyPrefix",
                                render: (item) => (
                                    <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono border">
                                        {item.keyPrefix}...
                                    </code>
                                ),
                            },
                            {
                                header: "Status",
                                accessor: "isActive",
                                render: (item) => (
                                    <Badge variant={item.isActive ? "default" : "secondary"} className={item.isActive ? "bg-green-600/10 text-green-600" : ""}>
                                        {item.isActive ? "Active" : "Revoked"}
                                    </Badge>
                                ),
                            },
                            {
                                header: "Created At",
                                accessor: "createdAt",
                                render: (item) => (
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                ),
                            },
                        ]}
                        data={apiKeys}
                        rowActions={(item) => (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setRevokeId(item.shortId); // Trigger the Alert Dialog
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                        currentPage={listFilters.page + 1}
                        totalPages={listFilters.totalPages}
                        onPageChange={(page) => setListFilters({ ...listFilters, page: page - 1 })}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
