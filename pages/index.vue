<template>
  <v-layout column justify-center align-center>
    <div class='display-1 mt-6'>Welcome</div>
    
  </v-layout>
</template>

<script>
export default {
  asyncData({ redirect }) {
    redirect('/co/material')
  }
}
</script>
