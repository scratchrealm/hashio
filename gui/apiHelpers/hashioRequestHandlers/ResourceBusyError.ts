class ResourceBusyError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ResourceBusy'
    }
}

export default ResourceBusyError