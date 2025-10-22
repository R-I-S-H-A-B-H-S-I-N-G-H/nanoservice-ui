import axios from "axios"
import { conf } from "../../config"

export async function ping() {
    const url = `${conf.BASE_URL}/ping`
    const res = await axios.get(url)
    return res.data
}