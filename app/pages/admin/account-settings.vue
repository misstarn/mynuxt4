<script setup>

defineEmits({
    KeepAlive: true
})

const route = useRoute()
console.log(route.fullPath)

const menu = [
    {
        name: 'Account',
        icon: 'uil:users-alt',
        link: '/admin/account-settings/account'
    },
    {
        name: 'Security',
        icon: 'uil:lock-alt',
        link: '/admin/account-settings/security'
    },
    {
        name: 'Billing & Plans',
        icon: 'uil:bookmark',
        link: '/admin/account-settings/billing-plans'
    },
    {
        name: 'Notifications',
        icon: 'iconamoon:notification',
        link: '/admin/account-settings/notifications'
    },
    {
        name: 'Connections',
        icon: 'ep:link',
        link: '/admin/account-settings/connections'
    },
]

const menuIndex = menu.findIndex(item => item.link == route.fullPath)

const checked = ref(menuIndex)

</script>

<template>
    <v-item-group selected-class="bg-primary" v-model="checked">
        <v-container class="flex gap-2">
            <v-item v-for="m in menu" :key="m.name" v-slot="{ isSelected, selectedClass, toggle }">
                <v-btn variant="tonal" :to="m.link" class="normal-case!"
                    :class="[isSelected ? 'text-white!' : '', selectedClass]" @click="toggle">
                    <Icon size="20" class="mr-1" :name="m.icon" />{{ m.name }}
                </v-btn>
            </v-item>
        </v-container>
    </v-item-group>
    <!--  -->
    <NuxtPage />
</template>

<style scoped></style>