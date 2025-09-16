<script setup>
const route = useRoute();
const params = route.params;

let items = ref([]);
const baseUrl = "/admin/media";
let href = ref(baseUrl);

const library = ref(params.library || []);
const floderId = ref(null);
const ov2Checkeds = ref([]);
const folderCheckeds = ref([]);
const fileCheckeds = ref([]);

const updateBreadcrumb = (library) => {
  items.value = [];
  href.value = baseUrl;
  library.forEach((item, index) => {
    console.log(item, "item1");
    href.value += `/${item}`;
    items.value.push({
      title: item,
      disabled: index === library.length - 1 ? true : false,
      href: href.value,
    });
  });
};

watch(
  library,
  (newVal) => {
    updateBreadcrumb(newVal);
  },
  { immediate: true }
);



const folders = ref([]);
const files = ref([]);

const id = ref(1);
// const { $api } = useNuxtApp();
// const { data } = await $api(`/file/folderInfo/${id.value}`)
// const { data } = await $fetch(`/api/file/folderInfo/${id.value}`, {method: 'GET'})

const url = library.value.join(",")

const { data, refresh, error, clear } = await useAPI(`/file/folderInfo/${url}`);


watch(error, async (err) => {
  if (err && err.statusCode == 401) {
    console.log('token失效');
  }
})

const folderLibrary = ref([]);
const folderForm = reactive({
  name: "",
  parent: '/' + library.value.join("/"),
});

const Folderitems = ref([])

watch(
  data,
  (newVal) => {
    // console.log(newVal, "newVal")
    if (newVal?.code == 200) {
      folders.value = newVal.data.folders;
      files.value = newVal.data.files;
      library.value = newVal.data.folder_list.map((item) => item.name);
      Folderitems.value = [{
        ...newVal.data.folder_list[0],
        children: []
      }]
      floderId.value = newVal.data.folder_list[newVal.data.folder_list.length - 1].id;
      folderLibrary.value = newVal.data.allChildren || [];
    }
  },
  { immediate: true }
); //初始化也会执行一次

// 监听id变化
watch(id, async (newId) => {
  await refresh();
});
const toFolder = async (path) => {
  // id.value = folderId
  navigateTo(`${baseUrl}${path}`);
};

const overlay = ref(false);
const overlay2 = ref(false);
const overlay3 = ref(false);
const valid = ref(false);

const createFolder = async () => {
  const { data, error } = await useAPI(`/file/addFolder`, {
    body: { ...folderForm },
    method: "POST",
  });
  if (!error.value && data.value) {
    console.log("完成", data.value);
    overlay.value = false;
    refresh();
  } else {
    console.error("错误", error.value.data);
  }
};

