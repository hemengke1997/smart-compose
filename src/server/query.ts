import ky from 'ky'

function localSmartComposeApi(text: string) {
  return ky
    .post('http://localhost:8000/api/smartCompose', {
      json: {
        text,
      },
    })
    .json<{
      completion: string
      text: string
    }>()
}

function generateRandomString(minLength: number = 4, maxLength: number = 8): string {
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('')
}

function mockSmartComposeApi(text: string) {
  return Promise.resolve({
    completion: generateRandomString(),
    text,
  })
}

export function smartComposeApi(text: string) {
  return import.meta.env.PROD ? mockSmartComposeApi(text) : localSmartComposeApi(text)
}
