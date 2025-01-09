import jsonld from 'jsonld';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { ICookingtime, IRecipe } from '~/types';


export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { url } : {url: string} = body

    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html, { decodeEntities: false });

    let jsonLdData: Partial<IRecipe> | undefined = await extractRecipeFromJsonLd($, url);
    let scrapingData: Partial<IRecipe> | undefined = await extractRecipeFromWebsites($, url);

    const recipe: Partial<IRecipe> = {
      title: jsonLdData?.title || scrapingData?.title || '',
      description: jsonLdData?.description || scrapingData?.description || '',
      image: jsonLdData?.image || scrapingData?.image || '',
      cookingtime: jsonLdData?.cookingtime || scrapingData?.cookingtime || [],
      ingredients: jsonLdData?.ingredients || scrapingData?.ingredients || [],
      yields: jsonLdData?.yields || scrapingData?.yields || '',
      url,
      source: scrapingData?.source || '',
      steps: jsonLdData?.steps || scrapingData?.steps || [],
    };

    return { recipe }
    
  } catch (error) {
    if(error instanceof Error)
      sendError(event, createError({
      ...error,
      message: error.message,
    }))
  }
})


function convertMinutesToHoursAndMinutes(inputString: string) {
  const minutesMatch = inputString.match(/\d+/);
  if (minutesMatch) {
    const minutes = parseInt(minutesMatch[0]);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return { hours, minutes: remainingMinutes };
  } else {
    return { hours: 0, minutes: 0 };
  }
}

function getCookingTime (cookingtime: string, preptime: string, totaltime: string) {
  let result = []
  let prep = convertMinutesToHoursAndMinutes(cookingtime);
  let cook = convertMinutesToHoursAndMinutes(preptime);
  let total = convertMinutesToHoursAndMinutes(totaltime);

  result = [
    {id: uuidv4(), title: 'prep', hours: prep.hours, minutes: prep.minutes},
    {id: uuidv4(), title: 'cook', hours: cook.hours, minutes: cook.minutes},
    {id: uuidv4(), title: 'total', hours: total.hours, minutes: total.minutes}
  ];

  return result;
}


const extractRecipeFromJsonLd = async($: cheerio.CheerioAPI, url: string) => {
  const jsonLdScripts  = $('script[type="application/ld+json"]');
  let result;
  // Iterate over each script tag
  for (const element of jsonLdScripts.toArray()) {
    const jsonLdData = JSON.parse($(element).html()!);

    try {
      const flattened: any = await jsonld.flatten(jsonLdData);
      const recipeData = flattened.find((obj: { [x: string]: string | string[]; }) => obj['@type'] && obj['@type'].includes('http://schema.org/Recipe'));
  
      if (recipeData) {
        const ingredients: string[] = [];
        const steps: string[] = [];

        const title = recipeData['http://schema.org/name'] ? recipeData['http://schema.org/name'][0]['@value'] : '';
        const description = recipeData['http://schema.org/description'] ? recipeData['http://schema.org/description'][0]['@value'] : '';
        const yields = recipeData['http://schema.org/recipeYield'] ? recipeData['http://schema.org/recipeYield'].map((item: { [x: string]: any; }) => item['@value']).join(', ') : '';
        const prepTime = recipeData['http://schema.org/prepTime'] ? recipeData['http://schema.org/prepTime'][0]['@value'] : '';
        const totalTime = recipeData['http://schema.org/totalTime'] ? recipeData['http://schema.org/totalTime'][0]['@value'] : '';
        const cookTime = recipeData['http://schema.org/cookTime'] ? recipeData['http://schema.org/cookTime'][0]['@value'] : '';
        const images = recipeData["http://schema.org/image"] ? recipeData["http://schema.org/image"].map((item: { [x: string]: any; }) => item["@id"])[0] : '';
        // const rating = recipeData['http://schema.org/aggregateRating'] ? recipeData['http://schema.org/aggregateRating'][0]['@id']['http://schema.org/ratingValue'][0]['@value'] : '';

        // Extract ingredients
        const recipeIngredients = recipeData['http://schema.org/recipeIngredient'];
        if (recipeIngredients && recipeIngredients.length > 0) {
          recipeIngredients.forEach((ingredient: { [x: string]: { [x: string]: string; }[]; }) => {
            let ingredientText = '';

            if (ingredient['@value']) {
              ingredientText = ingredient['@value'] as unknown as string;
            } else if (ingredient['http://schema.org/text']) {
              ingredientText = ingredient['http://schema.org/text'][0]['@value'];
            } else if (ingredient['http://schema.org/name']) {
              ingredientText = ingredient['http://schema.org/name'][0]['@value'];
            }

            if (ingredientText) {
              ingredients.push(ingredientText as any);
            }
          });
        }

        const recipeInstructions = recipeData['http://schema.org/recipeInstructions'];
        if (recipeInstructions && recipeInstructions.length > 0) {
          recipeInstructions.forEach((step: { [x: string]: any; }) => {
            const stepId = step['@id'];
            const instructionStep = flattened.find((obj: { [x: string]: any; }) => obj['@id'] === stepId);
            if (instructionStep) {
              let stepText = '';
              if(instructionStep['@type'] && instructionStep['@type'].includes('http://schema.org/HowToSection')){
                const sectionName= instructionStep['http://schema.org/name'][0]['@value']
                if(sectionName) {
                  steps.push(sectionName);
                }
                const items = instructionStep['http://schema.org/itemListElement']
                items.forEach((item: any) => {
                  const itemId  = item['@id']
                  const instructionStep = flattened.find((obj: { [x: string]: any; }) => obj['@id'] === itemId);
                  if (instructionStep['http://schema.org/text']) {
                    stepText = instructionStep['http://schema.org/text'][0]['@value'];
                  }

                  if (stepText) {
                    steps.push(stepText);
                  }
                })
              }else {      
                if (instructionStep['http://schema.org/text']) {
                  stepText = instructionStep['http://schema.org/text'][0]['@value'];
                }

                if (stepText) {
                  steps.push(stepText);
                }
              }
            }
          });
        }
    
        const cookingtime = getCookingTime(prepTime, cookTime, totalTime);

        result = { title, description, url, images, yields, ingredients, steps, cookingtime };

      } else {
        console.log('Recipe data not found in the flattened JSON-LD.');
      }
    } catch (err) {
      if(err instanceof Error){
        throw new JsonLdError('Error flattening JSON-LD data', {
          cause: err,
          status: 500,
          code: 'JSON_LD_FLATTEN_ERROR',
          // Include relevant context
          details: {
            operation: 'flattenJsonLd',
            timestamp: new Date().toISOString()
          }
        })
      }else {
        throw new JsonLdError('Unknown error occurred', {
          details: { operation: 'flattenJsonLd', rawError: err }
        });
      }
    }
  }

  return result;
}

