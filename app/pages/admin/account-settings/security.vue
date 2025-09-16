<script setup>
const tab = ref(null)
const visible = ref(true)
</script>

<template>

  <v-card class="mb-5" elevation="3">
    <v-card-item class="text-[#2e263db3]">
      <v-card-title>
        Change Password
      </v-card-title>
    </v-card-item>
    <v-card-text class="pt-0">
      <v-row>
        <v-col cols="6">
          <v-text-field variant="outlined" label="Current Password"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="!visible ? 'text' : 'password'"
            @click:append-inner="visible = !visible"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-text-field variant="outlined" label="New Password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="!visible ? 'text' : 'password'" @click:append-inner="visible = !visible"></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field variant="outlined" label="Confirm New Password"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="!visible ? 'text' : 'password'"
            @click:append-inner="visible = !visible"></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text class="pt-0  text-[#2e263db3]">
      <div class="text-[18px]">Password Requirements:</div>
      <v-list class="bg-white!  text-[#2e263db3]!">
        <v-list-item>
          <template v-slot:prepend>
            <Icon name="oui:dot" class="text-[#2e263db3]" :size="15"></Icon>
          </template>
          Minimum 8 characters long - the more, the better</v-list-item>
        <v-list-item>
          <template v-slot:prepend>
            <Icon name="oui:dot" class="text-[#2e263db3]" :size="15"></Icon>
          </template>
          At least one lowercase character</v-list-item>
        <v-list-item>
          <template v-slot:prepend>
            <Icon name="oui:dot" class="text-[#2e263db3]" :size="15"></Icon>
          </template>
          At least one number, symbol, or whitespace character</v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions class="pt-0">
      <v-btn variant="flat">Save Changes</v-btn>
    </v-card-actions>
  </v-card>
  <!--  -->
  <v-card elevation="3">
      <v-card-item>
        <v-card-title class=" text-[#2e263db3]">Two-steps verification</v-card-title>
      </v-card-item>
      <v-card-text class="pt-0  text-[#2e263db3]">
        <p class="mb-2">Two factor authentication is not enabled yet.</p>
        Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to log in. <NuxtLink to="#">Learn more</NuxtLink>.
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-btn variant="flat" class="normal-case!">Enable 2FA</v-btn>
      </v-card-actions>
    </v-card>
</template>

<style lang="scss" scoped>
:deep(.v-input__details) {
  display: none !important;
}

:deep(.v-list-item__spacer) {
  width: 12px;
}

.v-card-actions,
.v-card-text,
.v-card-item {
  padding: 1.25rem;
}

.v-list-item {
  padding-left: 0;
}
</style>