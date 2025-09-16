<script setup>
    import { useUserSotre } from '~/stores/user'
    import { Icon } from '@iconify/vue'
    // import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
    const msgs = ref([])
    const message = ref('')
    const userStore = useUserSotre()
    const username = ref('')

    const { status, sendMessage, close, onMessage } = useWebSocket(`ws://localhost:9920?token=${userStore.token}`)

    onMessage((e) => {
        console.log('ws message', e.message)
        msgs.value.push({
            message: e.message,
            username: e.from
        })
    })
  
    const onSubmit = () => {
        console.log('submit', message.value)
        sendMessage({message: message.value, username: username.value})
        msgs.value.push({
            message: message.value,
            username: userStore.user.username
        })

        message.value = ''
    }
    
    const isActive = ref(false)
    function handleUpadate(value) {
        isActive.value = value
    }

    const mouseOverEl = ref()
    const { onLoaded } = useScriptNpm({
        packageName: 'js-confetti',
        file: 'dist/js-confetti.browser.js',
        version: '0.12.0',
        scriptOptions: {
            trigger: useScriptTriggerElement({ trigger: 'mouseover', el: mouseOverEl }),
            use() {
                return { JSConfetti: window.JSConfetti}
            }
        }
    })

    onMounted(() => {
        onLoaded(({ JSConfetti }) => {
        const confetti = new JSConfetti()

        confetti.addConfetti({
            emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸']
        })
    })
    })
</script>

<template>
    <div>
        <ul v-auto-animate>
            <li v-for="msg in msgs" :key="msg" class="flex flex-col">
                <div class="w-fit border rounded-md p-4" :class="[msg.username == userStore.user.username ? 'bg-green-500 self-end' : 'bg-blue-500 self-start']">
                    {{ msg.message }} - {{ msg.username}}
                </div>
            </li>
        </ul>
       
        <form class="flex flex-col space-y-4 fixed bottom-0 left-0 w-full" @submit.prevent="onSubmit">
            <input v-model="message" type="textarea" class="border p-4" rows="10" cols="50" />
            <button class="border px-4 py-2 rounded-lg self-end w-fit" type="submit">send</button>
        </form>
        <input v-model="username" type="text" placeholder="username" />
        {{ status }}
        
    </div>
    <div ref="mouseOverEl">
        <h1>hover </h1>
    </div>
</template>

<style lang="scss" scoped>

</style>