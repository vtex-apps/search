import axios from 'axios'

const client = axios.create({
  baseURL: 'https://search.biggylabs.com.br/search-api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

const logError = (
  store: string,
  workspace: string,
  attributePath: string,
  error: any
) => {
  const browser =
    typeof navigator !== 'undefined' ? navigator.userAgent : 'server-side-error'

  const message = `Workspace: ${workspace}\nBrowser: ${browser}\nMessage: ${
    error.message
  }\n${error.stack != null ? error.stack : ''}`

  client.post(`/${store}/log`, {
    message,
    url: `Search App Error at: ${attributePath}`,
  })
}

export default logError
