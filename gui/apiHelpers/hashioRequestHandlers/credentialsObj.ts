const GOOGLE_CREDENTIALS = process.env.GOOGLE_CREDENTIALS
if (!GOOGLE_CREDENTIALS) {
    throw Error('Environment variable not set: GOOGLE_CREDENTIALS')
}
const googleCredentials = JSON.parse(GOOGLE_CREDENTIALS)
const credentialsObj = {
    projectId: googleCredentials.project_id,
    credentials: {
        client_email: googleCredentials.client_email,
        private_key: googleCredentials.private_key
    }
}

export default credentialsObj