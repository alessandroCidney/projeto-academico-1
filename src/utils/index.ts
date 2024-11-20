export function wait (timeInMs: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, timeInMs)
  })
}

export function waitFor (conditionFn: (...params: unknown[]) => boolean) {
  return new Promise<void>((resolve) => {
    if (conditionFn()) {
      resolve()
    } else {
      setTimeout(async () => {
        await waitFor(conditionFn)
        resolve()
      }, 100)
    }
  })
}

export const defaultAllowedImageExtensions = '.png, .jpg, .jpeg'

export function selectFile (callbackFn: (file: File) => void, accept = defaultAllowedImageExtensions) {
  const input: HTMLInputElement = document.createElement('input')

  input.type = 'file'
  input.style.display = 'none'
  input.accept = accept

  input.addEventListener('input', () => {
    if (input.files?.[0]) {
      callbackFn(input.files[0])
    }
  })

  document.body.appendChild(input)

  input.click()
}

export function convertFileToBase64 (file: File): Promise<string> {
  const reader = new FileReader()

  return new Promise<string>((resolve) => {
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      }
    })

    reader.readAsDataURL(file)
  })
}

export async function copyToClipboard (text: string) {
  function fallbackCopyTextToClipboard () {
    const textArea = document.createElement('textarea')
    textArea.value = text

    // Avoid scrolling to bottom
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.position = 'fixed'

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    let errorDuringCopy: unknown = null

    try {
      const successful = document.execCommand('copy')

      if (!successful) {
        errorDuringCopy = new Error('Error during copy')
      }
    } catch (err) {
      errorDuringCopy = err
    }

    document.body.removeChild(textArea)

    if (errorDuringCopy) {
      throw errorDuringCopy
    }
  }

  if (!navigator.clipboard) {
    return fallbackCopyTextToClipboard()
  }

  await navigator.clipboard.writeText(text)
}
