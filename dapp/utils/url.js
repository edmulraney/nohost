const getDappId = (hostname) => {
  const parts = hostname.split(".")
  const hasLocalhostSubdomain = parts[1] && parts[1] === "localhost"
  const hasSubdomain = parts.length > 2
  if (hasLocalhostSubdomain || hasSubdomain) return parts[0]

  return undefined
}

export {
  getDappId,
}