<script setup>
    definePageMeta({
        middleware: [
            function(to, from) {
                console.log(to)
            },
            // 'auth'
        ]
    })
    const title = ref('about')
    useSeoMeta({
        title: 'My Amazing Site',
        ogTitle: 'My Amazing Site',
        description: 'This is my amazing site, let me tell you all about it.',
        ogDescription: 'This is my amazing site, let me tell you all about it.',
        ogImage: 'https://example.com/image.png',
        twitterCard: 'summary_large_image',
    })
</script>
<template>
    <div>
        <Head>
            <Title>{{ title }}</Title>
            <Meta name="description" :content="title + ' page'"></Meta>
            <Style>
                body {
                    background-color: gray
                }
            </Style>
        </Head>
        <h1>这是{{ title }}</h1>
    </div>
</template>