<script lang="ts" setup>
type VueComponent = InstanceType<typeof component>;

interface SharedLink {
  _id: string;
  url: string;
  recipeId: string;
  createdBy: string;
}

import { createApp } from 'vue';
import { nanoid } from 'nanoid';
import { IRecipe, IRecipeIngredient } from '~/types';
import { extend } from "@vue/shared";
import useModalStore from '~/stores/modal';
import { useToast } from 'vue-toastification';
import RecipeView from "~/components/recipe/recipe-view.vue";
import ModalInfo from '~/components/ui/modal/modal-info.vue';
import { useGroceryList } from '~/composables/useGroceryList';
import RecipeSteps from "~/components/recipe/recipe-steps.vue";
import GroceryList from "~/components/grocery/grocery-list.vue";
import ScaleIngredient from "~/components/recipe/recipe-scaler.vue";
import PrintableRecipe from '~/components/recipe/printable-recipe.vue';
import MaximizeRecipe from '~/components/recipe/recipe-detail-view.vue';
import { useIngredientParser } from '~/composables/useIngredientParser';
import RecipeIngredient from "~/components/recipe/recipe-ingredients.vue"
  
const toast = useToast();
const route = useRoute();
const router = useRouter();
const component = extend({});
const store = useModalStore();
const link = ref<SharedLink | null>(null);
let currentComponent = shallowRef(RecipeView);
const { addRecipeIngredientsToGroceryList } = useGroceryList();
const { parseIngredients } = useIngredientParser();
const [category, recipeTitle, recipeId] =  route.params.slug;

const { data: recipeData, pending: isRecipeLoading, error: recipeError } = useFetch<IRecipe>(`/recipe/${recipeId}`);
const recipe = computed(() => recipeData.value);

const { data: recipes } = await useFetch<IRecipe[]>('/recipe');

const recipeIngredients = computed(() => recipe.value ? parseIngredients(recipe.value.ingredients) : []);

const tabs = [
  {
    name: "Intro",
    component: RecipeView
  },
  {
    name: "Ingredient",
    component: RecipeIngredient
  },
  {
    name: "Steps",
    component: RecipeSteps
  },

]

interface ComponentProps {
  recipe: IRecipe;
  recipeIngredients: IRecipeIngredient[];
  isEditable: boolean;
}

const currentProperties = computed((): ComponentProps => {
  const baseProps: ComponentProps = {
    recipe: recipe.value as IRecipe, // Ensure recipe.value is used
    recipeIngredients: recipeIngredients.value, // Ensure recipeIngredients.value is used
    isEditable: false
  };

  switch (currentComponent.value.__name) {
    case 'RecipeView':
      return baseProps;
    case 'RecipeIngredient':
    case 'RecipeSteps':
      return {
        recipe: baseProps.recipe, // This will be recipe.value from baseProps
        recipeIngredients: baseProps.recipeIngredients, // This will be recipeIngredients.value from baseProps
        isEditable: false
      };
    default:
      return {
        recipe: recipe.value as IRecipe, // Ensure recipe.value is used
        recipeIngredients: recipeIngredients.value, // Ensure recipeIngredients.value is used
        isEditable: false
      };
  }
}) as ComputedRef<ComponentProps>;

const changeTab = (value: VueComponent) => {
  currentComponent.value = value.component
}

 const editRecipe = () => {
  if (!recipe.value) return; // Add guard for null recipe
  return navigateTo(`/recipe/edit/${recipe.value.title.replaceAll(' ', '-').toLowerCase()}/${recipe.value._id}`)
 }

function maximizeRecipe () {
  if (!recipe.value) return; // Add guard for null recipe
  store.openModal({ 
    component: markRaw(MaximizeRecipe),
    props: {classes: "w-screen p-4 h-screen text-black rounded-none overflow-y-auto bg-gray-200", recipe: recipe.value, recipeIngredients: recipeIngredients.value}
  })
}

