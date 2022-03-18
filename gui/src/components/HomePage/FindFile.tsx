import axios from 'axios';
import React, { FunctionComponent, useCallback, useState } from 'react';

type Props = {

}

const FindFile: FunctionComponent<Props> = () => {
    const [sha1, setSha1] = useState<string>('')
    const [downloadUrl, setDownloadUrl] = useState<string | undefined>(undefined)
    const [sha1ForDownloadUrl, setSha1ForDownloadUrl] = useState<string>('')

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
        setSha1(e.target.value as string)
    }, [])

    const handleFind = useCallback(() => {
        ;(async () => {
            setDownloadUrl('')
            setSha1ForDownloadUrl('')
            const resp = await axios.get(`/api/hashio?type=initiateFileDownload&sha1=${sha1}`)
            setDownloadUrl(resp.data['downloadUrl'])
            setSha1ForDownloadUrl(sha1)
        })()
    }, [sha1])

    const findEnabled = (sha1.length === 40) && (!(downloadUrl && (sha1 === sha1ForDownloadUrl)))

    return (
        <div>
            <div>
                SHA-1: <input style={{width: 300}} type="text" value={sha1} onChange={handleChange} />
                <button onClick={handleFind} disabled={!findEnabled}>Find</button>
            </div>
            {
                (sha1) && (sha1ForDownloadUrl === sha1) ? (
                    downloadUrl ? (
                        <div>
                            <p>
                                <a href={downloadUrl} target="_blank" rel="noreferrer">sha1://{sha1}</a>
                            </p>
                        </div>
                    ) : (
                        <span>Not found</span>
                    )
                ) : <span />
            }
        </div>
    )
}

export default FindFile