<script setup lang="ts">
type VueComponent = InstanceType<typeof component>;

definePageMeta({
  middleware: 'auth',
});

import { createApp } from 'vue';
import { Types } from 'mongoose';
import { IRecipe } from '~/types';
import { extend } from "@vue/shared";
import useModalStore from '~/stores/modal';
import { useToast } from 'vue-toastification';
import { useGroceryList } from '~/composables/useGroceryList';
import { classifyIngredient } from '~/utils/ingredientClassifier';
import MaximizeRecipe from '~/components/recipe/recipe-detail-view.vue';
import { useIngredientParser } from '~/composables/useIngredientParser';
import GroceryListManager from '~/components/grocery/grocery-list-manager.vue';
import { GroceryItem, GroceryListDocument } from '~/server/models/groceryList';
import GroceryLinkedRecipe from '~/components/grocery/grocery-linked-recipe.vue';
import EditGroceryListItem from '~/components/grocery/edit-grocery-list-item.vue';
import PrintableGroceryList from '~/components/grocery/printable-grocery-list.vue';
import SelectGroceryItemCategory from '~/components/grocery/select-grocery-item-category.vue';

const route = useRoute();
const toast = useToast();
const component = extend({});
const store = useModalStore();
const newGroceryItem = ref('');
let category = ref<string | null>('');
const fetchedRecipes = ref<IRecipe[]>([]);
const groceryList = ref<GroceryListDocument>();
const { parseIngredients } = useIngredientParser();
const { addRecipeIngredientsToGroceryList } = useGroceryList();
let currentComponent = shallowRef(GroceryListManager);

const { data } = await useFetch<any>(`/api/grocery-list`);

groceryList.value = data.value;

function extractUniqueRecipeIds(groceryList: GroceryListDocument): Types.ObjectId[] {
  const recipeIds = new Set<Types.ObjectId>();

  groceryList?.items.forEach(item => {
    if (item.recipeId) {
      recipeIds.add(item.recipeId);
    }
  });

  return Array.from(recipeIds);
}

const uniqueRecipeIds = extractUniqueRecipeIds(groceryList.value!);
const fetchPromises = uniqueRecipeIds.map(id => 
  $fetch<IRecipe>(`/recipe/${id}`)
)
fetchedRecipes.value = await Promise.all(fetchPromises);

function maximizeRecipe (recipe: IRecipe) {
  let recipeIngredients = parseIngredients(recipe.ingredients)
  store.openModal({ 
    component: markRaw(MaximizeRecipe), 
    props: {classes: "w-screen p-4 h-screen text-black rounded-none overflow-y-auto bg-gray-200", recipe, recipeIngredients}
  })
}

const copyGroceriesToClipboard = () => {
  // Convert the array to a string
  const ingredientsString = groceryList.value?.items
  .map(list => {
    return `${list.group}:\n
      ${list.quantity} ${list.unit} ${list.note}
    .join('\n')}`;
  })
  .join('\n\n');

  // Check if the clipboard API is supported
  if (navigator.clipboard) {
    navigator.clipboard.writeText(ingredientsString!).then(
      () => {
        toast('Groceries copied to clipboard', { toastClassName: "my-toast-class" });
      },
      (err) => {
        toast('Failed to copy text. Please try again', { toastClassName: "my-toast-class" });
      }
    );
  } else {
    // Fallback for browsers that do not support the Clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = ingredientsString!;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      toast('Groceries copied to clipboard', { toastClassName: "my-toast-class" });
    } catch (err) {
      toast('Failed to copy groceries', { toastClassName: "my-toast-class" });
    }
    document.body.removeChild(textArea);
  }
}

