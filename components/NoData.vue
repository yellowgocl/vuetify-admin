<template>
    <v-row class='mt-12' align-content='center' justify='center'>
        <v-col cols=8 sm='5' md='4'>
            <v-img width='100%' src='/images/no-data-0.png'></v-img>
            <p class="text-center" :class='[$vuetify.breakpoint.xsOnly ? "subtitle-2 mt-6" : "title mt-4"]'>没有更多数据 (▼へ▼メ)</p>
        </v-col>
    </v-row>
</template>
