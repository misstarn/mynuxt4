export const useHello = (msg: string) => {
    const nuxtApp = useNuxtApp()
    return nuxtApp.$hello(msg)
}