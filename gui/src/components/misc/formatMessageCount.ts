const formatMessageCount = (a: number) => {
    if (a < 10000) {
        return `${a}`
    }
    else if (a < 100 * 1000) {
        return `${formatNum(a / 1000)} thousand`
    }
    else if (a < 100 * 1000 * 1000) {
        return `${formatNum(a / (1000 * 1000))} million`
    }
    else if (a < 100 * 1000 * 1000 * 1000) {
        return `${formatNum(a / (1000 * 1000 * 1000))} billion`
    }
    else {
        return `${formatNum(a / (1000 * 1000 * 1000))} billion`
    }
}

const formatNum = (a: number) => {
    const b = a.toFixed(1)
    if (Number(b) - Math.floor(Number(b)) === 0) {
        return a.toFixed(0)
    }
    else return b
}

export default formatMessageCount