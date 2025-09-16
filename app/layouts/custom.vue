<script setup>
    const messages = useMessagesStore()

    const auth = useCookie('auth').value

    
    if(!auth) {
        navigateTo('/login')
    }
</script>

<template>
    <v-layout class="rounded rounded-md border">
        
        <navigation-drawer :user="auth?.user"></navigation-drawer>

        <v-app-bar title="Application bar">
            <template v-slot:prepend>
                <v-app-bar-nav-icon></v-app-bar-nav-icon>
            </template>
            <template v-slot:append>
                <v-btn icon>
                    <v-icon>mdi-magnify</v-icon>
                </v-btn>
                <v-btn icon>
                    <v-icon>mdi-heart</v-icon>
                </v-btn>
                <v-btn icon="mdi-dots-vertical"></v-btn>
            </template>
        </v-app-bar>

        <v-main class="d-flex align-center justify-center">
            <v-container>
                    <slot></slot>
            </v-container>
        </v-main>
        <!-- 消息提示 -->
        <v-snackbar-queue v-model="messages.queue" timeout="2000" location="right bottom" color="error" />
    </v-layout>
</template>