const opts = {
    numDownloadsPerMinute: 40,
    downloadBytesPerMinute: 1000 * 1000 * 1000,
    numUploadsPerMinute: 40,
    uploadBytesPerMinute: 1000 * 1000 * 1000
}

class TokenBucketManager {
    numDownloadsAvailable = 0
    downloadBytesAvailable = 0
    numUploadsAvailable = 0
    uploadBytesAvailable = 0
    lastReplenish = 0

    constructor() {
        this.update()
    }

    update() {
        const elapsedSinceReplenish = Date.now() - this.lastReplenish
        if (elapsedSinceReplenish >= 1000 * 60) {
            this.numDownloadsAvailable = opts.numDownloadsPerMinute
            this.downloadBytesAvailable = opts.downloadBytesPerMinute
            this.numUploadsAvailable = opts.numUploadsPerMinute
            this.uploadBytesAvailable = opts.uploadBytesPerMinute
            this.lastReplenish = Date.now()
        }
    }
    canDownload(size: number) {
        this.update()
        if (this.numDownloadsAvailable -1 < 0) return false
        if (this.downloadBytesAvailable - size < 0) return false
        return true
    }
    reportDownload(size: number) {
        this.update()
        this.numDownloadsAvailable -= 1
        this.downloadBytesAvailable -= size
        return true
    }
    canUpload(size: number) {
        this.update()
        if (this.numUploadsAvailable -1 < 0) return false
        if (this.uploadBytesAvailable - size < 0) return false
        return true
    }
    reportUpload(size: number) {
        this.update()
        this.numUploadsAvailable -= 1
        this.uploadBytesAvailable -= size
        return true
    }
}

export default TokenBucketManager