const extractRecipeFromWebsites = async($: cheerio.CheerioAPI, url: string) => {
  try {   
    let result;
    const title = $('head title').text()
    const image = $('meta[property="og:image"], meta[name="og:image"]').attr('content') as string;
    const description = $('meta[property="og:description"], meta[name="og:description"]').attr('content') as string;
    const source = $('meta[property="og:site_name"], meta[name="og:site"]').attr('content') as string;

    // Find the element with "Prep Time:" text (case-insensitive)
    const prepTimeNode = $('body').find('*').filter((index: number, element) => {
      return $(element).text().trim() === 'Prep Time:';
    });
    const cookTimeNode = $('body').find('*').filter((index: number, element) => {
      return $(element).text().trim() === 'Cook Time:';
    });
    const totalTimeNode = $('body').find('*').filter((index: number, element) => {
      return $(element).text().trim() === 'Total Time:';
    });
    const yieldNode = $('body').find('*').filter((index: number, element) => {
      return $(element).text().trim() === 'Yield:';
    });

    let yields = yieldNode.first().parent().text().trim().match(/\d+/) ? yieldNode.first().parent().text().trim().match(/\d+/)![0] : ''

    function extractTimeValues(inputString: string): number[] {
      const regex = /(\d+)\s*hour/g;
      const hourMatches = inputString.match(regex) || ['0'];
  
      const minuteRegex = /(\d+)\s*min/g;
      const minuteMatches = inputString.match(minuteRegex) || ['0'];

      const hours = hourMatches.map(match => parseInt(match.match(/\d+/)![0], 10));
      const minutes = minuteMatches.map(match => parseInt(match.match(/\d+/)![0], 10));

      return [ ...hours, ...minutes ];
    }

    let prepTimeParentNode = prepTimeNode.first().parent().text().trim().replace(/\r?\n|\r|\t/g, " ");
    let cookTimeParentNode = cookTimeNode.first().parent().text().trim().replace(/\r?\n|\r|\t/g, " ");
    let totalTimeParentNode = totalTimeNode.first().parent().text().trim().replace(/\r?\n|\r|\t/g, " ");
    let prepTime = extractTimeValues(prepTimeParentNode);
    let cookTime = extractTimeValues(cookTimeParentNode);
    let totalTime = extractTimeValues(totalTimeParentNode);

    let cookingtime: ICookingtime[] = [
      {id: uuidv4(), title: 'prep', hours: prepTime[0], minutes: prepTime[1]},
      {id: uuidv4(), title: 'cook', hours: cookTime[0], minutes: cookTime[1]},
      {id: uuidv4(), title: 'total', hours: totalTime[0], minutes: totalTime[1]},
    ]
    let ingredients = extractIngredients($, 'ingredients') as unknown as string[];
    let steps = extractInstructions($, ...['instructions','directions', 'steps', 'Preparation', 'How to']);
    result = { title, description, url, image, cookingtime, ingredients, steps, source, yields};

    return result;

  } catch (error) {
    if(error instanceof Error){
      throw new JsonLdError('Error flattening JSON-LD data', {
        cause: error,
        status: 500,
        code: 'JSON_LD_FLATTEN_ERROR',
        // Include relevant context
        details: {
          operation: 'flattenJsonLd',
          timestamp: new Date().toISOString()
        }
      })
    }else {
      throw new JsonLdError('Unknown error occurred', {
        details: { operation: 'flattenJsonLd', rawError: error }
      });
    }
  }

}

