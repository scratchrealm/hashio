import { isBoolean, isEqualTo, isNumber, isOneOf, isSha1Hash, isString, optional, Sha1Hash, _validateObject } from "../commonInterface/kacheryTypes"

//////////////////////////////////////////////////////////////////////////////////
// initiateFileDownload

export type InitiateFileDownloadRequest = {
    type: 'initiateFileDownload',
    sha1: Sha1Hash
}


export const isInitiateFileDownloadRequest = (x: any): x is InitiateFileDownloadRequest => {
    return _validateObject(x, {
        type: isEqualTo('initiateFileDownload'),
        sha1: isSha1Hash
    })
}

export type InitiateFileDownloadResponse = {
    type: 'initiateFileDownload'
    downloadUrl?: string
}

export const isInitiateFileDownloadResponse = (x: any): x is InitiateFileDownloadResponse => {
    return _validateObject(x, {
        type: isEqualTo('initiateFileDownload'),
        downloadUrl: optional(isString)
    })
}

//////////////////////////////////////////////////////////////////////////////////
// initiateFileUpload

export type InitiateFileUploadRequest = {
    type: 'initiateFileUpload',
    size: number
}

export const isInitiateFileUploadRequest = (x: any): x is InitiateFileUploadRequest => {
    return _validateObject(x, {
        type: isEqualTo('initiateFileUpload'),
        size: isNumber
    })
}

export type InitiateFileUploadResponse = {
    type: 'initiateFileUpload'
    uploadUrl: string
    fileName: string
}

export const isInitiateFileUploadResponse = (x: any): x is InitiateFileUploadResponse => {
    return _validateObject(x, {
        type: isEqualTo('initiateFileUpload'),
        uploadUrl: isString,
        fileName: isString
    })
}

//////////////////////////////////////////////////////////////////////////////////
// finalizeFileUpload

export type FinalizeFileUploadRequest = {
    type: 'finalizeFileUpload',
    fileName: string
}

export const isFinalizeFileUploadRequest = (x: any): x is FinalizeFileUploadRequest => {
    return _validateObject(x, {
        type: isEqualTo('finalizeFileUpload'),
        fileName: isString
    })
}

export type FinalizeFileUploadResponse = {
    type: 'finalizeFileUpload'
    sha1: Sha1Hash
    alreadyExists: boolean
}

export const isFinalizeFileUploadResponse = (x: any): x is FinalizeFileUploadResponse => {
    return _validateObject(x, {
        type: isEqualTo('finalizeFileUpload'),
        sha1: isSha1Hash,
        alreadyExists: isBoolean
    })
}

//////////////////////////////////////////////////////////////////////////////////

export type HashioRequest =
    InitiateFileDownloadRequest |
    InitiateFileUploadRequest |
    FinalizeFileUploadRequest

export const isHashioRequest = (x: any): x is HashioRequest => {
    return isOneOf([
        isInitiateFileDownloadRequest,
        isInitiateFileUploadRequest,
        isFinalizeFileUploadRequest
    ])(x)
}

export type HashioResponse =
    InitiateFileDownloadResponse |
    InitiateFileUploadResponse |
    FinalizeFileUploadResponse

export const isHashioResponse = (x: any): x is HashioResponse => {
    return isOneOf([
        isInitiateFileDownloadResponse,
        isInitiateFileUploadResponse,
        isFinalizeFileUploadResponse
    ])(x)
}