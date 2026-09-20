import { api } from '../helpers/api.js'
import 'dotenv/config'

let adminToken = null
const userTokens = new Map()

export async function getAdminToken(){    
    if (!adminToken) {
        const loginResposta = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: process.env.ADMIN_USER,
                senha: process.env.ADMIN_PASSWORD
            })
            adminToken = loginResposta.body.token
    }
    return `Bearer ${adminToken}`
}

export async function getUserToken({ email, senha }){
    const cacheKey = `${email}:${senha}`
    if (!userTokens.has(cacheKey)) {
        const loginResposta = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: email,
                senha: senha
            })
                userTokens.set(cacheKey, loginResposta.body.token)
    }
            return `Bearer ${userTokens.get(cacheKey)}`
}