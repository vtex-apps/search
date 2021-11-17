export function hasClass(element: HTMLElement, className: string): boolean {
  if (element == null) {
    return false
  }

  const regex = new RegExp(`(\\s|^)${className}(\\s|$)`)

  return !!(
    typeof element.className === 'string' && element.className.match(regex)
  )
}

export function isDescendant(
  parent: HTMLElement | undefined,
  child: HTMLElement
): boolean {
  if (!parent) {
    return false
  }

  let node = child.parentNode

  while (node != null) {
    if (node === parent) {
      return true
    }

    node = node.parentNode
  }

  return false
}

export function hasSomeParentTheClass(
  element: HTMLElement,
  classname: string
): boolean {
  if (element.className.split(' ').indexOf(classname) >= 0) {
    return true
  }

  return (
    !!element.parentElement &&
    hasSomeParentTheClass(element.parentElement, classname)
  )
}

export function getCookie(name: string): string | null {
  const regex = new RegExp(`(^|;)[ ]*${name}=([^;]*)`)
  const match = regex.exec(document.cookie)

  if (!match) {
    return null
  }

  try {
    return decodeURIComponent(match[2])
  } catch {
    return match[2]
  }
}

export function setCookie(
  key: string,
  value: string,
  ttl?: number,
  path = '/'
) {
  let expires = ''

  if (ttl && ttl > 0) {
    const expirationDate = new Date()

    expirationDate.setTime(new Date().getTime() + ttl)
    expires = `expires=${expirationDate.toUTCString()};`
  }

  document.cookie = `${key}=${encodeURIComponent(value)};${expires}path=${path}`
}
