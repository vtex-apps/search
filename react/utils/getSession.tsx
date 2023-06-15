const getSession = async (rootPath?: string) => {
  const headers = new Headers()

  headers.append('Content-Type', 'application/json')

  const requestOptions: RequestInit = {
    method: 'GET',
    headers,
    redirect: 'follow',
  }

  const session = await fetch(
    `${rootPath || ''}/api/sessions?items=public.shippingOption`,
    requestOptions
  )

  const data = await session.json()

  if (!data?.namespaces?.public?.shippingOption?.value) {
    return null
  }

  return JSON.parse(data.namespaces.public.shippingOption.value)
}

export default getSession
