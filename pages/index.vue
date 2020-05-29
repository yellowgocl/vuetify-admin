<template>
  <v-layout column justify-center align-center>
    <p class='display-1 mt-6'>Welcome</p>
    
  </v-layout>
</template>

<script>
export default {
  asyncData({ redirect }) {
    redirect('/co/material')
  }
}
</script>
