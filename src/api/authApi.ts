import axios from "axios"
import { conf } from "../../config"

export async function login(email: string, password: string) {
    const url = `${conf.BASE_URL}/auth/login`
    const res = await axios.post(url, {
        email: email,
        password: password
    })
    return res.data.data
}