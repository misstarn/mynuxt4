<script setup>
const tab = ref(null)
</script>

<template>
  <v-card>
    <!--  -->
    <v-card-text>
      <div class="flex gap-5">
      <v-avatar size="120" rounded="0">
        <v-img src="https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-3/assets/avatar-1-CxOKCzdw.png" cover=""></v-img>
      </v-avatar>
      <form action="" class="flex flex-col gap-5 justify-center">
        <div>
          <v-btn class="normal-case! cursor-pointer" height="35" variant="flat">Upload New Photo</v-btn>
        </div>
        <p class="text-[18px]">Allowed JPG, GIF or PNG. Max size of 800K</p>
      </form>
    </div>
    <v-row class="mt-8">
      <v-col cols="6">
        <v-text-field clearable label="FirstName" variant="outlined"></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field clearable label="LastName" variant="outlined"></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field clearable label="LastName" variant="outlined"></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field clearable label="LastName" variant="outlined"></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field clearable label="LastName" variant="outlined"></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field clearable label="LastName" variant="outlined"></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field clearable label="LastName" variant="outlined"></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field clearable label="LastName" variant="outlined"></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field clearable label="LastName" variant="outlined"></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field clearable label="LastName" variant="outlined"></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field clearable label="LastName" variant="outlined"></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field clearable label="LastName" variant="outlined"></v-text-field>
      </v-col>
    </v-row>
    </v-card-text>
    <v-card-actions class="pb-5!">
      <v-btn variant="flat" class="normal-case! cursor-pointer">Save Changes</v-btn>
    </v-card-actions>
  </v-card>
  <v-card 
  class="mt-10!"
  title="Delete Account"
  >
    <v-card-text>
      <v-checkbox label="I confirm my account deactivation"></v-checkbox>
    </v-card-text>
    <v-card-actions class="pb-5">
      <v-btn class="normal-case! cursor-pointer" color="error" variant="flat">Deactivate Account</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style lang="scss" scoped>
  :deep(.v-input__details){
    display: none !important;
  }
</style>