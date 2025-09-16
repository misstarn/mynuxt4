<script setup>
const open = ref(['Admin'])

const props = defineProps(['user'])

console.log(props.user, 'authhhhhhhhhhhhhhhh')
const user = props.user

onMounted(() => {
    console.log(user)
})


const admins = [
    ['Users', 'mdi-account-multiple-outline', '/admin/users'],
    ['Admin-Users', 'mdi-account-multiple-outline', '/admin/admin-users'],
    ['Settings', 'mdi-cog-outline', '/admin/account-settings/account'],
]

const fav = ref(true)
const menu = ref(false)
const message = ref(false)
const hints = ref(true)
</script>
<template>
    <div>
        <v-navigation-drawer class="pb-[60px]!">
            <v-sheet class="position-sticky top-0 z-2" color="white">
                <v-list v-model:opened="open" nav>
                    <v-list-item title="My Application" subtitle="Vuetify"></v-list-item>
                </v-list>
            </v-sheet>
            <v-list class="z-1" v-model:opened="open" nav>
                <v-list-item title="Navigation drawer" prepend-icon="mdi-home"></v-list-item>
                <v-list-item prepend-icon="mdi-account-circle" title="Media Library" to="/admin/media"
                    link></v-list-item>
                <v-list-group value="Admin">
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" title="Admin" prepend-icon="mdi-account-circle"></v-list-item>
                    </template>
                    <v-list-item v-for="([title, icon, url], i) in admins" :key="title" :prepend-icon="icon" :to="url"
                        :title="title" :value="title"></v-list-item>
                </v-list-group>
                <v-list-group value="Actions">
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" title="Actions" prepend-icon="mdi-account-circle"></v-list-item>
                    </template>
                    <v-list-item v-for="([title, icon], i) in cruds" :key="title" :prepend-icon="icon" :to="url"
                        :title="title" :value="title"></v-list-item>
                </v-list-group>
            </v-list>
            <v-menu v-model="menu" :close-on-content-click="false" location="top">
                <template v-slot:activator="{ props }">
                    <v-card class="absolute! bottom-0 left-0 w-full z-2!">
                        <v-list>
                            <v-list-item v-bind="props" :title="user?.username"
                                prepend-avatar="https://picsum.photos/300/300" :subtitle="user?.email"></v-list-item>
                        </v-list>
                    </v-card>
                </template>

                <v-card min-width="250">
                    <v-list nav>
                        <v-list-subheader class="text-lg!">{{ user?.email }}</v-list-subheader>
                        <v-list-item rounded="lg" title="设置" prepend-icon="mdi-cog-outline" link></v-list-item>
                        <v-list-item rounded="lg" title="个人信息" prepend-icon="mdi-account-circle" link></v-list-item>
                    </v-list>

                    <v-divider class="border-opacity-25"></v-divider>

                    <v-list nav>
                        <v-list-item rounded="lg" title="注销" prepend-icon="mdi-logout" link></v-list-item>
                    </v-list>
                </v-card>
            </v-menu>
        </v-navigation-drawer>
    </div>
</template>

<style lang="scss" scoped>

@use '../assets/css/settings.scss';


:deep(.v-navigation-drawer) {
    background-color: settings.$theme-color;
}

:deep(.v-list-item) {
    border-radius: 0;
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
    margin-left: 0;

    &:not(.v-list-item--active):hover {
        background: rgba(124, 58, 237, 0.2);
    }
}

:deep(.v-list-item--active) {
    background: linear-gradient(90deg, #7C3AED, #EC4899);
    color: white !important;
    font-weight: bold;
}
</style>