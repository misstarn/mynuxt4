<script setup>
    definePageMeta({
        layout: 'custom',
        page: '123',
    })
  const items = [
    {
      title: 'Dashboard',
      disabled: false,
      href: 'breadcrumbs_dashboard',
    },
    {
      title: 'Link 1',
      disabled: false,
      href: 'breadcrumbs_link_1',
    },
    {
      title: 'Link 2',
      disabled: true,
      href: 'breadcrumbs_link_2',
    },
  ]
</script>
<template>
        <div>
            <NuxtPage :foobar="123" :page-key="route => route.fullPath" />
        </div>
</template>