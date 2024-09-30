<script lang="ts" setup>
import { IRecipe } from '~/types';
import { useIngredientParser } from '~/composables/useIngredientParser';

interface SharedLink {
  _id: string;
  url: string;
  recipeId: string;
  createdBy: string;
};

const route = useRoute();
const recipe = ref<IRecipe | null>(null);
const link = ref<SharedLink | null>(null);
const [linkId, recipetitle] =  route.params.slug;
const { parseIngredients } = useIngredientParser();


const { data } = await useFetch<SharedLink>(`/shared/${linkId}`, {
  method: 'GET'
});
link.value = data.value as SharedLink;

const { data: response } = await useFetch<IRecipe>(`/recipe/${link.value?.recipeId}`, {
  method: 'GET'
});
recipe.value = response.value as IRecipe;

let recipeIngredients = parseIngredients(recipe.value.ingredients);

</script>

<template>
  <div>
    <MaximizeRecipe :recipe="recipe" :recipeIngredients="recipeIngredients"/>
  </div>
</template>
