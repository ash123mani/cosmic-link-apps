let _sharedUrl: string | null = null;

export function setSharedUrl(url: string | null) {
  _sharedUrl = url;
}

export function getSharedUrl(): string | null {
  const url = _sharedUrl;
  _sharedUrl = null;
  return url;
}