const printStyles = `
  body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
  .grocery-container { display: flex; flex-wrap: wrap; gap: 20px; }
  .category { width: calc(33.33% - 14px); margin-bottom: 20px; break-inside: avoid; }
  .category-title { background-color: #4a5568; color: #e2e8f0; padding: 10px; margin: 0; font-size: 16px; text-transform: uppercase; }
  .grocery-list { padding: 0; margin: 0; }
  .grocery-list-item { display: flex; align-items: flex-start; padding: 8px 0; list-style-type: none; font-size: 14px; }
  .grocery-item { margin-left: 10px; }
  .grocery-item-title { font-weight: bold; color: #2d3748; }
  .grocery-item-amount { color: #4a5568; }
  .grocery-item-note { color: #718096; font-size: 12px; margin-top: 2px; }
  .checkbox { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border: 2px solid #cbd5e0; border-radius: 3px; outline: none; cursor: pointer; margin-top: 3px; }
  .checkbox:checked { background-color: #4CAF50; border-color: #4CAF50; }
  .checkbox:checked::before { content: '\\2714'; display: block; text-align: center; color: white; font-size: 12px; line-height: 14px; }
`;


const printGroceryList = () => {
  const printWindow = window.open('', '_blank', 'height=500,width=800')
  if (!printWindow) return

  const app = createApp(PrintableGroceryList, {
   groceryList: groceryList.value
  })

  const mountPoint = document.createElement('div')
  app.mount(mountPoint)

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Grocery List</title>
        <style>
         ${printStyles}
          @media print {
            body { -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        ${mountPoint.innerHTML}
        <script>
          window.onload = () => {
            window.print();
            window.onafterprint = () => window.close();
          }
        </ script>
      </body>
    </html>
  `)

  printWindow.document.close()
  printWindow!.focus()
  printWindow!.print()
  printWindow!.close()
  app.unmount()
}


// Function to delete multiple grocery items based on recipeId
const deleteGroceryItemsByRecipeId = async (recipeId: Types.ObjectId) => {

  // Optimistically update the UI
  if (groceryList.value && groceryList.value.items) {
    groceryList.value.items = groceryList.value.items.filter(item => item.recipeId !== recipeId);
    fetchedRecipes.value = fetchedRecipes.value.filter(recipe => recipe._id !== recipeId);
  }

  try {
    // Send delete request to the server
    await $fetch(`/api/grocery-list/:id`, {
      method: 'DELETE',
      params: { recipeId },
    });

    // If successful, the optimistic update remains
  } catch (error) {
    console.error('Error deleting grocery items:', error);

  }
};

const deleteCompletedGroceryItem = async() => {
    // Optimistically update the UI
    if (groceryList.value && groceryList.value.items) {
      groceryList.value.items = groceryList.value.items.filter(item => item.completed);
    }
    try {
    // Send delete request to the server
    await $fetch(`/api/grocery-list/:id`, {
      method: 'DELETE',
      // params: { recipeId },
    });

    // If successful, the optimistic update remains
    } catch (error) {
      console.error('Error deleting completed grocery items:', error);
    }
}

// Function to delete a single grocery item based on _id
const deleteGroceryItemById = async (itemId: string) => {
  // Optimistically update the UI
  if (groceryList.value && groceryList.value.items) {
    groceryList.value.items = groceryList.value.items.filter(item => item._id !== itemId);
  }

  try {
    // Send delete request to the server
    await $fetch<any>(`/api/grocery-list/${itemId}`, {
      method: 'DELETE',
    });

    // If successful, the optimistic update remains
  } catch (error) {
    console.error('Error deleting grocery item:', error);
  }
};

const editGroceryListItem = (itemId: string) => {
  const item = groceryList.value?.items.find((item => item._id === itemId));
  if (item) {
    const originalItem = { ...item }; // Create a copy of the original item
    store.openModal({ 
      component: markRaw(EditGroceryListItem),
      props: {classes: "w-96 h-auto text-black rounded-sm bg-base-100", item },
      events: {
        update_item_keyword :(payload: string) => {
          item.keyword = payload;
        },
        update_item_group :(payload: string) => {
          item.group = payload;
        },
        update_item_quantity :(payload: string) => {
          item.quantity = payload;
        },
        update_item_details :(payload: string) => {
          item.note = payload;
        },
        save_edited_item : async () => {
          try {
            // Optimistically update the UI
            if (groceryList.value && groceryList.value.items) {
              groceryList.value = {
                ...groceryList.value,
                items: groceryList.value?.items.map(i => i._id === item._id ? item : i)
              };
            }
            await $fetch(`/api/grocery-list/${itemId}`, {
              method: 'PUT',
              body: { updates: item }
            });
          } catch (error) {
            // If the server update fails, revert the local state
            Object.assign(item, originalItem);
            console.error('Failed to update item:', error);
          }
        },
      }
    })
  }
}

const changeGroceryItemCategory = (itemId: string) => {
  const item = groceryList.value?.items.find((item => item._id === itemId));
  if (item) {
    store.openModal({ 
      component: markRaw(SelectGroceryItemCategory),
      props: {classes: "w-96 h-auto text-black rounded-sm bg-base-100", item },
      events: {
        'change-grocery-item-category': async (payload) => {
          // Optimistically update the UI
          item.group = payload;
          await $fetch(`/api/grocery-list/${itemId}`, {
            method: 'PATCH',
            body: { updates: { group: payload } }
          });
        },
      }
    })
  }
}


const addNewGroceryItem = async () => {
  if (!newGroceryItem.value.trim()) return;
  const ingredient = parseIngredients([newGroceryItem.value]);
  const { group, keyword} = await classifyIngredient(ingredient[0].note);

  const newItem: GroceryItem = {
    _id: Date.now().toString(), // Temporary ID
    quantity: ingredient[0].quantity!,
    unit: ingredient[0].unit!,
    group: group || 'uncategorized', // Default group
    completed: false,
    keyword: keyword ?? '',
    note: ingredient[0].note,
    recipeId: null
  };
  
  try {
    await addRecipeIngredientsToGroceryList(ingredient);
    // Optimistically update the UI;
    groceryList.value?.items.push(newItem);
    newGroceryItem.value = '';
  } catch (error) {
    toast('Error adding new grocery item', { toastClassName: "my-toast-class" });
  }
};

const tabs = [
  {
    name: "List",
    component: GroceryListManager
  },
  {
    name: "Recipes",
    component: GroceryLinkedRecipe
  },
]

interface ListComponentProps {
  groceryList?: GroceryListDocument;
  "onCopy-grocery-list" : () => void
  "onPrint-grocery-list" : () => void
  "onDelete-completed-grocery-item": () => void
  "onEdit-grocery-item": (id: string) => void
  "onChange-grocery-item-category" : (id: string) => void
  "onDelete-grocery-items": (recipeId: Types.ObjectId) => void
  "onAdd-grocery-item": () => void
}

interface RecipesComponentProps {
  fetchedRecipes: IRecipe[];
  "onMaximize-recipe": (recipe: IRecipe) => void
  "onDelete-grocery-item": (recipeId: Types.ObjectId) => void
}

type ComponentProps = Partial<ListComponentProps & RecipesComponentProps>;

const currentProperties = computed((): ComponentProps => {
  switch (currentComponent.value.__name) {
    case 'grocery-list-manager':
      return {
        groceryList: groceryList.value,
        "onCopy-grocery-list": copyGroceriesToClipboard,
        "onPrint-grocery-list": printGroceryList,
        "onDelete-completed-grocery-item": deleteCompletedGroceryItem,
        "onEdit-grocery-item": (itemId: string) => editGroceryListItem(itemId),
        "onChange-grocery-item-category": (itemId: string) => changeGroceryItemCategory(itemId),
        "onDelete-grocery-items": (recipeId: Types.ObjectId) => deleteGroceryItemsByRecipeId(recipeId),
        "onAdd-grocery-item" : addNewGroceryItem
        
      };
    case 'grocery-linked-recipe':
      return {
        fetchedRecipes: fetchedRecipes.value,
        "onMaximize-recipe": (recipe: IRecipe) => maximizeRecipe(recipe),
        "onDelete-grocery-item":  (recipeId: Types.ObjectId) => deleteGroceryItemsByRecipeId(recipeId)
      };
    default:
      throw new Error(`Unexpected component: ${currentComponent.value.__name}`);
  }
});

const changeTab = (value: VueComponent) => {
  currentComponent.value = value.component
}

onMounted(() => {
 category.value =  process.client ? localStorage.getItem('category') : 'shortcrust'
})
</script>

<template>
  <NuxtLayout name="recipe">
    <template #tab>
      <div class="flex justify-between font-sans p-4 bg-gray-100 items-center">
        <div></div>
        <h1 class="text-2xl font-medium capitalize">grocery</h1>
        <button class="" @click="deleteCompletedGroceryItem"><i class=" i-mdi-cart-off text-2xl md:text-3xl lg:text-3xl"></i></button>
      </div>
      
      <div class="bg-gray-100 text-lg font-medium text-center text-gray-500 border-b border-gray-200">
        <ul class="flex justify-center">
          <li class="text-center w-1/2 space-x-8" v-for="tab in tabs">
            <a
            @click="changeTab(tab)" 
            class="inline-block w-full p-4 border-b-2 text-md hover:text-[#4b371c] rounded-t-lg hover:border-[#4b371c] uppercase"  
            :class="{'text-[#4b371c] border-[#4b371c]': currentComponent === tab.component}"
            >
              {{ tab.name }}
            </a>
          </li>
        </ul>
      </div>
    </template>
   <template #sidebar>
    <GroceryLinkedRecipe 
    :fetchedRecipes="fetchedRecipes" 
    @maximize-recipe="maximizeRecipe" 
    @delete-grocery-items="deleteGroceryItemsByRecipeId"
    />
    </template>
   <template #main>
    <div class="hidden md:block lg:block">
      <GroceryListManager 
      :groceryList="groceryList!"
      @copy-grocery-list="copyGroceriesToClipboard"
      @print-grocery-list="printGroceryList"
      @delete-completed-grocery-item="deleteCompletedGroceryItem"
      @edit-grocery-item="editGroceryListItem"
      @change-grocery-item-category="changeGroceryItemCategory"
      @delete-grocery-item="deleteGroceryItemById"
      @add-grocery-item="addNewGroceryItem"
      />
    </div>

    <component 
     :is="currentComponent" 
      v-bind="currentProperties"
    />
   </template>
   <template #footer>
    <div class="flex justify-between content-center px-2">
      <NuxtLink to="/browse" class="btn btn-ghost btn-circle" >
        <i class="ri i-ri-book-3-fill text-2xl bg-gray-400" :class="{ 'bg-gray-700': route.path == '/browse' }"></i>
      </NuxtLink>
      <NuxtLink to="/search" class="btn btn-ghost btn-circle" >
        <i class="ri i-ri-search-line text-2xl bg-gray-400" :class="{ 'bg-gray-700': route.path ==  '/search' }"></i>
      </NuxtLink>
      <NuxtLink :to="`/${category?.toLowerCase()}/add-recipe`" class="btn btn-ghost btn-circle">
        <i class="ri i-ri-add-box-fill text-3xl bg-gray-400" :class="{ 'bg-gray-700': route.path == `${category}/add-recipe` }"></i>
      </NuxtLink>
      <NuxtLink to="/grocery-list" class="btn btn-ghost btn-circle">
        <i class="ri i-ri-shopping-cart-2-fill text-2xl bg-gray-400" :class="{ 'bg-gray-700': route.path == '/grocery-list' }"></i>
      </NuxtLink>
      <NuxtLink to="/account" class="btn btn-ghost btn-circle">
        <i class="i-ph-gear text-2xl bg-gray-400" :class="{ 'bg-gray-700': route.path == '/account' }"></i>
      </NuxtLink>
    </div>
   </template>
  </NuxtLayout>
</template>

<style>
/* When setting CSS, remember that priority increases with specificity, so don't forget to select the existing classes as well */
.Vue-Toastification__toast--default.my-toast-class {
  background-color: #a67c00;
}

</style>