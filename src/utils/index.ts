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
