export function useWebSocket(url: string) {
    const socket = ref<WebSocket | null>(null)
    const status = ref<'CONNECTING' | 'OPEN' | 'CLOSED'>('CLOSED')
    const listeners: ((data: any) => void)[] = []

    const connect = () => {
        socket.value = new WebSocket(url)
        status.value = 'CONNECTING'

        socket.value.onopen = () => {
            status.value = 'OPEN'
            console.log('WebSocket 连接成功')
        }

        socket.value.onmessage = (e) => {
            try {
                const msg = JSON.parse(e.data)
                listeners.forEach(fn => fn(msg))
            } catch(error) {
                console.warn('WebSocket 解析失败', e.data)
            }
        }

        socket.value.onclose = () => {
            status.value = 'CLOSED'
            console.log('WebSocket 已断开')
        }

        socket.value.onerror = (err) => {
            console.log('WebSocket 出错', err)
        }
    }

    const sendMessage = (msg: any) => {
        if(socket.value?.readyState == WebSocket.OPEN) {
            socket.value.send(JSON.stringify(msg))
        } else {
            console.warn('WebSocket 连接未建立，消息未发送')
        }
    }

    const close = () => {
        socket.value?.close()
    }

    const onMessage = (fn: (data: any) => void) => {
        listeners.push(fn)
    }

    connect()
    onUnmounted(() => close())

    return {
        status,
        sendMessage,
        close,
        onMessage
    }
}