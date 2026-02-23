import type { MealPlan, Milestone } from '../types';

export const mealPlans: MealPlan[] = [
  {phaseId:1,dayType:"any",title:"Phase 1 \u2014 Daily Plan (2,400 kcal)",meals:[{label:"Breakfast",time:"7:30 AM",recipeId:"r1"},{label:"Morning Snack",time:"10:30",recipeId:"r28"},{label:"Lunch",time:"1 PM",recipeId:"r6"},{label:"Afternoon Snack",time:"4 PM",recipeId:"r25"},{label:"Dinner",time:"7 PM",recipeId:"r11"},{label:"Pre-Bed",time:"9:30 PM",recipeId:"r26"}]},
  {phaseId:2,dayType:"train",title:"Phase 2 \u2014 Training Day (2,700 kcal)",meals:[{label:"Breakfast",time:"7:30 AM",recipeId:"r5"},{label:"Pre-Workout",time:"10:30",recipeId:"r28"},{label:"Post-Workout Lunch",time:"1:30 PM",recipeId:"r6"},{label:"Snack",time:"4:30 PM",recipeId:"r25"},{label:"Dinner",time:"7:30 PM",recipeId:"r12"},{label:"Pre-Bed",time:"10 PM",recipeId:"r26"}]},
  {phaseId:2,dayType:"rest",title:"Phase 2 \u2014 Rest Day (2,200 kcal)",meals:[{label:"Breakfast",time:"8 AM",recipeId:"r1"},{label:"Snack",time:"11 AM",recipeId:"r27"},{label:"Lunch",time:"1 PM",recipeId:"r24"},{label:"Snack",time:"4 PM",recipeId:"r25"},{label:"Dinner",time:"7 PM",recipeId:"r11"},{label:"Pre-Bed",time:"9:30 PM",recipeId:"r26"}]},
  {phaseId:3,dayType:"train",title:"Phase 3 \u2014 Heavy Train Day (2,950 kcal)",meals:[{label:"Pre-Workout Breakfast",time:"6:30 AM",recipeId:"r5"},{label:"Post-Workout Meal",time:"After session",recipeId:"r7"},{label:"Snack",time:"4 PM",recipeId:"r25"},{label:"Dinner",time:"7:30 PM",recipeId:"r22"},{label:"Pre-Bed",time:"10 PM",recipeId:"r26"}]},
  {phaseId:3,dayType:"rest",title:"Phase 3 \u2014 Rest Day (2,100 kcal) Low Carb",meals:[{label:"Breakfast",time:"8 AM",recipeId:"r4"},{label:"Snack",time:"11 AM",recipeId:"r27"},{label:"Lunch",time:"1 PM",recipeId:"r9"},{label:"Snack",time:"4 PM",recipeId:"r29"},{label:"Dinner",time:"7 PM",recipeId:"r13"},{label:"Pre-Bed",time:"9:30 PM",recipeId:"r30"}]},
  {phaseId:3,dayType:"refeed",title:"Phase 3 \u2014 Refeed Day (3,200 kcal) High Carb",meals:[{label:"Breakfast",time:"7:30 AM",recipeId:"r2"},{label:"Pre-Workout",time:"10:30",recipeId:"r28"},{label:"Post-Workout Lunch",time:"1:30 PM",recipeId:"r7"},{label:"Snack",time:"4 PM",recipeId:"r25"},{label:"Dinner",time:"7:30 PM",recipeId:"r15"},{label:"Pre-Bed",time:"9:30 PM",recipeId:"r26"}]},
  {phaseId:4,dayType:"train",title:"Phase 4 \u2014 Max Training Day (3,100 kcal)",meals:[{label:"Pre-Workout",time:"6 AM",recipeId:"r2"},{label:"Post-Workout",time:"After session",recipeId:"r7"},{label:"Snack",time:"3:30 PM",recipeId:"r25"},{label:"Dinner",time:"7:30 PM",recipeId:"r12"},{label:"Pre-Bed",time:"10 PM",recipeId:"r26"}]},
  {phaseId:4,dayType:"rest",title:"Phase 4 \u2014 Rest Day (1,950 kcal) Near Zero-Carb",meals:[{label:"Breakfast",time:"8 AM",recipeId:"r4"},{label:"Snack",time:"11 AM",recipeId:"r27"},{label:"Lunch",time:"1 PM",recipeId:"r9"},{label:"Snack",time:"4 PM",recipeId:"r29"},{label:"Dinner",time:"7 PM",recipeId:"r14"},{label:"Pre-Bed",time:"9:30 PM",recipeId:"r30"}]},
  {phaseId:4,dayType:"refeed",title:"Phase 4 \u2014 Refeed Day (3,400 kcal) Max Carbs",meals:[{label:"Breakfast",time:"7 AM",recipeId:"r5"},{label:"Pre-Workout",time:"10 AM",recipeId:"r2"},{label:"Post-Workout Lunch",time:"1:30 PM",recipeId:"r8"},{label:"Snack",time:"4 PM",recipeId:"r28"},{label:"Dinner",time:"7:30 PM",recipeId:"r15"},{label:"Pre-Bed",time:"10 PM",recipeId:"r26"}]},
];

export const milestones: Milestone[] = [
  {month:1,text:"First full week without missing a session \u2705"},
  {month:2,text:"Jump rope 8 min continuous \u{1FA62}"},
  {month:3,text:"Squat bodyweight for 5 reps \u{1F3CB}\uFE0F"},
  {month:4,text:"\u20135 kg on scale \u{1F4C9}"},
  {month:6,text:"Jump rope 15 min continuous \u{1F525}"},
  {month:8,text:"\u201310 kg total | Barbell bench >80 kg \u{1F4AA}"},
  {month:10,text:"Squat >100 kg | Deadlift >120 kg"},
  {month:12,text:"\u201315 kg | Look and feel transformed \u{1F3AF}"},
  {month:15,text:"Deadlift >140 kg | Bench >100 kg \u{1F3C6}"},
  {month:18,text:"\u201322 kg | Friends start asking what you're doing"},
  {month:21,text:"Jump rope 20+ min | Athletic conditioning"},
  {month:24,text:"GOAL: ~90 kg | Strong, lean, athletic \u{1F947}"},
];
