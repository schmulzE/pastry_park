<script lang="ts" setup>
const props = defineProps(['recipe','handleRecipeSteps'])
</script>

<template>
  <div>steps!!!</div>
  <RecipeEditor :payload="recipe.steps"/>
</template>
