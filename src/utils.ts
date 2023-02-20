export const isMobile = () => window.innerWidth <= 992

// TODO: fix type element
export const runCallbackOnScroll = (element: Window, callback: (e: WheelEvent) => void) => {
  let handle: ReturnType<typeof setTimeout> | null = null
  const onScroll = (e: WheelEvent) => {
    if (handle) clearTimeout(handle)

    handle = setTimeout(() => {
      callback(e)
    }, 1000)
  }
  element.addEventListener('wheel', onScroll)
}
