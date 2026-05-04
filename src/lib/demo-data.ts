const CLIENTS = [
  { id: 1, name: 'TechPark Cafeteria', contactPerson: 'Ramesh K', contactPhone: '9876543210', headcount: 1200, meals: ['breakfast', 'lunch'], deliveryAddress: 'TechPark, Whitefield', preferences: null },
  { id: 2, name: 'Sunrise Office Complex', contactPerson: 'Priya S', contactPhone: '9876543211', headcount: 800, meals: ['lunch'], deliveryAddress: 'Sunrise Campus, Koramangala', preferences: 'No onion/garlic on Tuesdays' },
  { id: 3, name: 'GreenLeaf Co-working', contactPerson: 'Vikram M', contactPhone: '9876543212', headcount: 400, meals: ['lunch', 'dinner'], deliveryAddress: 'GreenLeaf Hub, HSR Layout', preferences: null },
  { id: 4, name: 'Metro Hospital Staff', contactPerson: 'Dr. Anitha', contactPhone: '9876543213', headcount: 600, meals: ['breakfast', 'lunch', 'dinner'], deliveryAddress: 'Metro Hospital, MG Road', preferences: 'Low-oil options required' },
  { id: 5, name: 'BlueStar Manufacturing', contactPerson: 'Suresh B', contactPhone: '9876543214', headcount: 1500, meals: ['lunch'], deliveryAddress: 'BlueStar Factory, Peenya', preferences: null },
];

const RECIPES = [
  { id: 1, nameEn: 'Jeera Rice', nameHi: 'जीरा राइस', photoUrl: null, categories: ['lunch', 'rice'], baseServings: 100, prepTimeMinutes: 15, cookTimeMinutes: 25, ingredients: [{ nameEn: 'Basmati Rice', nameHi: 'बासमती चावल', quantity: 5, unit: 'kg' }, { nameEn: 'Cumin Seeds', nameHi: 'जीरा', quantity: 100, unit: 'g' }], steps: [{ order: 1, descriptionEn: 'Wash and soak rice', descriptionHi: 'चावल धोकर भिगोएं' }] },
  { id: 2, nameEn: 'Chapati', nameHi: 'चपाती', photoUrl: null, categories: ['lunch', 'dinner', 'bread'], baseServings: 100, prepTimeMinutes: 30, cookTimeMinutes: 20, ingredients: [{ nameEn: 'Wheat Flour', nameHi: 'गेहूं का आटा', quantity: 8, unit: 'kg' }], steps: [{ order: 1, descriptionEn: 'Knead the dough', descriptionHi: 'आटा गूंदें' }] },
  { id: 3, nameEn: 'Sambar', nameHi: 'सांभर', photoUrl: null, categories: ['lunch', 'curry'], baseServings: 100, prepTimeMinutes: 20, cookTimeMinutes: 40, ingredients: [{ nameEn: 'Toor Dal', nameHi: 'तूर दाल', quantity: 3, unit: 'kg' }, { nameEn: 'Sambar Powder', nameHi: 'सांभर मसाला', quantity: 200, unit: 'g' }], steps: [{ order: 1, descriptionEn: 'Pressure cook dal', descriptionHi: 'दाल प्रेशर कुक करें' }] },
  { id: 4, nameEn: 'Aloo Gobi', nameHi: 'आलू गोभी', photoUrl: null, categories: ['lunch', 'curry', 'veg'], baseServings: 100, prepTimeMinutes: 20, cookTimeMinutes: 30, ingredients: [{ nameEn: 'Potatoes', nameHi: 'आलू', quantity: 5, unit: 'kg' }, { nameEn: 'Cauliflower', nameHi: 'फूलगोभी', quantity: 4, unit: 'kg' }], steps: [{ order: 1, descriptionEn: 'Cut vegetables', descriptionHi: 'सब्जियां काटें' }] },
  { id: 5, nameEn: 'Paneer Butter Masala', nameHi: 'पनीर बटर मसाला', photoUrl: null, categories: ['dinner', 'curry', 'veg'], baseServings: 80, prepTimeMinutes: 25, cookTimeMinutes: 35, ingredients: [{ nameEn: 'Paneer', nameHi: 'पनीर', quantity: 4, unit: 'kg' }, { nameEn: 'Butter', nameHi: 'मक्खन', quantity: 500, unit: 'g' }], steps: [{ order: 1, descriptionEn: 'Prepare tomato gravy', descriptionHi: 'टमाटर ग्रेवी बनाएं' }] },
  { id: 6, nameEn: 'Mixed Veg Curry', nameHi: 'मिक्स वेज करी', photoUrl: null, categories: ['lunch', 'curry', 'veg'], baseServings: 100, prepTimeMinutes: 20, cookTimeMinutes: 30, ingredients: [{ nameEn: 'Mixed Vegetables', nameHi: 'मिक्स सब्जियां', quantity: 8, unit: 'kg' }], steps: [{ order: 1, descriptionEn: 'Chop all vegetables', descriptionHi: 'सब्जियां काटें' }] },
  { id: 7, nameEn: 'Dal Tadka', nameHi: 'दाल तड़का', photoUrl: null, categories: ['lunch', 'curry'], baseServings: 100, prepTimeMinutes: 15, cookTimeMinutes: 35, ingredients: [{ nameEn: 'Yellow Dal', nameHi: 'पीली दाल', quantity: 3, unit: 'kg' }], steps: [{ order: 1, descriptionEn: 'Boil dal until soft', descriptionHi: 'दाल नरम होने तक उबालें' }] },
  { id: 8, nameEn: 'Raita', nameHi: 'रायता', photoUrl: null, categories: ['lunch'], baseServings: 100, prepTimeMinutes: 10, cookTimeMinutes: 0, ingredients: [{ nameEn: 'Yogurt', nameHi: 'दही', quantity: 5, unit: 'kg' }, { nameEn: 'Cucumber', nameHi: 'खीरा', quantity: 2, unit: 'kg' }], steps: [{ order: 1, descriptionEn: 'Mix yogurt with grated cucumber', descriptionHi: 'दही में कसा हुआ खीरा मिलाएं' }] },
];

