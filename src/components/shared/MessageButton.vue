<template>
    <button @click="$router.push('/messages')"
            class="mdl-button mdl-button--fab orange">
        <i class="material-icons message">message</i>
    </button>
</template>
<script>
export default {
  name: 'MessageButton'
}
</script>
