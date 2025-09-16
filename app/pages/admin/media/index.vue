<script setup>
const authStore = useAuthStore()

const root = ref('')
const folders = ref([])

console.log(authStore, 'authStore')

const { data, error, refresh } = await useAPI(`/file/getRootFolder`)

if(data.value) {
  folders.value = data.value.data
}

console.log(data.value, 'datavvvvvvvvvvvvvvvvvv')

const toFolder = (path) => {
    console.log('点击folder', path);
    navigateTo(`/admin/media${path}`)
}

const fileStart = async () => {
   const folderForm = { name: root.value, parent: null }
   console.log("点击新增folder", folderForm);
   const { data, error } = await useAPI(`/file/addFolder`, {
      body: folderForm,
      method: "POST",
   });
   console.log(data, "文件夹数据", error);
   if (!error.value && data.value) {
      console.log("完成", data.value);
      navigateTo(`/admin/media/${root.value}`)
   } else {
      console.error("错误", error.value.data);
   }
};

</script>
<template>
   <v-container>
      <v-text-field label="输入文件夹名称" v-model="root" variant="outlined"></v-text-field>
      <vBtn @click="fileStart">开始</vBtn>
        <div class="flex flex-col gap-2 mt-10">
      <div class="text-lg">
        Folders (
        <span class="folder-count text-[#66b7f1] text-base">{{
          folders.length
        }}</span>
        )
      </div>
      <div class="grid grid-cols-4 gap-3 py-5 folder-grid">
        <div
          class="folder-item relative"
          v-for="folder in folders"
          :key="folder.id"
          @dblclick="toFolder(folder.path)"
        >
          <!-- <v-checkbox
            v-model="folderCheckeds"
            :value="folder.id"
            class="relative flex! flex-row!"
            color="info"
          ></v-checkbox> -->
          <div
            class="flex items-center justify-center w-[55px] h-[50px] bg-[#eaf5ff] text-[#66b7f1] rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              class="bi bi-folder-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3m-8.322.12q.322-.119.684-.12h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981z"
              />
            </svg>
          </div>
          <div class="flex flex-col text-[#555]">
            <div class="text-lg font-[500] text-[#222]">{{ folder.name }}</div>
          </div>
        </div>
      </div>
    </div>
   </v-container>
</template>