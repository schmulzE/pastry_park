import * as cheerio from 'cheerio';
import fetch from 'node-fetch';


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { url } : {url: string} = body
    try {
    console.log(url)
    const response = await fetch(url)
    const html = await response.text()
    const $ =  cheerio.load(html);

    const title = $('head title').text()
    const image = $('meta[property="og:image"], meta[name="og:image"]').attr('content') as string;
    const description = $('meta[property="og:description"], meta[name="og:description"]').attr('content') as string;
    const source = $('meta[property="og:site_name"], meta[name="og:site"]').attr('content') as string;

    // const images: (string | undefined)[] = [];
  
    // Extract image URLs
    // $('img').each((index, element) => {
    //   const imageUrl = $(element).attr('src');
    //   images.push(imageUrl);
    // });
    // if (images.length > 0) { 
    //   console.log(images)
    // }

    // Find the element with "Prep Time:" text (case-insensitive)
    const prepTimeNode = $('body').find('*').filter((index, element) => {
      return $(element).text().trim() === 'Prep Time:';
    });
    const cookTimeNode = $('body').find('*').filter((index, element) => {
      return $(element).text().trim() === 'Cook Time:';
    });
    const totalTimeNode = $('body').find('*').filter((index, element) => {
      return $(element).text().trim() === 'Total Time:';
    });
    const yieldNode = $('body').find('*').filter((index, element) => {
      return $(element).text().trim() === 'Yield:';
    });

    let yields = yieldNode.first().parent().text().trim().match(/\d+/)![0]
    // .split(':')[1];

    function extractTimeValues(inputString: string): number[] {
      const regex = /(\d+)\s*hour/g;
      const hourMatches = inputString.match(regex) || ['0'];
      
      const minuteRegex = /(\d+)\s*min/g;
      const minuteMatches = inputString.match(minuteRegex) || ['0'];
  
      const hours = hourMatches.map(match => parseInt(match.match(/\d+/)![0], 10));
      const minutes = minuteMatches.map(match => parseInt(match.match(/\d+/)![0], 10));

      return [ ...hours, ...minutes ];
    }

    let cookingtime = [];
    let prepTimeParentNode = prepTimeNode.first().parent().text().trim().replace(/\r?\n|\r|\t/g, " ");
    let cookTimeParentNode = cookTimeNode.first().parent().text().trim().replace(/\r?\n|\r|\t/g, " ");
    let totalTimeParentNode = totalTimeNode.first().parent().text().trim().replace(/\r?\n|\r|\t/g, " ");
    let prepTime = extractTimeValues(prepTimeParentNode);
    let cookTime = extractTimeValues(cookTimeParentNode);
    let totalTime = extractTimeValues(totalTimeParentNode);

    cookingtime.push({
      id: 1,
      title: "prep",
      hours: prepTime[0],
      minutes: prepTime[1],
    })
    cookingtime.push({
      id: 2,
      title: "cook",
      hours: cookTime[0],
      minutes: cookTime[1],
    })
    cookingtime.push({
      id: 3,
      title: "total",
      hours: totalTime[0],
      minutes: totalTime[1],
    })
    

    function extractInstructions(value1: string, value2: string, value3: string, value4: string){

      // Define a regular expression to match the heading tag containing just the word 'ingredients'
      const regex = /^h\d$/i; // Replace 'h' with the desired heading level (e.g., h1, h2, h3, etc.)
      const allLiTextContent: string[] = [];
      
      
      // Find the heading tag containing just the word 'ingredients'.
      let resultNode;
      $('body').find('h1, h2, h3, h4, h5, h6').each((index, element) => {
        const text = $(element).text().trim().toLowerCase();
        if (text === value1 || text === value2 || text === value3 ||  text === value4 && regex.test(element.tagName)) {
          resultNode = element;
          return false; // Stop iterating once a match is found
        }
      });

      // Output the result
      if (resultNode) {
      // console.log('Found heading tag:', (resultNode as HTMLElement).tagName, 'with content:', $(resultNode).text().trim());
      // Check if resultNode has siblings
      const hasSiblings = $(resultNode).next().length > 0;
      // Get all sibling nodes in an array
      const siblingNodesArray = hasSiblings
      ? $(resultNode).nextAll().toArray()
      : $(resultNode).parent().nextAll().toArray();

      // Recursive function to extract all <ul> elements
      function getAllUlElements(nodes: any[]) {
        const ulElements: any[] = [];
        nodes.forEach(node => {
          if ($(node).is('ul') || $(node).is('ol')) {
            ulElements.push(node);
          }
          const childNodes = $(node).children().toArray();
          if (childNodes.length > 0) {
              ulElements.push(...getAllUlElements(childNodes));
          }
        });
        return ulElements;
      }
      
      // Use the recursive function to get all <ul> elements
      const allUlElements = getAllUlElements(siblingNodesArray);
    
      // Output the result
      if (allUlElements.length > 0) {
        // console.log('All <ul> elements:', allUlElements);
        allUlElements.forEach(ulElement => {
        const liTags = $(ulElement).find('li').toArray();
        liTags.forEach(liTag => {
            const liText = $(liTag).text().trim();
            allLiTextContent.push(liText);
          });
        });
        
        // return the result
        if (allLiTextContent.length > 0) {
            // console.log('Text content of <li> tags within <ul> elements:', allLiTextContent);
            return allLiTextContent
        } else {
        console.log('No text content found in <li> tags within <ul> elements.');
        }
      } else {
        console.log('No <ul> elements found.');
      }
              
      } else {
        console.log('Heading tag containing just the word \'' +  value1 || value2 || value3 + '\' not found.');
      }

      return [];
                
    }


    function extractIngredients(value: string) {
      const regex = /^h\d$/i;
      const allLiTextContent: string[] = [];
    
      let resultNode : any;
      $('body')
        .find('h1, h2, h3, h4, h5, h6')
        .each((index, element) => {
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
              const liText = $(liTag).text().trim();
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
    


    let ingredients = extractIngredients('ingredients')
    let steps = extractInstructions(...['instructions','directions', 'steps', 'Preparation'])

    let recipe = {
      title,
      description,
      url,
      image,
      source,
      yields,
      cookingtime,
      steps,
      ingredients
    }

    console.log(yields)
    return { recipe }

    } catch (error: unknown) {
        return createError({ statusCode: 500, statusMessage: 'Something went wrong.' })
    }
});
