<script setup>
    const messages = useMessagesStore()
    definePageMeta({
        middleware: [
            function(to, from) {
                console.log(to)
            },
            // 'auth'
        ],
        title: 'Login'
    })
    const title = 'Login'
    const user = reactive({
        email: '',
        password: ''
    })
    const visible = ref(false)

    const authStore = useAuthStore()

    const login =  async() => {
        const res = await authStore.login(user)
        console.log(res)
        if(res) {
            console.log('login success', res)
            navigateTo('/admin/media')
        } else {
            console.log('login failed')
        }
    }
</script>
<template>
    <div>
        <Head>
            <Title>{{ title }}</Title>
            <Meta name="description" :content="title + ' page'"></Meta>
        </Head>
        <div>
           <v-img class="mx-auto my-6" max-width="228" src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"></v-img> 
           <v-card class="mx-auto px-12 py-8 rounded-lg max-w-[448px]" elevation="8">
               <div class="text-lg  font-bold">Account</div>
               <v-text-field 
                    v-model="user.email"
                    class="mt-2" 
                    type="text" 
                    density="compact" 
                    variant="solo" 
                    prepend-inner-icon="mdi-email-outline" 
                    placeholder="Email address"
                ></v-text-field>
               <div class="text-lg font-bold flex items-center justify-between">
                    <div>Password</div>
                    <a href="#" rel="noopener noreferrer" target="_blank" class="font-[100] text-sm">Forgot login password?</a>
               </div>
               <v-text-field
                    v-model="user.password"
                    class="mt-2"
                    :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="visible ? 'text' : 'password'"
                    density="compact"
                    placeholder="Enter your password"
                    prepend-inner-icon="mdi-lock-outline"
                    variant="solo"
                    @click:append-inner="visible = !visible"
               ></v-text-field>

               <v-card class="mb-12" color="surface-variant" variant="tonal">
                    <v-card-text class="text-medium-emphasis text-caption">
                        Warning: After 3 consecutive failed login attempts, you account will be temporarily locked for three hours. If you must login now, you can also click "Forgot login password?" below to reset the login password.
                    </v-card-text>
               </v-card>

               <v-btn class="mb-8" color="blue" size="large" variant="tonal" @click="login" block>Log In</v-btn>

               <v-card-text class="text-center">
                <NuxtLink to="/register" target="_blank" rel="noopener noreferrer" class="text-blue text-decoration-none">
                    Sign up now <v-cion icon="mdi-chevron-right"></v-cion>
                </NuxtLink>
               </v-card-text>
           </v-card>
        </div>
         <v-snackbar-queue v-model="messages.queue" timeout="2000" location="right bottom" color="error" />
    </div>
</template>