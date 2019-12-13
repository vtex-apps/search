export function removeBaseUrl(url: string) {
  const baseUrlPattern = /^https?:\/\/[a-z\:0-9.]+/;

  const match = baseUrlPattern.exec(url);

  if (match) {
    return url.replace(match[0], "");
  }

  return url;
}