function scaleIngredient () {
  if (!recipe.value) return; // Add guard for null recipe
  store.openModal({ 
    component: markRaw(ScaleIngredient),
    props: {classes: "w-96 h-auto text-black rounded-sm bg-base-100", recipeIngredients: recipeIngredients.value },
    events: {
      set_scale: (payload) => {
        // recipeIngredients is now a computed, direct assignment is not possible.
        // This behavior needs to be re-evaluated. For now, commenting out or logging.
        console.warn("Attempted to set a computed property 'recipeIngredients'. This action has no effect.");
        // recipeIngredients = payload // This line will cause an error or have no effect
      },
    }
  })
}

function createGroceryList () {
  if (!recipe.value) return; // Add guard for null recipe
  store.openModal({ 
    component: markRaw(GroceryList), 
    props: {classes: "w-96 h-auto text-black rounded-sm bg-base-100", recipeIngredients: recipeIngredients.value},
    events: {
      create_grocery_list: async (ingredients) => {
        try {
          await addRecipeIngredientsToGroceryList(ingredients, recipe.value?._id!);
          toast("Ingredient added to your grocery list", { toastClassName: "my-toast-class" });
        } catch (error: any) {
          console.error('Error fetching recipe metadata:', error.message);
        }
      },
    }
  })
}

function confirmAlert () {
  if (confirm("Are you sure you want to delete this recipe") == true) deleteRecipe()
}

async function deleteRecipe () {
  if (!recipe.value) return; // Add guard for null recipe
  try {
    await $fetch(`/recipe/${recipe.value._id}`, {
      method: "DELETE",
    })
  } catch (error) {
    console.log(error)
  }finally {
    navigateTo(`/browse/${category}`);
  }
}

async function fetchSharedLink(linkId: string) {
  const { data } = await useFetch<SharedLink>(`/shared/${linkId}`, {
    method: 'GET'
  });
  link.value = data.value || null;
}

async function shareRecipe() {
    // First, check if a shared link already exists for this recipe
    const { data: existingLink } = await useFetch<SharedLink>(`/shared/recipe/${recipeId}`, {
    method: 'GET'
  });

  if (existingLink.value) {
    // If a link exists, fetch its details
    await fetchSharedLink(existingLink.value._id);
  }

  if (link.value) {
    store.openModal({
      component: markRaw(ModalInfo),
      props: {
        title: 'share recipe',
        text: 'Anyone with the link can view.',
        buttonText: 'stop sharing',
        link: link.value,
      },
      events: {
        modal_action: async () => {
          await $fetch<SharedLink>(`/shared/${link.value?._id}`, {
            method: 'DELETE',
          });
          store.closeModal();
        },
      },
    });
  } else {
    store.openModal({
      component: markRaw(ModalInfo),
      props: {
        title: 'share recipe',
        text: 'Your pastry recipe is private by default. To share this recipe, click on the create link below.',
        buttonText: 'start sharing',
      },
      events: {
        modal_action: async () => {
          try {

            const sharedLinkId = nanoid(); // Generate a unique share link

            const sharedLink = {
              sharedLinkId,
              recipeId,
            }
            const data = await $fetch<SharedLink>(`/shared`, {
              method: 'POST',
              body: sharedLink
            });
            link.value = data;
            store.openModal({
              component: markRaw(ModalInfo),
              props: {
                title: 'share recipe',
                text: 'Anyone with the link can view.',
                buttonText: 'stop sharing',
                link: link.value,
              },
              events: {
                modal_action: async () => {
                  await $fetch<SharedLink>(`/shared/${link.value?._id}`, {
                    method: 'DELETE',
                  });
                  store.closeModal();
                },
              },
            });
          } catch (error: any) {
            console.error('Error fetching recipe metadata:', error.message);
          }
        },
      },
    });
  }
}


