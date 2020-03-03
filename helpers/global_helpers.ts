function makeHash(length: number = 10, justNumbers = false) {
  let text = ''
  const chars =
    justNumbers ? '0123456789' :
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return text
}

export {makeHash}
