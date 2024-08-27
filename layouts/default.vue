<template>
  <div class="bg-spotifyDark">
    <slot />
  </div>
</template>

<script setup>
useSeoMeta({
  title: "Receiptify",
  ogTitle: "Receiptify",
  description: "This website shows your top tracks for the month.",
  ogDescription: "This website shows your top tracks for the month.",
});
</script>