const printStyles = `
  body { font-family: Arial, sans-serif; }
  .recipe-title { font-size: 24px; text-transform: uppercase; font-weight: 500; margin: 10px 0; }
  .recipe-description { font-style: italic; margin: 10px 0; }
  .recipe-image { width: 100%; height: 300px; background-size: cover; background-position: center; margin: 10px 0; }
  .recipe-meta { display: flex; justify-content: space-between; margin: 20px 0; }
  .recipe-source { font-weight: 500; font-size: 18px; }
  .recipe-yields { text-transform: capitalize; }
  .cooking-times { display: flex; gap: 20px; list-style-type: none; }
  .cooking-time-item { text-align: center; list-style-type: none; }
  .cooking-time-title { font-weight: 500; text-transform: uppercase; font-size: 14px; }
  .recipe-content { display: flex; justify-content: space-between; gap: 40px; }
  .ingredients-list, .steps-list { width: 50%; padding: 10px; list-style-type: none; }
  .ingredients-list li, .steps-list li { margin-bottom: 10px; list-style-type: none; }
`;

const printPage = () => {
  const printWindow = window.open('', '_blank', 'height=500,width=800')
  if (!printWindow || !recipe.value) return // Add guard for null recipe

  const app = createApp(PrintableRecipe, {
    recipe: recipe.value,
    recipeIngredients: recipeIngredients.value
  })

  const mountPoint = document.createElement('div');
  document.body.appendChild(mountPoint); // Temporarily attach to the document body
  app.mount(mountPoint)

  // Wait for Vue to finish rendering, then copy content
  setTimeout(() => {
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Recipe: ${recipe.value?.title!}</title>
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
  // printWindow!.close()
  app.unmount()
  document.body.removeChild(mountPoint); // Clean up the mount point
  }, 100)
}

</script>

<template>
  <NuxtLayout name="recipe">
    <template #tab>
      <div class="flex justify-between p-4 bg-gray-100 items-center">
        <button @click="router.back()" class=" capitalize"><i class="i-ri-arrow-left-s-line text-3xl"></i></button>
        <h1 class="text-2xl font-medium capitalize">recipe</h1>
        <button @click="maximizeRecipe"><i class="i-ph-arrows-out text-2xl"></i></button>
      </div>
      
      <div class="bg-gray-100 text-sm font-medium text-center text-gray-500 border-b border-gray-200">
        <ul class="flex flex-wrap justify-center">
          <li class="mr-9 text-center space-x-8" v-for="tab in tabs">
            <a 
            @click="changeTab(tab)" 
            class="inline-block p-4 border-b-2 text-md hover:text-[#4b371c] rounded-t-lg hover:border-[#4b371c] uppercase"  
            :class="{'text-[#4b371c] border-[#4b371c]': currentComponent === tab.component}"
            >
              {{ tab.name }}
            </a>
          </li>
        </ul>
      </div>

      
    </template>
    <template #sidebar>
      <RecipeCategory :recipes="recipes!" :category="category"/>
    </template>
    <template #main>
      <div v-if="isRecipeLoading" class="flex justify-center items-center h-full p-8">
        <p class="text-xl">Loading recipe...</p>
      </div>
      <div v-else-if="recipeError" class="p-8">
        <p class="text-xl text-red-500">Error loading recipe: {{ recipeError.message || 'Unknown error' }}</p>
      </div>
      <div v-else-if="recipe" class="h-full">
        <RecipeUtilityBar
          @edit-recipe="editRecipe"
          @maximize-recipe="maximizeRecipe"
          @scale-ingredient="scaleIngredient"
          @delete-recipe="confirmAlert"
          @print-recipe="printPage"
          @grocery-list="createGroceryList"
          @share-recipe="shareRecipe"
        />
        <component 
          :is="currentComponent" 
          v-bind="currentProperties"
        />
      </div>
      <div v-else class="flex justify-center items-center h-full p-8">
        <p class="text-xl text-gray-500">Recipe not found.</p>
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