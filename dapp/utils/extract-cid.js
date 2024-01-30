const extractCidV0 = (input) => {
  const cidRegex = /Qm[a-z0-9]{44,}/i
  const match = input.match(cidRegex)
  return match ? match[0] : undefined
}

const extractCidV1 = (input) => {
  const cidRegex = /bafy[a-z0-9]{44,}/i
  const match = input.match(cidRegex)

  return match ? match[0] : undefined
}

export { extractCidV0, extractCidV1 }
