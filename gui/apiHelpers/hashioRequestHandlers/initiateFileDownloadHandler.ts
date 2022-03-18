import { GetSignedUrlConfig } from '@google-cloud/storage';
import { isEqualTo, isNumber, isSha1Hash, Sha1Hash, _validateObject } from '../../src/commonInterface/kacheryTypes';
import { InitiateFileDownloadRequest, InitiateFileDownloadResponse } from '../../src/hashioInterface/HashioRequest';
import { isFileDoc } from './finalizeFileUploadHandler';
import { firestore, storage, tokenBucketManager } from './globals';
import ResourceBusyError from './ResourceBusyError';

export type DownloadEvent = {
    type: 'download'
    sha1: Sha1Hash
    size: number
    timestamp: number
}

export const isDownloadEvent = (x: any) => {
    return _validateObject(x, {
        type: isEqualTo('download'),
        sha1: isSha1Hash,
        size: isNumber,
        timestamp: isNumber
    })
}

const initiateFileDownloadHandler = async (request: InitiateFileDownloadRequest): Promise<InitiateFileDownloadResponse> => {
    const {sha1} = request

    // we don't know the size of the download, but let's first check if there's anything available at all
    if (!tokenBucketManager.canDownload(1)) {
        throw new ResourceBusyError('Exceeded max downloads')
    }

    const bucketName = 'hashio'
    const s = sha1
    const fileName = `sha1/${s[0]}${s[1]}/${s[2]}${s[3]}/${s[4]}${s[5]}/${s}`

    const collectionRef = firestore.collection('files')
    const docRef = collectionRef.doc(sha1.toString())
    const docSnapshot = await docRef.get()
    let found = docSnapshot.exists
    if (!found) {
        return {
            type: 'initiateFileDownload',
            downloadUrl: undefined
        }
    }
    const docData = docSnapshot.data()
    if (!isFileDoc(docData)) {
        console.warn(docData)
        throw Error('Invalid file doc')
    }
    const size = docData.size

    const okay = tokenBucketManager.canDownload(size)
    if (!okay) {
        throw new ResourceBusyError('Exceeded max downloads')
    }
    tokenBucketManager.reportDownload(size)
    const downloadEvent: DownloadEvent = {
        type: 'download',
        sha1,
        size,
        timestamp: Date.now()
    }
    await firestore.collection('events').add(downloadEvent)

    const downloadUrl = await generateV4DownloadSignedUrl(bucketName, fileName)
    return {
        type: 'initiateFileDownload',
        downloadUrl
    }
}

async function generateV4DownloadSignedUrl(bucketName: string, fileName: string) {
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