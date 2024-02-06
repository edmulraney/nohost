const getDappId = (hostname) => {
  const parts = hostname.split(".")
  const hasLocalhostSubdomain = parts[1] && parts[1] === "localhost"
  const hasSubdomain = parts.length > 3
  if (hasLocalhostSubdomain || hasSubdomain) return parts[0]

  return undefined
}

const createDappIdFromLocation = (location) => {
  return location
    .split("://")[1]
    ?.toLowerCase()
    ?.replace(/[^a-z]+/g, "-")
}

export { getDappId, createDappIdFromLocation }
