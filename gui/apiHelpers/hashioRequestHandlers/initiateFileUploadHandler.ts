import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import { InitiateFileUploadRequest, InitiateFileUploadResponse } from '../../src/hashioInterface/HashioRequest';
import credentialsObj from './credentialsObj';

const storage = new Storage(credentialsObj)

const MAX_FILE_SIZE = 30 * 1000 * 1000

const initiateFileUploadHandler = async (request: InitiateFileUploadRequest): Promise<InitiateFileUploadResponse> => {
    const {size} = request

    if (size > MAX_FILE_SIZE) {
        throw Error(`Invalid size: ${size} > ${MAX_FILE_SIZE}`)
    }

    const bucketName = 'hashio'
    const fileName = `temporaryUploads/${randomAlphaString(10)}.${size}`

    const uploadUrl = await generateV4UploadSignedUrl(bucketName, fileName)
    return {
        type: 'initiateFileUpload',
        uploadUrl,
        fileName
    }
}

async function generateV4UploadSignedUrl(bucketName, fileName) {
    // These options will allow temporary upload access to the file
    const options: GetSignedUrlConfig = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        contentType: 'application/octet-stream'
    }

    // Get a v4 signed URL for uploading the file
    const bucket = storage.bucket(bucketName)
    const file = bucket.file(fileName)
    try {
        const [url] = await file.getSignedUrl(options)
        return url
    }
    catch (err) {
        // this way we can see the error in the logs (e.g., a permission error)
        console.error(err)
    }
}

const randomAlphaString = (num_chars: number) => {
    if (!num_chars) {
        /* istanbul ignore next */
        throw Error('randomAlphaString: num_chars needs to be a positive integer.')
    }
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < num_chars; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

export default initiateFileUploadHandler