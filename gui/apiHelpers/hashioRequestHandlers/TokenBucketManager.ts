const NUM_DOWNLOADS_PER_MINUTE = parseInt(process.env['NUM_DOWNLOADS_PER_MINUTE'])
const DOWNLOAD_BYTES_PER_MINUTE = parseInt(process.env['DOWNLOAD_BYTES_PER_MINUTE'])
if (!NUM_DOWNLOADS_PER_MINUTE) throw Error('Env variable not set: NUM_DOWNLOADS_PER_MINUTE')
if (!DOWNLOAD_BYTES_PER_MINUTE) throw Error('Env variable not set: DOWNLOAD_BYTES_PER_MINUTE')

class TokenBucketManager {
    downloadsAvailable = NUM_DOWNLOADS_PER_MINUTE
    bytesAvailable = DOWNLOAD_BYTES_PER_MINUTE
    lastReplenish = Date.now()

    update() {
        const elapsedSinceReplenish = Date.now() - this.lastReplenish
        if (elapsedSinceReplenish >= 1000 * 60) {
            this.downloadsAvailable = NUM_DOWNLOADS_PER_MINUTE
            this.bytesAvailable = DOWNLOAD_BYTES_PER_MINUTE
            this.lastReplenish = Date.now()
        }
    }
    reportDownload(size: number) {
        this.update()
        if (this.downloadsAvailable - 1 < 0) return false
        if (this.bytesAvailable - size < 0) return false
        this.downloadsAvailable -= 1
        this.bytesAvailable -= size
        return true
    }
}

export default TokenBucketManager