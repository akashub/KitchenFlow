export const DEMO_DASHBOARD = {
  totalServings: 5840,
  clientCount: 6,
  activeShift: 'shift_6am',
  progressPct: 62,
  doneTasks: 8,
  totalTasks: 13,
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
  tasks: [
    { id: 1, recipeId: 1, totalServings: 800, status: 'done', recipeName: 'Jeera Rice', shiftType: 'shift_6am' },
    { id: 2, recipeId: 2, totalServings: 950, status: 'done', recipeName: 'Chapati', shiftType: 'shift_6am' },
    { id: 3, recipeId: 3, totalServings: 600, status: 'cooking', recipeName: 'Sambar', shiftType: 'shift_6am' },
    { id: 4, recipeId: 4, totalServings: 750, status: 'cooking', recipeName: 'Aloo Gobi', shiftType: 'shift_6am' },
    { id: 5, recipeId: 5, totalServings: 500, status: 'prepping', recipeName: 'Paneer Butter Masala', shiftType: 'shift_6am' },
    { id: 6, recipeId: 6, totalServings: 650, status: 'prepping', recipeName: 'Mixed Veg Curry', shiftType: 'shift_6am' },
    { id: 7, recipeId: 7, totalServings: 400, status: 'not_started', recipeName: 'Dal Tadka', shiftType: 'shift_6am' },
    { id: 8, recipeId: 8, totalServings: 350, status: 'not_started', recipeName: 'Raita', shiftType: 'shift_6am' },
  ],
};

export const DEMO_TASKS = DEMO_DASHBOARD.tasks;

export const DEMO_RECIPES = [
  { id: 1, nameEn: 'Jeera Rice', nameHi: 'जीरा राइस', baseServings: 100, prepTime: 15, cookTime: 25 },
  { id: 2, nameEn: 'Chapati', nameHi: 'चपाती', baseServings: 100, prepTime: 30, cookTime: 20 },
  { id: 3, nameEn: 'Sambar', nameHi: 'सांभर', baseServings: 100, prepTime: 20, cookTime: 40 },
  { id: 4, nameEn: 'Aloo Gobi', nameHi: 'आलू गोभी', baseServings: 100, prepTime: 20, cookTime: 30 },
  { id: 5, nameEn: 'Paneer Butter Masala', nameHi: 'पनीर बटर मसाला', baseServings: 80, prepTime: 25, cookTime: 35 },
  { id: 6, nameEn: 'Mixed Veg Curry', nameHi: 'मिक्स वेज करी', baseServings: 100, prepTime: 20, cookTime: 30 },
  { id: 7, nameEn: 'Dal Tadka', nameHi: 'दाल तड़का', baseServings: 100, prepTime: 15, cookTime: 35 },
  { id: 8, nameEn: 'Raita', nameHi: 'रायता', baseServings: 100, prepTime: 10, cookTime: 0 },
];

export const DEMO_CLIENTS = [
  { id: 1, name: 'TechPark Cafeteria', contactPerson: 'Ramesh K', headcount: 1200, meals: ['breakfast', 'lunch'] },
  { id: 2, name: 'Sunrise Office Complex', contactPerson: 'Priya S', headcount: 800, meals: ['lunch'] },
  { id: 3, name: 'GreenLeaf Co-working', contactPerson: 'Vikram M', headcount: 400, meals: ['lunch', 'dinner'] },
  { id: 4, name: 'Metro Hospital Staff', contactPerson: 'Dr. Anitha', headcount: 600, meals: ['breakfast', 'lunch', 'dinner'] },
  { id: 5, name: 'BlueStar Manufacturing', contactPerson: 'Suresh B', headcount: 1500, meals: ['lunch'] },
];
