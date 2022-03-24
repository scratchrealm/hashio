import { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

const MAX_UPLOAD_SIZE = 50 * 1000 * 1000

module.exports = (req: VercelRequest, res: VercelResponse) => {
    const url = 'https://api.web3.storage/upload'
    const token = process.env['WEB3_STORAGE_TOKEN']
    if (!token) {
        throw Error('Environment variable not set: WEB3_STORAGE_TOKEN')
    }
    const headers = {
        'Authorization': `Bearer ${token}`
    }
    const contentLength = parseInt(req.headers['content-length'])
    if (contentLength > MAX_UPLOAD_SIZE) {
        res.status(413).send(`File too large: ${contentLength} > ${MAX_UPLOAD_SIZE}`)
        return
    }
    ;(async () => {
        const resp = await axios.post(url, req, {headers})
        if (resp.status !== 200) {
            res.status(resp.status).send(resp.data)
            return
        }
        const cid = resp.data['cid']
        res.json({cid})
    })()
}