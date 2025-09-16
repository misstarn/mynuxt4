<script setup>
import DateFnsAdapter from "@date-io/date-fns";

const dateFns = new DateFnsAdapter();
function createNewRecord() {
    return {
        username: '',
        eamil: '',
        password: '',
        permissions: [],
    }
}

const books = ref([])
const formModel = ref(createNewRecord())
const dialog = shallowRef(false)
const isEditing = toRef(() => !!formModel.value.id)
const items = [
    'admin',
    'read',
    'write',
    'delete',
    'upload',
    'download',
]
const headers = [
    { title: 'ID', key: 'id', align: 'start' },
    { title: '姓名', key: 'username', align: 'start' },
    { title: '头像', key: 'avatar' },
    { title: '邮箱', key: 'email' },
    { title: '创建时间', key: 'createdAt' },
    { title: '角色', key: 'admin_profile.role' },
    { title: '权限', key: 'admin_profile.permissions' },
    { title: '部门', key: 'admin_profile.department' },
    { title: '状态', key: 'status' },
    { title: 'Actions', key: 'actions', align: 'end', sortable: false },
]


const { data, error, refresh } = await useAPI('/admin-users')

watch(data, (newVal) => {
    console.log(newVal)
    if (newVal?.code == 200) {
        books.value = newVal.data
    } else {
        // console.log(error.value)
    }
}, { immediate: true })


function add() {
    formModel.value = createNewRecord()
    dialog.value = true
}

function edit(id) {
    const found = books.value.find(book => book.id === id)

    formModel.value = {
        id: found.id,
        title: found.title,
        author: found.author,
        genre: found.genre,
        year: found.year,
        pages: found.pages,
    }

    dialog.value = true
}

function remove(id) {
    const index = books.value.findIndex(book => book.id === id)
    books.value.splice(index, 1)
}

async function save() {
    if (isEditing.value) {
        const index = books.value.findIndex(book => book.id === formModel.value.id)
        books.value[index] = formModel.value
    } else {
        console.log(formModel.value, 'vallllllllllllll')
        const { data, error } = await useAPI('/users', {
            method: 'post',
            body: formModel.value
        })

        console.log(data, error, '创建用户')
        if(data?.code == 200) {
            refresh()
        }
    }

    dialog.value = false
}

async function reset() {
    dialog.value = false
    refresh()
}

const date = ref('')

watch(date, async (newVal) => {
    console.log(newVal, '变化了')
    formModel.value.birthday = dateFns.formatByString(newVal, "yyyy/MM/dd");
})

</script>
<template>
    <v-sheet border rounded>
        <v-data-table :headers="headers" :hide-default-footer="books.length < 5" :items="books">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <v-icon color="medium-emphasis" icon="mdi-account-multiple" size="x-small" start></v-icon>
                        Admin-Users
                    </v-toolbar-title>

                    <v-btn class="me-2" prepend-icon="mdi-plus" variant="flat" color="primary" rounded="lg"
                        text="Add a User" border @click="add"></v-btn>
                </v-toolbar>
            </template>

            <template v-slot:item.status="{ value }">
                <v-chip :text="value == 'active' ? '已激活' : value == 'inactive' ? '未激活' : '已禁用'"
                    :prepend-icon="value == 'active' ? 'mdi-check-decagram' : 'mdi-cancel'"
                    :color="value == 'active' ? 'green' : 'red'" label>
                    <template v-slot:prepend>
                        <v-icon :color="value != 'active' ? 'error' : 'success'"></v-icon>
                    </template>
                </v-chip>
            </template>
            <template v-slot:item.avatar="{ value }">
                <v-avatar>
                    <v-img :src="value" cover></v-img>
                </v-avatar>
            </template>

            <template v-slot:item.actions="{ item }">
                <div class="d-flex ga-2 justify-end">
                    <v-icon color="medium-emphasis" icon="mdi-pencil" size="small" @click="edit(item.id)"></v-icon>

                    <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="remove(item.id)"></v-icon>
                </div>
            </template>

            <template v-slot:no-data>
                <v-btn prepend-icon="mdi-backup-restore" rounded="lg" text="Reset data" variant="text" border
                    @click="reset"></v-btn>
            </template>

        </v-data-table>
    </v-sheet>

    <v-dialog v-model="dialog" max-width="600">
        <v-card :title="`${isEditing ? 'Edit' : 'Add'} a User`">
            <template v-slot:text>
                <v-row>
                    <v-col cols="12">
                        <v-text-field variant="outlined" v-model="formModel.username" label="Name"></v-text-field>
                    </v-col>

                    <v-col cols="12">
                        <v-text-field variant="outlined" v-model="formModel.email" label="Email"></v-text-field>
                    </v-col>

                    <v-col cols="12">
                        <v-text-field variant="outlined" v-model="formModel.password" type="password"
                            label="Password"></v-text-field>
                    </v-col>

                    <v-col cols="12">
                        <v-combobox v-model="formModel.permissions" variant="outlined" :items="items"
                            label="Select a favorite activity or create a new one" multiple></v-combobox>
                    </v-col>

                </v-row>
            </template>

            <v-divider></v-divider>

            <v-card-actions class="bg-surface-light">
                <v-btn text="Cancel" variant="plain" @click="dialog = false"></v-btn>

                <v-spacer></v-spacer>

                <v-btn text="Save" @click="save"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>