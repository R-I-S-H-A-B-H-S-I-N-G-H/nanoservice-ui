import { use, useEffect } from "react"
import { useParams } from "react-router"
import axios from "axios"

async function getMediaList() {
    const url = "http://localhost:8000/media/list";

    let res = await axios.get(url)
    return res.data;
}



export default function MediaPage() {
    const { userid, orgid } = useParams()
    

    useEffect(() => {
        getMediaList().then(res => { 
            console.log(res);
            console.log('====================================');
        })
    },[])
    
    
    return <><div>OrgId -- { orgid } -- userId -- { userid }</div></>
}