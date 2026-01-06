import axios from "axios"
import { conf } from "../../config"
import { getTokenFromLocalStorage } from "@/utils/jwtUtil"

export async function login(email: string, password: string) {
    const url = `${conf.BASE_URL}/account/auth/login`
    const res = await axios.post(url, {
        email: email,
        password: password
    })
    return res.data.data
}

export async function self(userId?: string) {
    const url = `${conf.BASE_URL}/account/auth/self?userId=${userId}`
    const res = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        }
    })
    return res.data.data
}

// account/auth/self?userId=KfYROCq9