import { VercelRequest, VercelResponse } from '@vercel/node'
import finalizeFileUploadHandler from '../apiHelpers/hashioRequestHandlers/finalizeFileUploadHandler'
import initiateFileDownloadHandler from '../apiHelpers/hashioRequestHandlers/initiateFileDownloadHandler'
import initiateFileUploadHandler from '../apiHelpers/hashioRequestHandlers/initiateFileUploadHandler'
import { isHashioRequest } from '../src/hashioInterface/HashioRequest'

module.exports = (req: VercelRequest, res: VercelResponse) => {    
    let {body: request, query} = req
    if (!request) {
        request = query
        if (request.size) {
            request.size = parseInt(request.size)
        }
    }

    if (!isHashioRequest(request)) {
        console.warn('Not a valid hashio request', request.type)
        res.status(400).send(`Invalid hashio request: ${JSON.stringify(request)}`)
        return
    }

    ;(async () => {
        if (request.type === 'initiateFileDownload') {
            return await initiateFileDownloadHandler(request)
        }
        else if (request.type === 'initiateFileUpload') {
            return await initiateFileUploadHandler(request)
        }
        else if (request.type === 'finalizeFileUpload') {
            return await finalizeFileUploadHandler(request)
        }
        else {
            throw Error(`Unexpected hashio request type: ${request.type}`)
        }
    })().then((result) => {
        res.json(result)
    }).catch((error: Error) => {
        console.warn(error.message)
        res.status(404).send(`Error: ${error.message}`)
    })
}