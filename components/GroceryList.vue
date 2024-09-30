<script lang="ts" setup>
defineOptions({ inheritAttrs: false });
import useModalStore from '~/stores/modal';
import { parseVulgars } from 'vulgar-fractions';
import { convertToFraction } from '@/utils/fractionConverter';


const store = useModalStore();
const emit = defineEmits(['create_grocery_list']);
const props = defineProps(['recipeIngredients']);

let multiplier = ref(0);
let ingredients = ref([...props.recipeIngredients])
let selectedIngredients = ref<any[]>([])

function convertToDecimal(quantity: string) {
  const parts = quantity.trim().split(/\s+/);

  // If the quantity is a whole number
  if (parts.length === 1) {
    return parseFloat(parts[0]);
  }

  // If the quantity is a mixed fraction
  const whole = parseInt(parts[0]);
  const fraction = parts[1];

  const numerator = parseInt(fraction.slice(0, -1));
  const denominator = parseInt(fraction.slice(-1));

  const fractionValue = numerator / denominator;

  return whole + fractionValue;
}

const incrementIngredient = (number: number) => {
  multiplier.value = number;
  ingredients.value = props.recipeIngredients.map((item: { quantity: string; }) => {
    let quantityInDecimal = convertToDecimal(item.quantity)
    let newQuantity = quantityInDecimal * number
    return { ...item, quantity: newQuantity.toString()}
  })
}

const changeIngredientHandler = (e: any) => {
  if(e.target.value && e.target.value != 0) {
    let number = e.target.value as number
    multiplier.value = number
    ingredients.value = props.recipeIngredients.map((item: { quantity: string; }) => {
      let quantityInDecimal = convertToDecimal(item.quantity)
      let newQuantity = quantityInDecimal * number
      return { ...item, quantity: newQuantity.toString(),}
    })
  }else {
    ingredients.value  = [...props.recipeIngredients]
  }
}
  
  const toggleIngredient = (ingredient: { id: string; }) => {
    const index = selectedIngredients.value.findIndex(
      (item) => item.id === ingredient.id
    );
    if (index === -1) {
      selectedIngredients.value.push(ingredient);
    } else {
      selectedIngredients.value.splice(index, 1);
    }
    // console.log(selectedIngredients.value)
  };

  const isSelected = (ingredient: { id: string; }) => {
    return selectedIngredients.value.some((item) => item.id === ingredient.id);
  }

 const gorceryList = computed(() => {
  return ingredients.value.filter(
    (ingredient) =>
      !selectedIngredients.value.some((item) => item.id === ingredient.id)
  );
});
  
const createGroceryList = () => {
  emit('create_grocery_list', gorceryList.value)
  store.closeModal()
};

</script>

<template>
  <h3 class="italic text-2xl px-8 mt-6 font-source">Click ingredient to remove</h3>
  <div class="space-y-4 px-8 py-2 h-72 overflow-y-auto font-mulish">
    <ul class="p-2 space-y-4" >
      <li v-for="(ingredient, index) in ingredients" :key="index">
        <span @click="toggleIngredient(ingredient)" class="cursor-pointer" :class="{ 'text-gray-400 line-through': isSelected(ingredient) }">
          <strong>{{ convertToFraction(ingredient.quantity) }} {{ ingredient.unit }}</strong> {{ parseVulgars(ingredient.note) }}
        </span>
      </li>
    </ul>
  </div>
  <div class="p-4">
    <button class="bg-gray-900 uppercase text-white w-full p-1 text-md" @click="createGroceryList">set scale</button>
  </div>
  <div class="p-4 bg-gray-300">
    <p class="font-medium text-lg">Scale by:</p>
    <div class="space-x-2 mt-2 text-lg font-mulish">
      <button :disabled="multiplier == 0.5" class="btn btn-circle btn-md bg-gray-300 border-0 text-lg disabled:bg-gray-400/80" @click="incrementIngredient(0.5)">.5&times; </button>
      <button :disabled="multiplier == 1" class="btn btn-circle btn-md bg-gray-300 border-0 text-lg" @click="incrementIngredient(1)">1&times;</button>
      <button :disabled="multiplier == 1.5" class="btn btn-circle btn-md bg-gray-300 border-0 text-lg" @click="incrementIngredient(1.5)">1.5&times;</button>
      <button :disabled="multiplier == 2" class="btn btn-circle btn-md bg-gray-300 border-0 text-lg" @click="incrementIngredient(2)">2&times;</button>
      <button :disabled="multiplier == 3" class="btn btn-circle btn-md bg-gray-300 border-0 text-lg" @click="incrementIngredient(3)">3&times;</button>

      <input 
      class="w-10 p-0.5 outline-none" 
      :value=1
      id="input-quantity" 
      type="number"
      @input="changeIngredientHandler($event)"
      >
    </div>
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
  -moz-appearance: textfield; /* Firefox */
  -webkit-appearance: none; /* Safari, Chrome */
  appearance: none;
}

.Vue-Toastification__toast--default.my-custom-toast-class {
    background-color: red;
}

</style>