export async function classifyIngredient(name: string) {

  let groupRules = [
    { group: 'flour', keywords: ['all-purpose flour', 'bread flour', 'pastry flour', 'cake flour', 'durum flour','almond flour', 'coconut flour', 'oat flour', 'chickpea flour', 'cornstarch', 'flour']},
    { group: 'sweeteners', keywords: ['sugar', 'granulated sugar', 'honey', 'maple', 'syrup', 'white sugar', 'cane sugar', 'raw sugar', 'light brown sugar', 'dark brown sugar', 'powdered sugar', 'maple syrup', 'agave nectar', 'chocolate chips', 'chopped chocolate bars', 'cocoa nibs']}, 
    { group: 'leaveners', keywords: ['baking powder','baking soda', 'yeast']}, 
    { group: 'fruits', keywords: ['kiwis', 'strawberries', 'blueberries','mandarins', 'berries', 'apples', 'stone fruits', 'raisins', 'cranberries', 'chopped dates' ]}, 
    { group: 'spreads', keywords: [ 'jams', 'preserves', 'jellies', 'nutella']}, 
    { group: 'diary', keywords: ['egg', 'whole eggs', 'egg yolks', 'egg whites', 'milk', 'whole milk', 'low-fat milk', 'buttermilk', 'heavy cream', 'sour cream', 'yogurt', 'cream cheese', 'ricotta cheese', 'mascarpone cheese', 'unsalted butter','salted butter', 'sweet cream butter', 'organic butter', 'butter']}, 
    { group: 'beverages', keywords: ['water', 'juice', 'unsweetened cocoa powder', 'dutch-process cocoa powder']},
    { group: 'spices and seasonings', keywords: ['almonds', 'walnuts', 'pecans', 'chia seeds', 'flexseeds', 'table salt', 'kosher salt', 'sea salt', 'salt']},
    { group: 'fats and oil', keywords : ['butter', 'shortening' ,'lard', 'vegetable oil', 'canola oil', 'melted butter', 'coconut oil', 'olive oil']},
  ];

  for (const rule of groupRules) {
    const matchedKeyword = rule.keywords.find(keyword => name.toLowerCase().includes(keyword));
    if (rule.keywords.some(keyword => name.toLowerCase().includes(keyword))) {
      return { group: rule.group, keyword: matchedKeyword };
    }
  }

  return { group: 'uncategorized', keyword: null };
}