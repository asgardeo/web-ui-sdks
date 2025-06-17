<script setup>
import { useAsgardeo } from "@asgardeo/vue";

const { signIn } = useAsgardeo();
</script>

<template>
    <button @click="signIn">
        Sign In
    </button>
</template>