function scoreInstructionNode(text: any) {
  // const text = node.text().trim();
  let score = 0;

  // Check for starting with a capital letter
  if (/^[A-Z]/.test(text)) score++;

  // Check for ending with punctuation
  if (/[.!?]$/.test(text)) score++;

  // Check for length greater than 100 characters
  if (text.length > 100) score++;

  // Check for capital letters anywhere in the text
  if (/[A-Z]/.test(text)) score++;

  // Check for instructional words
  const instructionalWords = ['sprinkle', 'mix', 'heat', 'bake', 'cook', 'stir', 'chop', 'dice', 'saute', 'simmer', 'boil', 'fry', 'grill', 'roast', 'broil', 'blend', 'knead', 'whisk', 'fold', 'beat', 'cream', 'melt', 'pour', 'spread', 'drizzle', 'season', 'garnish'];
  if (instructionalWords.some(word => text.includes(word))) score++;

  return score;
}



function extractInstructions($: cheerio.CheerioAPI, ...headingValues: string[]) {
  const headingRegex = /^h\d$/i;
  const liTextContent: string[] = [];

  const getHeadingNode = (headingValues: string[]) => {
    const resultNode = $('body').find('h1, h2, h3, h4, h5, h6')
      .filter((_: any, element) => {
        const $element = $(element);
        const text = $element.text().trim().toLowerCase();
        return headingValues.some((value: string) => text.includes(value.toLowerCase())) && headingRegex.test(element.tagName);
      })
      .get(0);

    return resultNode;
  };

  const headingNode = getHeadingNode(headingValues);

  if (!headingNode) {
    return [];
  }

  console.log('Found heading tag:', headingNode.tagName, 'with content:', $(headingNode).text().trim());

  const siblingNodes = $(headingNode).next().length > 0
    ? $(headingNode).nextAll().toArray()
    : $(headingNode).parent().nextAll().toArray();

  const getAllUlElements = (nodes: any[]) => {
    const ulElements: any[] = [];
    nodes.forEach((node: any) => {
      if ($(node).is('ul, ol')) {
        ulElements.push(node);
      }
      ulElements.push(...getAllUlElements($(node).children().toArray()));
    });
    return ulElements;
  };

  const ulElements = getAllUlElements(siblingNodes);

  if (ulElements.length === 0) {
    // console.log('No <ul> elements found.');
    return [];
  }

  ulElements.forEach(ulElement => {
    $(ulElement).find('li').each((_ : any, liTag) => {
      const $liTag = $(liTag);
      const childNodes = $liTag.children(); // Get all child nodes of the <li> element

      // Check if the <li> tag has child nodes
      if (childNodes.length > 0) {
        childNodes.each((_: any, childNode: any) => {
          const $childNode = $(childNode);
          const nodeName = $childNode.prop('tagName')!.toLowerCase(); // Get the tag name in lowercase

          // Check if the child node is a <p>, <div>, or <span> tag
          if (nodeName === 'p' || nodeName === 'div' || nodeName === 'span') {
            const textContent = $childNode.text().trim();
            if (textContent) {
              const instructionScore = scoreInstructionNode(textContent) 
              if(instructionScore >= 3) {
                liTextContent.push(textContent);
              }
            } else {
              console.log('Empty text content in', nodeName, 'tag');
            }
          }
        });
      } else {
        console.log('The <li> tag does not have any child nodes');
      }
    });
  });

  if (liTextContent.length === 0) {
    console.log('No text content found in <li> tags within <ul> elements.');
  } else {
    console.log('Text content of <li> tags within <ul> elements:', 'liTextContent');
  }

  return liTextContent;
}


function extractIngredients($: cheerio.CheerioAPI, value: string) {
  const regex = /^h\d$/i;
  const allLiTextContent: string[] = [];

  let resultNode : any;
  $('body')
    .find('h1, h2, h3, h4, h5, h6')
    .each((_, element) => {
      const text = $(element).text().trim().toLowerCase();
      if (text === value && regex.test(element.tagName)) {
        resultNode = element;
        return false;
      }
    });

  if (resultNode) {
    console.log(
      'Found heading tag:',
      (resultNode as HTMLElement).tagName,
      'with content:',
      $(resultNode).text().trim()
    );

    let currentNode = $(resultNode);
    while (currentNode.length > 0) {
      const siblingNodes = currentNode.nextAll().toArray();
      const liTags = currentNode.find('li').toArray();

      if (liTags.length > 0) {
        liTags.forEach((liTag) => {
          const liText = $(liTag).text().trim().replace(/^[\W]/, "");
          allLiTextContent.push(liText);
        });
        return allLiTextContent;
      }

      if (siblingNodes.length > 0) {
        currentNode = $(siblingNodes[0]);
      } else {
        currentNode = currentNode.parent();
      }
    }

    console.log('No <li> tags found in siblings or ancestors.');
  } else {
    console.log('Heading tag containing just the word \'' + value + '\' not found.');
  }

  return [];
}