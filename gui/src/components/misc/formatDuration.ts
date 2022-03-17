const hourMsec = 1000 * 60 * 60
const dayMsec = 1000 * 60 * 60 * 24

const formatDuration = (a: number) => {
    if (a < 24 * hourMsec) {
        return `${Math.round(a / hourMsec)} hours`
    }
    else {
        return `${Math.round(a / dayMsec)} days`
    }
}

export default formatDuration