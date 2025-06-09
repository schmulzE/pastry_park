<script lang="ts" setup>
import { parseVulgars } from 'vulgar-fractions';
import { convertToFraction } from '@/utils/fractionConverter';

defineOptions({ inheritAttrs: false });

const emit = defineEmits(['set_scale']);
const props = defineProps(['recipeIngredients']);

let isSelected = ref(0)
let ingredients = ref([...props.recipeIngredients]);

function convertToDecimal(amount: string) {
  const parts = amount.trim().split(/\s+/);

  // If the amount is a whole number
  if (parts.length === 1) {
    return parseFloat(parts[0]);
  }

  // If the amount is a mixed fraction
  const whole = parseInt(parts[0]);
  const fraction = parts[1];

  const numerator = parseInt(fraction.slice(0, -1));
  const denominator = parseInt(fraction.slice(-1));

  const fractionValue = numerator / denominator;

  return whole + fractionValue;
}

const incrementIngredient = (number: number) => {
  isSelected.value = number;
  ingredients.value = props.recipeIngredients.map((item: { amount: string; }) => {
    let amountInDecimal = convertToDecimal(item.amount)
    let newAmount = amountInDecimal * number
    return { ...item, amount: newAmount.toString(),}
  })
}

const changeIngredientHandler = (e: any) => {
  if(e.target.value && e.target.value != 0) {
    let number = e.target.value as number
    isSelected.value = number
    ingredients.value = props.recipeIngredients.map((item: { amount: string; }) => {
      let amountInDecimal = convertToDecimal(item.amount)
      let newAmount = amountInDecimal * number
      return { ...item, amount: newAmount.toString(),}
    })
  }else {
    ingredients.value  = [...props.recipeIngredients]
  }
}

const setScaleHandler = () => {
  emit('set_scale', ingredients.value)
}

</script>

<template>
  <div class="p-4 bg-gray-300 font-mulish">
    <p class="font-medium text-lg">Scale by:</p>
    <div class="space-x-2 mt-2 text-lg">
      <button :disabled="isSelected == 0.5" class="btn btn-circle btn-md bg-gray-300 border-0 text-lg disabled:bg-gray-400/80" @click="incrementIngredient(0.5)">.5&times; </button>
      <button :disabled="isSelected == 1" class="btn btn-circle btn-md bg-gray-300 border-0 text-lg" @click="incrementIngredient(1)">1&times;</button>
      <button :disabled="isSelected == 1.5" class="btn btn-circle btn-md bg-gray-300 border-0 text-lg" @click="incrementIngredient(1.5)">1.5&times;</button>
      <button :disabled="isSelected == 2" class="btn btn-circle btn-md bg-gray-300 border-0 text-lg" @click="incrementIngredient(2)">2&times;</button>
      <button :disabled="isSelected == 3" class="btn btn-circle btn-md bg-gray-300 border-0 text-lg" @click="incrementIngredient(3)">3&times;</button>

      <input 
      class="w-10 p-0.5 outline-none" 
      :value=1
      id="input-amount" 
      type="number"
      @input="changeIngredientHandler($event)"
      >
    </div>
  </div>
  <div class="space-y-4 px-8 py-2 h-80 overflow-y-auto">
    <ul class="p-2 space-y-4" >
      <li v-for="(ingredient, index) in ingredients" :key="index">
        <strong>{{ convertToFraction(ingredient.amount) }} {{ ingredient.unit }}</strong> {{ parseVulgars(ingredient.note) }}
      </li>
    </ul>
  </div>
  <div class="p-4">
    <button class="bg-gray-900 uppercase text-white w-full p-1 text-md" @click="setScaleHandler">set scale</button>
    <p class="text-sm text-gray-500 mt-4">(gredients will temporarily be scaled until you refresh)</p>
  </div>
</template>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  appearance: textfield;
  -moz-appearance: textfield;
}

</style>