function getImageSize(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      reject(new Error("Error"));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

const fileArr = ref([]);

const fileChange = async (e) => {
  for (let i = 0; i < e.target.files.length; i++) {
    const file = e.target.files[i];
    const url = URL.createObjectURL(file);
    const fileItem = {
      file: file,
      url: url,
      type: file.type,
    };
    let imgSize = null;
    if (file.type.startsWith("image")) {
      imgSize = await getImageSize(file);
      fileItem["size"] = imgSize;
    }

    fileArr.value.push(fileItem);
  }
};

const uploadLoding = ref(false);
// uploadFile
const uploadFile = async () => {
  console.log(fileArr);
  uploadLoding.value = true
  const formData = new FormData();
  fileArr.value.forEach((item) => {
    formData.append("files", item.file);
    URL.revokeObjectURL(item.url);
  });

  console.log(formData);
  formData.append("folder_id", floderId.value);

  const { data, error } = await useAPI("/file/uploadFiles", {
    method: "POST",
    body: formData,
  });

  console.log(data, error);
  if (data.value) {
    fileArr.value = [];
    overlay2.value = false;
    uploadLoding.value = false
    refresh();
  } else {
    console.error("error:", error.value);
    uploadLoding.value = false
  }
};

const ov2DeleteFile = () => {
  console.log(ov2Checkeds.value);
  fileArr.value = fileArr.value.filter((item) => {
    if (!ov2Checkeds.value.includes(item.url)) {
      return item;
    } else {
      URL.revokeObjectURL(item.url);
      return false;
    }
  });
};

// 删除
const deleteFolderAndFile = async () => {
  console.log(fileCheckeds.value, folderCheckeds.value, "delete");
  const isChecked = confirm(
    "Are you sure want to delete selected files and folders?"
  );

  if (!isChecked) {
    return;
  }

  const urls = files.value.filter((item) => fileCheckeds.value.includes(item.id))
  const { data, error } = await useAPI('/file/deleteFilesAndFolder', {
    method: 'POST',
    body: {
      folders: folderCheckeds.value,
      files: fileCheckeds.value,
      urls: urls.map(item => item.url.split('/').pop()),
      id: floderId.value
    }
  })


  if (data.value) {
    refresh()
    fileCheckeds.value = []
    folderCheckeds.value = []
  } else {
    console.error(error.value)
  }

};
// 移动
const moveFile = async () => {
  console.log(fileCheckeds.value, floderId.value, "move file", selected.value);
  const isChecked = confirm("Are you sure want to move selected files?");
  if(isChecked) {
    const { data, error } = await useAPI('/file/moveFiles', {
      method: 'POST',
      body: {
        files: fileCheckeds.value,
        folder_id: floderId.value,
        id: selected.value[0].id
      }
    })

    if (data.value.code == 200) {
      refresh()
      overlay3.value = false
      fileCheckeds.value = []
      navigateTo('/admin/media' + selected.value[0].path)
    } else {
      console.error(error.value)
    }
  }
};


const active = ref([])
const open = ref([])
const selected = shallowRef([])

const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

const fetchUsers = async (item) => {
  console.log('进了吗')
  await pause(1500)

  const { data, error, refresh } = await useAPI(`/file/getRootFolder?id=${item.id}`)
  return item.children.push(...data.value.data)
}
</script>
<template>
  <div class="flex justify-between items-center py-5">
    <v-breadcrumbs divider="/">
      <VBreadcrumbsItem :to="item.href" :disabled="item.disabled" :title="item.title" v-for="item in items">
      </VBreadcrumbsItem>
    </v-breadcrumbs>
    <div class="flex gap-2 text-base">
      <v-btn prepend-icon="mdi-plus" @click="overlay = !overlay" variant="tonal">
        Add new folder
      </v-btn>
      <v-overlay v-model="overlay" width="100%">
        <div
          class="modal-content mt-10! mx-auto bg-white! rounded-xl overflow-hidden shadow-xl w-[90%] lg:max-w-[65%] scale-95 transition-all duration-300 ease-in-out">
          <div
            class="flex justify-between px-4 py-5 text-[#8e8ea9]! items-center bg-[#f6f6f9]! border-b border-b-[#eaeaf1]!">
            <span class="text-xl font-bold text-[#32324d]">Add new Folder</span>
            <v-btn @click="overlay = false" icon="mdi-close" variant="tonal"></v-btn>
          </div>
          <v-form v-model="valid" class="p-10!">
            <div class="flex justify-between items-center gap-10">
              <v-text-field v-model="folderForm.name" label="Folder Name" class="rounded-lg px-3 w-full"
                variant="outlined"></v-text-field>
              <v-select class="rounded-lg px-3 w-full" label="Folder Parent" v-model="folderForm.parent"
                :items="folderLibrary" item-value="path" item-title="name" variant="outlined"></v-select>
            </div>
          </v-form>
          <div
            class="flex justify-between px-4 py-5 text-[#8e8ea9]! items-center bg-[#f6f6f9]! border-t border-t-[#eaeaf1]!">
            <v-btn @click="overlay = false" variant="tonal"> Cancel </v-btn>
            <div class="flex gap-5">
              <v-btn @click="createFolder" variant="flat">
                Create new Folder
              </v-btn>
            </div>
          </div>
        </div>
      </v-overlay>
      <v-btn prepend-icon="mdi-plus" @click="overlay2 = !overlay2" variant="flat">
        Add new assets
      </v-btn>
      <v-overlay v-model="overlay2" width="100%">
        <div class="modal-content mt-10! mx-auto bg-white! rounded-xl overflow-hidden shadow-xl w-[90%] lg:max-w-[65%]">
          <v-card>
            <v-card-title
              class="w-full flex! text-[#8e8ea9]! items-center bg-[#f6f6f9]! border-b border-b-[#eaeaf1] justify-between px-4 py-5">
              <span class="text-xl font-bold text-[#32324d]">Add new asssets</span>
              <v-btn variant="tonal" @click="overlay2 = false" icon="mdi-close"></v-btn>
            </v-card-title>
            <v-card-text class="p-10!">
              <div class="flex justify-between items-center">
                <div class="text-[#32324d] text-lg">
                  <p>
                    <span class="file-count px-1">0</span>
                    asset ready to upload
                  </p>
                  <p class="text-[#555] text-base">
                    Manage the assets before adding them to the Media Library
                  </p>
                </div>
                <v-btn variant="flat" onclick="document.querySelector('input[type=file]').click()">Add new
                  assets</v-btn>
                <input type="file" @change="fileChange" multiple hidden />
              </div>
              <div class="max-h-[400px] overflow-y-auto mt-10 p-[20px]">
                <div class="grid grid-cols-3 gap-[20px] file-list p-5!">
                  <v-card class="file-item" v-for="file in fileArr" :key="file.name">
                    <v-img class="align-end text-white rela bg-blue-100 rounded-none!" height="200" :src="file.url"
                      contain>
                      <!-- <v-card-title>Top 10 Australian beaches</v-card-title> -->
                      <v-checkbox v-model="ov2Checkeds" :value="file.url" class="absolute top-0 left-1"
                        color="info"></v-checkbox>
                    </v-img>
                    <v-card-text class="p-5 flex justify-between text-base">
                      <v-list-item class="w-full! px-0!">
                        <v-list-item-title>{{
                          file.file.name
                        }}</v-list-item-title>
                        <v-list-item-subtitle>
                          <span class="uppercase">{{ file?.type.split("/")[1].split('.').pop() }}</span>
                          <span v-if="file?.size">
                            -
                            {{ file?.size?.width }} x
                            {{ file?.size?.height }}
                          </span>
                        </v-list-item-subtitle>
                        <template v-slot:append>
                          <div class="justify-items-end">
                            <span class="bg-[#eaeaef] text-[#555] rounded-sm h-fit px-2 py-1 text-xs uppercase">{{
                              file?.type.split("/")[0] }}</span>
                          </div>
                        </template>
                      </v-list-item>
                    </v-card-text>
                  </v-card>
                </div>
              </div>
            </v-card-text>
            <v-card-actions
              class="flex! justify-between px-4 py-5 text-[#8e8ea9]! items-center bg-[#f6f6f9]! border-t border-t-[#eaeaf1]">
              <v-btn variant="tonal" @click="overlay2 = false">Cancel</v-btn>
              <div class="flex gap-5">
                <v-btn variant="tonal" @click="ov2DeleteFile" color="error"
                  prepend-icon="mdi-trash-can-outline">Delete</v-btn>
                <v-btn variant="flat" :loading="uploadLoding" prepend-icon="mdi-upload" @click="uploadFile">
                  Upload
                  <span class="file-count px-1">{{ fileArr.length }}</span>
                  asset to the library
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </div>
      </v-overlay>
    </div>
  </div>
  <v-container>
    <div class="items-center text-lg gap-5 edit" :class="[
      fileCheckeds.length > 0 || folderCheckeds.length > 0
        ? 'flex!'
        : 'hidden!',
    ]">
      <div class="flex">
        <span class="folder-len">{{ folderCheckeds.length }} </span> -
        {{ folderCheckeds.length > 1 ? "folders" : "folder" }}
        <span class="file-len ml-2">{{ fileCheckeds.length }} </span> -
        {{ fileCheckeds.length > 1 ? "assets" : "asset" }}
      </div>
      <div class="flex gap-2">
        <v-btn variant="tonal" @click="deleteFolderAndFile" prepend-icon="mdi-trash-can-outline"
          color="#b9281b">Delete</v-btn>
        <v-btn variant="tonal" @click="overlay3 = true" prepend-icon="mdi-folder-outline"
          v-if="folderCheckeds.length == 0" color="#2a1ede">Move</v-btn>
        <v-overlay v-model="overlay3" width="100%">
          <div
            class="modal-content mt-10! mx-auto bg-white! rounded-xl overflow-hidden shadow-xl w-[90%] lg:max-w-[65%]">
            <v-card>
              <v-card-title
                class="w-full flex! text-[#8e8ea9]! items-center bg-[#f6f6f9]! border-b border-b-[#eaeaf1] justify-between px-4 py-5">
                <span class="text-xl font-bold text-[#32324d]">Select Folder</span>
                <v-btn variant="tonal" @click="overlay3 = false" icon="mdi-close"></v-btn>
              </v-card-title>
              <v-card-text class="p-10!">
                <div class="flex flex-col justify-between items-center">
                  <v-select class="rounded-lg px-3 w-full" label="Folder Parent" v-model="folderForm.parent"
                    :items="folderLibrary" item-value="path" item-title="name" variant="outlined"></v-select>

                  <v-treeview class="w-full" v-model:selected="selected" :items="Folderitems"
                    :load-children="fetchUsers" density="compact" item-title="name" item-value="id" border fluid rounded
                    return-object selectable>
                    <template v-slot:append="{ item, isOpen }">
                      <v-icon v-if="!item.children" icon="mdi-folder"></v-icon>
                      <v-icon v-else :icon="isOpen ? 'mdi-folder-open' : 'mdi-folder'"></v-icon>
                    </template>
                  </v-treeview>
                </div>
              </v-card-text>
              <v-card-actions
                class="flex! justify-between px-4 py-5 text-[#8e8ea9]! items-center bg-[#f6f6f9]! border-t border-t-[#eaeaf1]">
                <v-btn variant="tonal" @click="overlay3 = false">Cancel</v-btn>
                <div class="flex gap-5">
                  <v-btn variant="flat" prepend-icon="mdi-folder-move"  @click="moveFile">
                    Move
                    <span class="file-count px-1">{{ fileCheckeds.length }}</span>
                    asset to the library
                  </v-btn>
                </div>
              </v-card-actions>
            </v-card>
          </div>
        </v-overlay>
      </div>
    </div>
    <!-- folders -->
    <div class="flex flex-col gap-2 mt-10">
      <div class="text-lg">
        Folders (
        <span class="folder-count text-[#66b7f1] text-base">{{
          folders.length
        }}</span>
        )
      </div>
      <div class="grid grid-cols-4 gap-3 py-5 folder-grid">
        <div class="folder-item relative" v-for="folder in folders" :key="folder.id" @dblclick="toFolder(folder.path)">
          <v-checkbox v-model="folderCheckeds" :value="folder.id" class="relative flex! flex-row!"
            color="info"></v-checkbox>
          <div class="flex items-center justify-center w-[55px] h-[50px] bg-[#eaf5ff] text-[#66b7f1] rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-folder-fill"
              viewBox="0 0 16 16">
              <path
                d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3m-8.322.12q.322-.119.684-.12h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981z" />
            </svg>
          </div>
          <div class="flex flex-col text-[#555]">
            <div class="text-lg font-[500] text-[#222]">{{ folder.name }}</div>
            <div class="text-sm">
              {{ folder.children.length }} folder,
              {{ folder.Files.length }} assets
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- files -->
    <div class="flex flex-col gap-2 mt-10">
      <div class="text-lg">
        Assets (
        <span class="assets-count text-[#66b7f1] text-base">{{
          files.length
        }}</span>
        )
      </div>
      <div class="grid grid-cols-4 gap-3 py-5 assets-grid">
        <v-card class="file-item" v-for="file in files" :key="file.name">
          <v-img class="align-end text-white rela bg-blue-100 rounded-none!" height="200" :src="file.url" contain>
            <!-- <v-card-title>Top 10 Australian beaches</v-card-title> -->
            <v-checkbox v-model="fileCheckeds" :value="file.id" class="absolute top-0 left-1" color="info"></v-checkbox>
          </v-img>
          <v-card-text class="p-5 flex justify-between text-base">
            <v-list-item class="w-full! px-0!">
              <v-list-item-title>{{ file.name }}</v-list-item-title>
              <v-list-item-subtitle>
                <span class="uppercase">{{ file?.mime_type.split("/")[1].split('.').pop() }}</span>
                <span v-if="file?.width">
                  -
                  {{ file?.width }} x
                  {{ file?.height }}
                </span>
              </v-list-item-subtitle>
              <template v-slot:append>
                <div class="justify-items-end">
                  <span class="bg-[#eaeaef] text-[#555] rounded-sm h-fit px-2 py-1 text-xs uppercase">{{
                    file?.mime_type.split("/")[0] }}</span>
                </div>
              </template>
            </v-list-item>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<style>
.spinning .v-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
