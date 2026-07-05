// normalizeDomain(url: string) -> string function 
// strip protocol www., path, query string -> bare domain 

export function normalizeDomain(url: string): string {
  try {
    const withProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`
    const { hostname } = new URL(withProtocol)
    return hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    throw new Error(`Invalid URL, cannot derive domain: ${url}`)
  }
}

export function domainToCompanyName(domain: string): string {
  const base = domain.split('.')[0] ?? domain
  return base.charAt(0).toUpperCase() + base.slice(1)
}