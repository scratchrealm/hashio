import { InitiateFileDownloadRequest, InitiateFileDownloadResponse } from '../../src/hashioInterface/HashioRequest';
import { GetSignedUrlConfig, Storage } from '@google-cloud/storage'
import { Firestore } from '@google-cloud/firestore'
import credentialsObj from './credentialsObj';

const storage = new Storage(credentialsObj)
const firestore = new Firestore(credentialsObj)

const initiateFileDownloadHandler = async (request: InitiateFileDownloadRequest): Promise<InitiateFileDownloadResponse> => {
    const {sha1} = request

    const bucketName = 'hashio'
    const s = sha1
    const fileName = `sha1/${s[0]}${s[1]}/${s[2]}${s[3]}/${s[4]}${s[5]}/${s}`

    const collectionRef = firestore.collection('files')
    const docRef = collectionRef.doc(sha1.toString())
    const docSnapshot = await docRef.get()
    let found = docSnapshot.exists
    const downloadUrl = found ? await generateV4DownloadSignedUrl(bucketName, fileName) : undefined
    found && await docRef.update({timestampLastAccessed: Date.now()})
    return {
        type: 'initiateFileDownload',
        downloadUrl
    }
}

async function generateV4DownloadSignedUrl(bucketName, fileName) {
    // These options will allow temporary download access to the file
    const options: GetSignedUrlConfig = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000 // 15 minutes
    }

    // Get a v4 signed URL for download the file
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

export default initiateFileDownloadHandler