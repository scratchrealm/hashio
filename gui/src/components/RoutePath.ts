type RoutePath = '/home'
export const isRoutePath = (x: string): x is RoutePath => {
    if (['/home'].includes(x)) return true
    return false
}

export default RoutePath