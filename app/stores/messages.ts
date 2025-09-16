export const useMessagesStore = defineStore('messages', () => {
    const queue = ref([])

    const add = (message: string) => {
        queue.value.push(message)
    }
    
    return {queue, add}
})