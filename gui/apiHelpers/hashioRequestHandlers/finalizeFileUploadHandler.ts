import crypto from 'crypto';
import internal from 'stream';
import { isNumber, isSha1Hash, Sha1Hash, _validateObject } from '../../src/commonInterface/kacheryTypes';
import { FinalizeFileUploadRequest, FinalizeFileUploadResponse } from '../../src/hashioInterface/HashioRequest';
import { firestore, storage } from './globals';

export type FileDoc = {
    sha1: Sha1Hash
    size: number
    timestampCreated: number
    timestampLastAccessed: number
}

export const isFileDoc = (x: any): x is FileDoc => {
    return _validateObject(x, {
        sha1: isSha1Hash,
        size: isNumber,
        timestampCreated: isNumber,
        timestampLastAccessed: isNumber
    })
}

const finalizeFileUploadHandler = async (request: FinalizeFileUploadRequest): Promise<FinalizeFileUploadResponse> => {
    const {fileName} = request

    if (!fileName.startsWith('temporaryUploads/')) {
        throw Error(`Invalid fileName: ${fileName}`)
    }

    const bucketName = 'hashio'

    const bucket = storage.bucket(bucketName)
    const file = bucket.file(fileName)
    const [metadata] = await file.getMetadata()
    const size = parseInt(metadata.size)
    const readStream = file.createReadStream()
    const sha1 = await computeSha1FromReadStream(readStream)
    const s = sha1
    const collectionRef = firestore.collection('files')
    const docRef = collectionRef.doc(sha1.toString())
    const docSnapshot = await docRef.get()
    const alreadyExists = docSnapshot.exists
    if (alreadyExists) {
        await file.delete()
        docRef.update({timestampLastAccessed: Date.now()})
    }
    else {
        const destFname = `sha1/${s[0]}${s[1]}/${s[2]}${s[3]}/${s[4]}${s[5]}/${s}`
        const destFile = bucket.file(destFname)
        const [destFileAlreadyExists] = await destFile.exists()
        if (destFileAlreadyExists) {
            // this shouldn't happen, let's delete it
            await destFile.delete()
        }
        await file.move(destFname)
        const fileDoc: FileDoc = {
            sha1,
            size,
            timestampCreated: Date.now(),
            timestampLastAccessed: Date.now()
        }
        if (!isFileDoc(fileDoc)) {
            console.warn(fileDoc)
            throw Error('Invalid file doc')
        }
        await docRef.set(fileDoc)
    }
    return {
        type: 'finalizeFileUpload',
        sha1,
        alreadyExists
    }
}

const computeSha1FromReadStream = async (readStream: internal.Readable): Promise<Sha1Hash> => {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha1')
        readStream.on('end', () => {
            hash.end()
            const sha1 = hash.digest('hex')
            resolve(sha1 as any as Sha1Hash)
        })
        readStream.pipe(hash)
    })
}

export default finalizeFileUploadHandler