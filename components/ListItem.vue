
<template>
    <v-list-group sub-group v-if='item.children' :key='item.id' v-model='item.model' value="true" :prepend-icon='item.icon' >
        <template v-slot:activator>
            <v-list-item-content>
            <v-list-item-title>
                {{ item.text }}
            </v-list-item-title>
            </v-list-item-content>
        </template>
        <!-- <v-list-item-group v-model="model"> -->
        <v-list-item
            v-for="(child, i) in item.children"
            :key="i"
            link>
            <v-list-item-action v-if="child.icon">
                <v-icon dense>{{ child.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title>
                    {{ child.text }}
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <!-- </v-list-item-group> -->
    </v-list-group>
     <v-list-item v-else :key="item.id" link >
        <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
            <v-list-item-title>
            {{ item.text }}
            </v-list-item-title>
        </v-list-item-content>
    </v-list-item>
</template>

<script>
export default {
    props: {
        item: { type: Object, required: true }
    }
}
</script>

<style scoped>

</style>
