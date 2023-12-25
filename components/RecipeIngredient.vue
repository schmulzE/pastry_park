<script lang="ts" setup>
const props = defineProps(['recipe','handleIngredient'])
</script>

<template>
  <div>Ingredient</div>
  <RecipeEditor :payload="recipe.ingredients"/>
</template>