const TASKS = [
  { id: 1, recipeId: 1, totalServings: 800, status: 'done', clientNames: ['TechPark Cafeteria', 'Sunrise Office Complex'], shiftType: 'shift_6am', date: new Date().toISOString().split('T')[0], prepStartedAt: '2026-05-04T06:00:00Z', cookStartedAt: '2026-05-04T06:20:00Z', completedAt: '2026-05-04T06:50:00Z' },
  { id: 2, recipeId: 2, totalServings: 950, status: 'done', clientNames: ['TechPark Cafeteria', 'Metro Hospital Staff'], shiftType: 'shift_6am', date: new Date().toISOString().split('T')[0], prepStartedAt: '2026-05-04T06:00:00Z', cookStartedAt: '2026-05-04T06:35:00Z', completedAt: '2026-05-04T07:00:00Z' },
  { id: 3, recipeId: 3, totalServings: 600, status: 'cooking', clientNames: ['GreenLeaf Co-working'], shiftType: 'shift_6am', date: new Date().toISOString().split('T')[0], prepStartedAt: '2026-05-04T06:15:00Z', cookStartedAt: '2026-05-04T06:40:00Z', completedAt: null },
  { id: 4, recipeId: 4, totalServings: 750, status: 'cooking', clientNames: ['BlueStar Manufacturing'], shiftType: 'shift_6am', date: new Date().toISOString().split('T')[0], prepStartedAt: '2026-05-04T06:10:00Z', cookStartedAt: '2026-05-04T06:35:00Z', completedAt: null },
  { id: 5, recipeId: 5, totalServings: 500, status: 'prepping', clientNames: ['Metro Hospital Staff', 'GreenLeaf Co-working'], shiftType: 'shift_6am', date: new Date().toISOString().split('T')[0], prepStartedAt: '2026-05-04T07:00:00Z', cookStartedAt: null, completedAt: null },
  { id: 6, recipeId: 6, totalServings: 650, status: 'prepping', clientNames: ['TechPark Cafeteria'], shiftType: 'shift_6am', date: new Date().toISOString().split('T')[0], prepStartedAt: '2026-05-04T07:05:00Z', cookStartedAt: null, completedAt: null },
  { id: 7, recipeId: 7, totalServings: 400, status: 'not_started', clientNames: ['Sunrise Office Complex'], shiftType: 'shift_6am', date: new Date().toISOString().split('T')[0], prepStartedAt: null, cookStartedAt: null, completedAt: null },
  { id: 8, recipeId: 8, totalServings: 350, status: 'not_started', clientNames: ['Metro Hospital Staff'], shiftType: 'shift_6am', date: new Date().toISOString().split('T')[0], prepStartedAt: null, cookStartedAt: null, completedAt: null },
];

export const DEMO_DASHBOARD = {
  totalServings: 5840,
  clientCount: 5,
  activeShift: 'shift_6am',
  progressPct: 62,
  doneTasks: 2,
  totalTasks: 8,
  clientStatus: [
    { id: 1, name: 'TechPark Cafeteria', done: 3, total: 4, status: 'onTrack' },
    { id: 2, name: 'Sunrise Office Complex', done: 2, total: 3, status: 'inProgress' },
    { id: 3, name: 'GreenLeaf Co-working', done: 1, total: 3, status: 'delayed' },
    { id: 4, name: 'Metro Hospital Staff', done: 2, total: 2, status: 'onTrack' },
    { id: 5, name: 'BlueStar Manufacturing', done: 0, total: 1, status: 'inProgress' },
  ],
  alerts: [
    { severity: 'critical', message: 'Dal Tadka should have started' },
    { severity: 'warning', message: 'Paneer Butter Masala running behind schedule' },
  ],
  tasks: TASKS.map((t) => ({
    ...t,
    recipeName: RECIPES.find((r) => r.id === t.recipeId)?.nameEn || `Recipe #${t.recipeId}`,
  })),
};

export const DEMO_TASKS = TASKS;
export const DEMO_RECIPES = RECIPES;
export const DEMO_CLIENTS = CLIENTS;
