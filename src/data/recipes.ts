import type { Recipe } from '../types';
import { MEALDB_RECIPES } from './recipes-mealdb';

export const EXAMPLE_COOK = `---
title: My Custom Recipe
servings: 1
tags: [dinner, high-protein]
---
Season @chicken breast{200%g} with @paprika{1%tsp}, @garlic powder{1/2%tsp} and @salt{}.
Pan-fry in @olive oil{1%tsp} for ~{14%minutes} total.
Serve with @steamed broccoli{1%handful} and @cooked rice{120%g}.`;

const HANDCRAFTED_RECIPES: Recipe[] = [
  // --- BREAKFAST ---
  {id:"r1",category:"breakfast",name:"Power Omelette",emoji:"\u{1F373}",time:"10 min",kcal:480,protein:42,carbs:8,fat:30,prepFriendly:false,dayType:"any",phases:[1,2,3,4],
   cook:`---\ntitle: Power Omelette\nservings: 1\ntags: [breakfast, low-carb, quick]\n---\nBeat @eggs{4} with @salt{1%pinch}, @pepper{} and @smoked paprika{\u00BD%tsp}.\nHeat @olive oil{1%tsp} in a #non-stick pan{} over medium heat.\nSaut\u00E9 @turkey breast slices{100%g} and @spinach{1%handful} ~{2%minutes} until spinach wilts.\nPour eggs over filling, add @cheddar cheese{30%g}, fold omelette in half when edges set.`},
  {id:"r2",category:"breakfast",name:"Overnight Oats + Protein",emoji:"\u{1F963}",time:"5 min + overnight",kcal:520,protein:38,carbs:72,fat:10,prepFriendly:true,dayType:"train",phases:[1,2,3,4],
   cook:`---\ntitle: Overnight Oats + Protein\nservings: 1\ntags: [breakfast, train-day, meal-prep]\n---\nCombine @rolled oats{80%g}, @skimmed milk{250%ml} and @vanilla whey protein{1%scoop} in a #mason jar{}.\nSeal and refrigerate for ~{8%hours} overnight.\nTop with sliced @banana{1} and @natural peanut butter{1%tbsp}.`},
  {id:"r3",category:"breakfast",name:"Protein Pancakes",emoji:"\u{1F95E}",time:"15 min",kcal:480,protein:44,carbs:46,fat:12,prepFriendly:false,dayType:"train",phases:[1,2,3,4],
   cook:`---\ntitle: Protein Pancakes\nservings: 1\ntags: [breakfast, train-day, weekend]\n---\nBlend @banana{1%ripe}, @eggs{2}, @rolled oats{50%g}, @vanilla whey protein{1%scoop} and @baking powder{\u00BD%tsp} until smooth.\nHeat @coconut oil{1%tsp} in a #non-stick pan{}.\nPour 4 small pancakes, cook ~{2%minutes} each side until golden.\nTop with @mixed berries{50%g} and @honey{1%tsp}.`},
  {id:"r4",category:"breakfast",name:"Smoked Salmon Egg White Omelette",emoji:"\u{1F41F}",time:"10 min",kcal:320,protein:38,carbs:4,fat:16,prepFriendly:false,dayType:"rest",phases:[2,3,4],
   cook:`---\ntitle: Smoked Salmon Egg White Omelette\nservings: 1\ntags: [breakfast, rest-day, low-carb, omega-3]\n---\nWhisk @egg whites{5} with @salt{1%pinch} and @dill{\u00BD%tsp}.\nHeat @olive oil{1%tsp} in a #non-stick pan{} over medium heat.\nPour egg whites, cook ~{2%minutes} until edges set.\nLayer @smoked salmon{80%g} and @capers{1%tsp} on one half. Fold and serve.`},
  {id:"r5",category:"breakfast",name:"Scrambled Eggs + Turkey + Rice",emoji:"\u{1F373}",time:"12 min",kcal:610,protein:52,carbs:55,fat:18,prepFriendly:false,dayType:"train",phases:[2,3,4],
   cook:`---\ntitle: Scrambled Eggs + Turkey + Rice\nservings: 1\ntags: [breakfast, train-day, high-protein]\n---\nScramble @eggs{4} in @olive oil{1%tsp} over medium heat. Set aside.\nSaut\u00E9 @turkey breast strips{150%g} with @paprika{\u00BD%tsp} and @garlic powder{\u00BD%tsp} ~{4%minutes}.\nServe eggs and turkey over @cooked white rice{120%g}.`},
  // --- LUNCH ---
  {id:"r6",category:"lunch",name:"Chicken & Rice Bowl",emoji:"\u{1F357}",time:"20 min",kcal:620,protein:52,carbs:65,fat:14,prepFriendly:true,dayType:"train",phases:[1,2,3,4],
   cook:`---\ntitle: Chicken & Rice Bowl\nservings: 1\ntags: [lunch, meal-prep, train-day, staple]\n---\nSeason @chicken breast{180%g} with @paprika{\u00BD%tsp}, @cumin{\u00BD%tsp}, @garlic powder{\u00BC%tsp} and @salt{}.\nPan-fry in @olive oil{1%tbsp} ~{14%minutes}, 7 min each side.\nRest ~{2%minutes}, slice and serve over @cooked white rice{150%g}.\nAdd @mixed salad leaves{1%handful} with @lemon juice{}.`},
  {id:"r7",category:"lunch",name:"Lean Beef Stir Fry + Rice",emoji:"\u{1F969}",time:"18 min",kcal:680,protein:55,carbs:68,fat:18,prepFriendly:true,dayType:"train",phases:[2,3,4],
   cook:`---\ntitle: Lean Beef Stir Fry + Rice\nservings: 1\ntags: [lunch, train-day, high-carb]\n---\nMarinate @lean beef strips{200%g} in @soy sauce{2%tsp}, @ginger{1%tsp} and @garlic{1%clove} ~{10%minutes}.\nStir fry beef in #wok{} on very high heat ~{4%minutes}. Set aside.\nStir fry @mixed peppers{1} and @broccoli{1%handful} ~{3%minutes}.\nReturn beef, toss together. Drizzle @sesame oil{1%tsp}. Serve over @cooked white rice{150%g}.`},
  {id:"r8",category:"lunch",name:"High-Protein Egg Fried Rice",emoji:"\u{1F373}\u{1F35A}",time:"15 min",kcal:660,protein:50,carbs:72,fat:18,prepFriendly:true,dayType:"train",phases:[2,3,4],
   cook:`---\ntitle: High-Protein Egg Fried Rice\nservings: 1\ntags: [lunch, train-day, batch-cook]\n---\nHeat @sesame oil{1%tsp} in a #wok{} over high heat.\nFry @cooked cold white rice{200%g} ~{3%minutes} until slightly crispy.\nScramble @eggs{3} in the same pan.\nMix in @turkey breast strips{120%g}, @frozen peas{50%g}, @soy sauce{2%tsp}.\nCook ~{2%minutes} more.`},
  {id:"r9",category:"lunch",name:"High-Protein Salad Jar",emoji:"\u{1F957}",time:"8 min",kcal:420,protein:40,carbs:22,fat:18,prepFriendly:true,dayType:"rest",phases:[3,4],
   cook:`---\ntitle: High-Protein Salad Jar\nservings: 1\ntags: [lunch, rest-day, low-carb, meal-prep]\n---\nLayer @olive oil{1%tbsp} and @lemon juice{} dressing at bottom of a #mason jar{}.\nAdd @cherry tomatoes{1%handful}, @cucumber{\u00BD%sliced}.\nTop with @mixed greens{1%handful}, @shredded chicken{150%g} and @hard-boiled eggs{2}.\nCrumble @feta cheese{30%g} on top. Seal and refrigerate \u2014 keeps 2 days.`},
  {id:"r10",category:"lunch",name:"Tuna Pasta Bowl",emoji:"\u{1F41F}",time:"15 min",kcal:560,protein:48,carbs:62,fat:10,prepFriendly:true,dayType:"train",phases:[1,2,3],
   cook:`---\ntitle: Tuna Pasta Bowl\nservings: 1\ntags: [lunch, budget, train-day]\n---\nCook @pasta{100%g} al dente, drain and cool.\nMix drained @canned tuna{160%g} with @cherry tomatoes{1%handful}, @cucumber{\u00BD}, @olive oil{1%tbsp} and @lemon juice{}.\nCombine with pasta. Season to taste.`},
  // --- DINNER ---
  {id:"r11",category:"dinner",name:"Lean Beef Mince Bowl",emoji:"\u{1F958}",time:"20 min",kcal:640,protein:55,carbs:52,fat:20,prepFriendly:true,dayType:"any",phases:[1,2,3,4],
   cook:`---\ntitle: Lean Beef Mince Bowl\nservings: 1\ntags: [dinner, meal-prep, budget]\n---\nBrown @extra lean beef mince{250%g} in @olive oil{1%tsp} with @onion{1%diced} and @garlic{3%cloves}.\nAdd @tomato passata{200%ml}, @cumin{1%tsp}, @paprika{1%tsp}, @oregano{\u00BD%tsp}. Simmer ~{12%minutes}.\nServe over @cooked white rice{150%g}.\n> Batch cook 4 portions. Freezes perfectly.`},
  {id:"r12",category:"dinner",name:"Chicken Thighs + Sweet Potato",emoji:"\u{1F360}",time:"35 min",kcal:590,protein:48,carbs:50,fat:16,prepFriendly:true,dayType:"train",phases:[1,2,3,4],
   cook:`---\ntitle: Chicken Thighs + Sweet Potato\nservings: 1\ntags: [dinner, train-day, meal-prep]\n---\nPreheat #oven{} to 200\u00B0C.\nToss @sweet potato{200%g diced} in @olive oil{1%tsp} and @smoked paprika{\u00BD%tsp}. Roast ~{25%minutes}.\nMarinate @skinless chicken thighs{200%g} in @garlic powder{\u00BD%tsp}, @oregano{\u00BD%tsp} and @olive oil{1%tsp}.\nAdd to roasting tray for last ~{20%minutes} until cooked through.\nServe with @steamed broccoli{}.`},
  {id:"r13",category:"dinner",name:"Cod + Roasted Veg (Low Carb)",emoji:"\u{1F421}",time:"25 min",kcal:380,protein:42,carbs:15,fat:14,prepFriendly:false,dayType:"rest",phases:[3,4],
   cook:`---\ntitle: Cod + Roasted Veg\nservings: 1\ntags: [dinner, rest-day, low-carb]\n---\nToss @zucchini{1%sliced}, @bell pepper{1%sliced}, @cherry tomatoes{1%handful} in @olive oil{2%tsp} and @garlic{2%cloves}. Roast at 200\u00B0C ~{20%minutes}.\nSeason @cod fillet{200%g} with @lemon juice{}, @salt{} and @pepper{}.\nPan-fry in @olive oil{1%tsp} ~{4%minutes} each side. Serve together.`},
  {id:"r14",category:"dinner",name:"Steak + Eggs + Greens",emoji:"\u{1F969}\u{1F373}",time:"15 min",kcal:520,protein:52,carbs:5,fat:34,prepFriendly:false,dayType:"rest",phases:[3,4],
   cook:`---\ntitle: Steak + Eggs + Greens (Zero Carb)\nservings: 1\ntags: [dinner, rest-day, zero-carb]\n---\nPat @sirloin steak{180%g} dry, season with @salt{}, @pepper{} and @garlic powder{\u00BC%tsp}.\nSear in hot #cast iron pan{} in @olive oil{1%tsp} ~{3%minutes} each side. Rest ~{3%minutes}.\nFry @eggs{2} in same pan.\nWilt @spinach{1%handful} with @garlic{1%clove} ~{1%minute}. Serve together.`},
  {id:"r15",category:"dinner",name:"Turkey Meatballs + Pasta",emoji:"\u{1F35D}",time:"30 min",kcal:650,protein:58,carbs:65,fat:16,prepFriendly:true,dayType:"train",phases:[1,2,3],
   cook:`---\ntitle: Turkey Meatballs + Pasta\nservings: 1\ntags: [dinner, train-day, meal-prep, freeze-friendly]\n---\nMix @turkey mince{300%g} with @egg{1}, @breadcrumbs{2%tbsp}, @garlic{2%cloves}, @parsley{} and @salt{}. Form 12 meatballs.\nBake in #oven{} at 200\u00B0C ~{18%minutes}.\nCook @dry pasta{100%g}. Simmer @tomato passata{200%ml} with @garlic{1%clove} and @oregano{\u00BD%tsp} ~{8%minutes}.\nCombine.`},
  // --- FROM DOLPH/RECIPES + AWESOME-RECIPES (converted to CookLang) ---
  {id:"r16",category:"dinner",name:"Beef Stroganoff (Lean)",emoji:"\u{1FAD5}",time:"30 min",kcal:620,protein:52,carbs:42,fat:22,prepFriendly:true,dayType:"train",phases:[1,2,3],
   cook:`---
title: Lean Beef Stroganoff
source: inspired by dolph/recipes
servings: 2
tags: [dinner, train-day, eastern-european, comfort]
---
Slice @lean beef sirloin{400%g} into thin strips. Season with @salt{} and @pepper{}.
Sear in @olive oil{1%tbsp} in a #large skillet{} over high heat ~{2%minutes} per side \u2014 brown, not grey. Set aside.
In same skillet melt @butter{1%tbsp}. Saut\u00E9 @onion{1%diced} ~{3%minutes} then add @mushrooms{200%g sliced} ~{5%minutes} until golden.
Add @garlic{2%cloves minced}, @Dijon mustard{1%tsp} and @paprika{1%tsp}.
Pour in @low-sodium beef stock{200%ml} and reduce ~{5%minutes} until slightly thick.
Lower heat, stir in @sour cream{3%tbsp} and return beef. Don't boil \u2014 just warm through ~{2%minutes}.
Serve over @cooked egg noodles{120%g} or rice. Garnish with @fresh dill{}.`},
  {id:"r17",category:"dinner",name:"One-Pot Chicken & Rice",emoji:"\u{1F372}",time:"35 min",kcal:600,protein:50,carbs:60,fat:15,prepFriendly:true,dayType:"train",phases:[1,2,3,4],
   cook:`---
title: One-Pot Chicken & Rice
source: inspired by dolph/recipes
servings: 2
tags: [dinner, train-day, one-pot, meal-prep]
---
Season @chicken thighs{400%g boneless skinless} with @paprika{1%tsp}, @garlic powder{\u00BD%tsp} and @salt{}.
Sear in @olive oil{1%tbsp} in a #heavy pot{} ~{4%minutes} each side. Remove.
Saut\u00E9 @onion{1%diced} and @garlic{3%cloves} in same pot ~{3%minutes}.
Add @long grain rice{150%g}, @low-sodium chicken stock{400%ml} and @dried oregano{1%tsp}. Stir.
Nestle chicken back in, cover and simmer ~{18%minutes} until rice absorbs liquid.
Rest ~{5%minutes} with lid on. Fluff rice and serve.
> Batch: double all ingredients for 4 portions. Refrigerates 4 days.`},
  {id:"r18",category:"dinner",name:"Greek Lemon Chicken",emoji:"\u{1FAD2}",time:"40 min",kcal:480,protein:50,carbs:12,fat:24,prepFriendly:true,dayType:"any",phases:[1,2,3,4],
   cook:`---
title: Greek Lemon Chicken
source: inspired by awesome-recipes
servings: 2
tags: [dinner, mediterranean, any-day, meal-prep]
---
Marinate @chicken thighs{400%g} in @lemon juice{3%tbsp}, @olive oil{2%tbsp}, @dried oregano{2%tsp}, @garlic{4%cloves minced} and @salt{1%tsp} for ~{30%minutes} minimum.
Preheat #oven{} to 200\u00B0C.
Arrange chicken in a #baking dish{}, pour marinade over.
Scatter @cherry tomatoes{200%g} and @Kalamata olives{50%g} around chicken.
Roast ~{35%minutes} until skin golden and juices run clear.
Serve with @cucumber slices{}, @crumbled feta{40%g} and warm @pita bread{1} or @rice{120%g}.`},
  {id:"r19",category:"dinner",name:"Turkey Stuffed Peppers",emoji:"\u{1FAD1}",time:"45 min",kcal:540,protein:50,carbs:45,fat:16,prepFriendly:true,dayType:"any",phases:[1,2,3,4],
   cook:`---
title: Turkey Stuffed Peppers
source: inspired by dolph/recipes
servings: 2
tags: [dinner, any-day, meal-prep, visual]
---
Preheat #oven{} to 190\u00B0C. Halve and deseed @bell peppers{4} and place in a #baking dish{}.
Brown @turkey mince{400%g} in @olive oil{1%tsp} with @onion{1%diced} and @garlic{3%cloves} ~{6%minutes}.
Add @canned chopped tomatoes{200%ml}, @cooked brown rice{120%g}, @cumin{1%tsp}, @paprika{1%tsp}. Simmer ~{5%minutes}.
Fill pepper halves with turkey mixture. Top each with @grated mozzarella{20%g}.
Bake ~{25%minutes} until peppers tender and cheese golden.`},
  {id:"r20",category:"dinner",name:"Garlic Butter Shrimp + Quinoa",emoji:"\u{1F990}",time:"20 min",kcal:490,protein:46,carbs:40,fat:16,prepFriendly:false,dayType:"any",phases:[1,2,3,4],
   cook:`---
title: Garlic Butter Shrimp + Quinoa
source: inspired by awesome-recipes/seafood
servings: 1
tags: [dinner, any-day, quick, omega-3]
---
Cook @quinoa{100%g} per package (~{15%minutes}).
Pat @king prawns{200%g} dry, season with @salt{} and @pepper{}.
Melt @butter{1%tbsp} in a #large pan{} over high heat. Add @garlic{4%cloves minced}, sizzle ~{30%seconds}.
Add prawns, cook ~{2%minutes} each side until pink.
Add @lemon juice{2%tbsp}, @white wine{2%tbsp} or stock, and @fresh parsley{1%handful}. Toss.
Serve immediately over quinoa.`},
  {id:"r21",category:"dinner",name:"Chicken Tikka Masala (Lean)",emoji:"\u{1F35B}",time:"40 min",kcal:560,protein:52,carbs:42,fat:18,prepFriendly:true,dayType:"train",phases:[1,2,3],
   cook:`---
title: Chicken Tikka Masala (Lean)
source: inspired by awesome-recipes/indian
servings: 2
tags: [dinner, train-day, indian, batch-cook]
---
Cube @chicken breast{500%g} and marinate in @plain yogurt{4%tbsp}, @garam masala{1%tsp}, @turmeric{\u00BD%tsp}, @cumin{1%tsp} and @salt{} for ~{30%minutes}.
Grill or pan-fry chicken ~{12%minutes} until charred. Set aside.
Saut\u00E9 @onion{1%large} in @olive oil{1%tbsp} ~{5%minutes}. Add @garlic{4%cloves} and @ginger{1%tbsp grated}.
Add @tomato passata{400%ml}, @garam masala{2%tsp}, @paprika{1%tsp}, @cumin{1%tsp}. Simmer ~{12%minutes}.
Stir in @light coconut milk{100%ml}, add chicken, simmer ~{5%minutes}.
Serve over @cooked basmati rice{150%g}. Garnish @fresh coriander{}.`},
  {id:"r22",category:"dinner",name:"Black Bean & Beef Burrito Bowl",emoji:"\u{1F32F}",time:"20 min",kcal:640,protein:52,carbs:60,fat:20,prepFriendly:true,dayType:"train",phases:[1,2,3],
   cook:`---
title: Black Bean & Beef Burrito Bowl
source: inspired by dolph/recipes/one-pot
servings: 1
tags: [dinner, train-day, mexican, batch-cook]
---
Brown @extra lean beef mince{200%g} in @olive oil{1%tsp} with @garlic{2%cloves} and @red onion{\u00BD%diced}.
Add @cumin{1%tsp}, @smoked paprika{1%tsp}, @chili powder{\u00BD%tsp}. Cook ~{2%minutes}.
Add @canned black beans{100%g drained} and @corn kernels{50%g}. Toss and warm through ~{3%minutes}.
Build bowl: @cooked white rice{150%g}, beef mixture, @cherry tomatoes{1%handful}, @avocado{\u00BC%sliced}.
Top with @sour cream{1%tbsp} and @lime juice{1%tbsp}.`},
  {id:"r23",category:"dinner",name:"Salmon Teriyaki + Broccoli",emoji:"\u{1F41F}",time:"25 min",kcal:520,protein:46,carbs:38,fat:22,prepFriendly:true,dayType:"any",phases:[1,2,3,4],
   cook:`---
title: Salmon Teriyaki + Broccoli
source: inspired by awesome-recipes/japanese
servings: 1
tags: [dinner, any-day, japanese, omega-3]
---
Mix @soy sauce{2%tbsp}, @honey{1%tbsp}, @sesame oil{1%tsp} and @ginger{\u00BD%tsp} to make teriyaki sauce.
Marinate @salmon fillet{180%g} in half the sauce ~{15%minutes}.
Steam @broccoli{150%g} ~{5%minutes} until tender-crisp.
Pan-fry salmon skin-down ~{4%minutes} then flip ~{2%minutes}. Pour remaining sauce over to glaze.
Serve over @cooked rice{120%g} with broccoli. Scatter @sesame seeds{1%tsp}.`},
  {id:"r24",category:"dinner",name:"Baked Salmon + Asparagus",emoji:"\u{1F420}",time:"22 min",kcal:480,protein:46,carbs:10,fat:28,prepFriendly:true,dayType:"any",phases:[1,2,3,4],
   cook:`---
title: Baked Salmon + Asparagus
servings: 1
tags: [dinner, any-day, omega-3, light]\n---\nPreheat #oven{} to 200\u00B0C.\nPlace @salmon fillet{180%g} on a #baking tray{} lined with parchment.\nSeason with @lemon juice{}, @garlic{1%clove minced}, @olive oil{1%tsp}, @salt{} and @pepper{}.\nArrange @asparagus spears{8} around salmon.\nBake ~{15%minutes} until salmon flakes easily.`},
  // --- SNACKS ---
  {id:"r25",category:"snack",name:"Protein Shake",emoji:"\u{1F964}",time:"2 min",kcal:200,protein:40,carbs:6,fat:4,prepFriendly:true,dayType:"any",phases:[1,2,3,4],
   cook:`---\ntitle: Protein Shake\nservings: 1\ntags: [snack, post-workout, quick]\n---\nAdd @whey protein{2%scoops} to a #shaker bottle{} with @cold water{350%ml}.\nShake vigorously ~{30%seconds}.\n-- Optional: swap water for skimmed milk for +100 kcal\n-- Optional: add \u00BD banana for train days`},
  {id:"r26",category:"snack",name:"Cottage Cheese + Walnuts",emoji:"\u{1F9C0}",time:"1 min",kcal:280,protein:26,carbs:8,fat:16,prepFriendly:true,dayType:"any",phases:[1,2,3,4],
   cook:`---\ntitle: Cottage Cheese + Walnuts\nservings: 1\ntags: [snack, pre-bed, casein]\n---\nMix @low-fat cottage cheese{200%g} with @cinnamon{1%pinch}.\nTop with @walnuts{20%g} and @honey{1%tsp} if desired.\n> Casein protein \u2014 ideal before bed for overnight muscle synthesis.`},
  {id:"r27",category:"snack",name:"Boiled Eggs \u00D73",emoji:"\u{1F95A}",time:"10 min",kcal:230,protein:19,carbs:2,fat:16,prepFriendly:true,dayType:"any",phases:[1,2,3,4],
   cook:`---\ntitle: Batch Boiled Eggs\nservings: 1\ntags: [snack, portable, budget]\n---\nPlace @eggs{3} in cold water in a #saucepan{}. Bring to boil.\nBoil ~{9%minutes} for hard-boiled.\nTransfer to ice water ~{5%minutes}, peel.\nSeason with @salt{} and @hot sauce{} if desired.\n> Make 9-12 on Sunday. Cheapest protein available.`},
  {id:"r28",category:"snack",name:"PB Protein Balls",emoji:"\u{1F7E4}",time:"15 min + chill",kcal:320,protein:22,carbs:28,fat:14,prepFriendly:true,dayType:"train",phases:[1,2,3],
   cook:`---\ntitle: Peanut Butter Protein Balls\nservings: 3 balls\ntags: [snack, train-day, batch-prep]\n---\nMix @rolled oats{60%g}, @natural peanut butter{3%tbsp}, @vanilla whey protein{1%scoop}, @honey{1%tbsp} and @dark chocolate chips{1%tbsp} in a #bowl{}.\nRoll into 6 balls.\nRefrigerate ~{30%minutes} until firm.\n> Batch 12 every Sunday. Fridge 5 days.`},
  {id:"r29",category:"snack",name:"Turkey Roll-Ups",emoji:"\u{1F32F}",time:"3 min",kcal:200,protein:28,carbs:4,fat:8,prepFriendly:true,dayType:"rest",phases:[3,4],
   cook:`---\ntitle: Turkey Roll-Ups (Zero Carb)\nservings: 1\ntags: [snack, rest-day, zero-carb]\n---\nLay @turkey breast slices{150%g} flat.\nSpread @hummus{2%tbsp} on each.\nAdd @cucumber strips{} and @spinach leaves{}.\nRoll up tightly.`},
  {id:"r30",category:"snack",name:"Greek Yogurt + Seeds",emoji:"\u{1F36F}",time:"2 min",kcal:240,protein:22,carbs:20,fat:8,prepFriendly:true,dayType:"any",phases:[1,2,3,4],
   cook:`---\ntitle: Greek Yogurt + Honey + Seeds\nservings: 1\ntags: [snack, any-day, pre-bed]\n---\nSpoon @full-fat Greek yogurt{200%g} into a #bowl{}.\nDrizzle @honey{1%tsp}.\nSprinkle @mixed seeds{1%tbsp} for healthy fats and crunch.\n> Excellent pre-bed casein option.`},
  // --- BATCH 3: Breakfasts ---
  {id:"r31",category:"breakfast",name:"Smoked Salmon Bagel",emoji:"\u{1F96F}",time:"5 min",kcal:480,protein:38,carbs:42,fat:16,prepFriendly:false,dayType:"any",phases:[1,2,3,4],
   cook:`---\ntitle: Smoked Salmon High-Protein Bagel\nservings: 1\ntags: [breakfast, any-day]\n---\nToast @wholegrain bagel{1}..\nSpread @low-fat cream cheese{2%tbsp} on each half.\nLayer @smoked salmon{100%g} across both halves.\nTop with @capers{1%tsp}, @red onion{thin slices}, @cucumber{3%slices}.\nSqueeze @lemon{1/4} over the top and finish with @black pepper{}.\n> Omega-3 rich. No cooking needed \u2014 prep in under 5 minutes.`},
  {id:"r32",category:"breakfast",name:"Overnight Oats with Berries",emoji:"\u{1FAD0}",time:"5 min prep",kcal:460,protein:34,carbs:52,fat:9,prepFriendly:true,dayType:"train",phases:[1,2],
   cook:`---\ntitle: High-Protein Overnight Oats\nservings: 1\ntags: [breakfast, train-day, prep]\n---\nIn a #mason jar{}, combine @rolled oats{80%g}, @protein powder{1%scoop}, @chia seeds{1%tbsp}.\nPour @skimmed milk{250%ml} and stir well.\nSeal and refrigerate overnight ~{8%hours}.\nIn the morning top with @mixed berries{100%g} and drizzle @honey{1%tsp}.\n> Prep Sunday night for 5 ready breakfasts. Swap milk for Greek yogurt for creamier version.`},
  {id:"r33",category:"breakfast",name:"Cottage Cheese Pancakes",emoji:"\u{1F95E}",time:"15 min",kcal:440,protein:42,carbs:36,fat:11,prepFriendly:false,dayType:"train",phases:[1,2,3,4],
   cook:`---\ntitle: Cottage Cheese Protein Pancakes\nservings: 1\ntags: [breakfast, train-day]\n---\nBlend @cottage cheese{200%g}, @eggs{2}, @oats{50%g}, @vanilla extract{1%tsp} until smooth.\nHeat #non-stick pan{} on medium with @cooking spray{}.\nPour small rounds, cook ~{3%min} per side until golden.\nServe with @Greek yogurt{2%tbsp} and @berries{50%g}.\n> High satiety, high protein. Batter keeps in fridge for 2 days.`},
  {id:"r34",category:"breakfast",name:"Egg White + Spinach Wrap",emoji:"\u{1F32F}",time:"10 min",kcal:350,protein:40,carbs:28,fat:7,prepFriendly:false,dayType:"rest",phases:[1,2,3,4],
   cook:`---\ntitle: Egg White Spinach Breakfast Wrap\nservings: 1\ntags: [breakfast, rest-day, low-fat]\n---\nWhisk @egg whites{6} with @salt{} and @pepper{}.\nSaut\u00E9 @baby spinach{100%g} and @cherry tomatoes{4} in @olive oil{1/2%tsp} ~{2%min}.\nAdd egg whites and scramble gently ~{3%min}.\nLoad into @wholegrain wrap{1} and roll tightly.\n> Strips down fat significantly vs. whole eggs. Perfect cutting day breakfast.`},
  {id:"r35",category:"breakfast",name:"Protein Waffles",emoji:"\u{1F9C7}",time:"20 min",kcal:500,protein:44,carbs:48,fat:12,prepFriendly:false,dayType:"train",phases:[2,3,4],
   cook:`---\ntitle: High-Protein Waffles\nservings: 1\ntags: [breakfast, train-day]\n---\nMix @oat flour{60%g}, @protein powder{1%scoop}, @baking powder{1%tsp}, @eggs{2}, @milk{100%ml}.\nHeat #waffle iron{} and spray with @cooking spray{}.\nPour batter and cook ~{5%min} until crispy.\nTop with @Greek yogurt{100%g}, @banana{1/2%sliced}, @honey{1%tsp}.\n> Make 4 waffles at once, freeze. Toast from frozen in 3 minutes.`},
  // --- BATCH 3: Lunches ---
  {id:"r36",category:"lunch",name:"Tuna Nicoise Salad",emoji:"\u{1F957}",time:"15 min",kcal:480,protein:46,carbs:24,fat:18,prepFriendly:false,dayType:"rest",phases:[1,2,3,4],
   cook:`---\ntitle: High-Protein Tuna Nicoise\nservings: 1\ntags: [lunch, rest-day, low-carb]\n---\nBoil @eggs{2} ~{8%min} then slice.\nArrange @mixed leaves{80%g}, @cherry tomatoes{6}, @green beans{60%g}, @black olives{8} on plate.\nTop with @tuna in spring water{160%g} drained and eggs.\nWhisk @olive oil{1%tbsp}, @lemon juice{1%tbsp}, @Dijon mustard{1%tsp}, @garlic{1%clove} for dressing.\nDrizzle over salad. Season with @black pepper{}.\n> Classic French. High omega-3. Zero cooking beyond eggs.`},
  {id:"r37",category:"lunch",name:"Chicken Caesar Wrap",emoji:"\u{1F32F}",time:"10 min",kcal:520,protein:48,carbs:38,fat:16,prepFriendly:true,dayType:"any",phases:[1,2,3,4],
   cook:`---\ntitle: High-Protein Chicken Caesar Wrap\nservings: 1\ntags: [lunch, any-day, meal-prep]\n---\nSlice @grilled chicken breast{150%g} into strips.\nToss with @romaine lettuce{80%g}, @Parmesan{20%g}, @low-fat Caesar dressing{2%tbsp}.\nWarm @wholegrain wrap{1} for ~{30%sec}.\nLoad filling and roll tightly. Wrap in foil for meal prep.\n> Prep 4 wraps Sunday using batch-cooked chicken. Refrigerate up to 3 days.`},
  {id:"r38",category:"lunch",name:"Lentil & Vegetable Soup",emoji:"\u{1F372}",time:"35 min",kcal:420,protein:28,carbs:52,fat:6,prepFriendly:true,dayType:"rest",phases:[1,2],
   cook:`---\ntitle: Protein-Packed Lentil Soup\nservings: 4\ntags: [lunch, rest-day, meal-prep, vegetarian]\n---\nSaut\u00E9 @onion{1}, @carrot{2}, @celery{2%stalks} in @olive oil{1%tbsp} ~{5%min}.\nAdd @red lentils{200%g}, @canned tomatoes{400%g}, @chicken stock{1%litre}, @cumin{1%tsp}, @paprika{1%tsp}.\nSimmer ~{25%min} until lentils are soft.\nBlend partially for thick texture. Season with @lemon juice{} and @salt{}.\n> Batch cooks 4 portions. Freezes well. Add chicken stock to boost protein.`},
  {id:"r39",category:"lunch",name:"Mackerel & Beetroot Salad",emoji:"\u{1F41F}",time:"10 min",kcal:490,protein:38,carbs:22,fat:24,prepFriendly:false,dayType:"rest",phases:[1,2,3,4],
   cook:`---\ntitle: Smoked Mackerel Beetroot Salad\nservings: 1\ntags: [lunch, rest-day, omega-3]\n---\nFlake @smoked mackerel fillets{160%g} over @rocket leaves{80%g}.\nAdd @cooked beetroot{100%g} sliced, @cucumber{4%slices}, @red onion{1/4}.\nWhisk @horseradish{1%tsp}, @Greek yogurt{2%tbsp}, @lemon juice{1%tbsp} for dressing.\nDrizzle over salad, crack @black pepper{}.\n> Exceptional omega-3. Full meal in 10 minutes flat.`},
  {id:"r40",category:"lunch",name:"Sweet Potato & Chicken Bowl",emoji:"\u{1F360}",time:"30 min",kcal:580,protein:50,carbs:58,fat:10,prepFriendly:true,dayType:"train",phases:[1,2,3,4],
   cook:`---\ntitle: Sweet Potato Power Bowl\nservings: 1\ntags: [lunch, train-day, meal-prep]\n---\nDice and roast @sweet potato{200%g} with @olive oil{1%tsp} ~{25%min} at 200\u00B0C.\nSeason @chicken breast{150%g} with @smoked paprika{1%tsp}, @garlic powder{1%tsp}.\nGrill or pan-fry chicken ~{12%min}.\nAssemble: potato base, sliced chicken, @avocado{1/4}, @cherry tomatoes{6}, @spinach{40%g}.\n> Batch roast sweet potato for 4 days. High glycaemic index for post-training.`},
  {id:"r41",category:"lunch",name:"Hoisin Duck Rice Bowl",emoji:"\u{1F986}",time:"25 min",kcal:560,protein:46,carbs:52,fat:14,prepFriendly:false,dayType:"train",phases:[2,3,4],
   cook:`---\ntitle: Hoisin Duck & Rice Bowl\nservings: 1\ntags: [lunch, train-day]\n---\nCook @basmati rice{70%g} in #rice cooker{} ~{15%min}.\nSeason @duck breast{150%g} with @five spice{1/2%tsp}, @salt{}.\nPan sear skin-side down ~{5%min}, flip ~{5%min}. Rest ~{3%min}.\nSlice and serve over rice with @cucumber{1/4%sliced}, @spring onion{2}.\nDrizzle @hoisin sauce{1%tbsp} over.\n> Remove duck skin to save 80 kcal if cutting hard.`},
  {id:"r42",category:"lunch",name:"Shakshuka",emoji:"\u{1F373}",time:"25 min",kcal:400,protein:32,carbs:28,fat:18,prepFriendly:false,dayType:"rest",phases:[1,2,3],
   cook:`---\ntitle: Protein Shakshuka\nservings: 1\ntags: [lunch, rest-day, vegetarian]\n---\nSaut\u00E9 @onion{1/2}, @red pepper{1/2}, @garlic{2%cloves} in @olive oil{1%tbsp} in #oven-safe pan{} ~{5%min}.\nAdd @canned tomatoes{400%g}, @paprika{1%tsp}, @cumin{1%tsp}, @cayenne{pinch}.\nSimmer ~{10%min}. Make 4 wells, crack in @eggs{3}.\nCover and cook ~{8%min} until whites set, yolks runny.\nTop with @feta{30%g}, @coriander{}.\n> Add a chicken breast sliced in for extra protein.`},
  // --- BATCH 3: Dinners ---
  {id:"r43",category:"dinner",name:"Peri Peri Chicken",emoji:"\u{1F336}\uFE0F",time:"40 min",kcal:540,protein:54,carbs:30,fat:18,prepFriendly:false,dayType:"any",phases:[1,2,3,4],
   cook:`---\ntitle: Homemade Peri Peri Chicken\nservings: 1\ntags: [dinner, any-day]\n---\nBlend @bird's eye chilli{2}, @garlic{4%cloves}, @olive oil{2%tbsp}, @lemon juice{1}, @paprika{1%tsp}, @oregano{1%tsp} into peri peri marinade.\nScore @chicken thighs{200%g} and coat in marinade. Marinate ~{1%hour}.\nRoast at 200\u00B0C ~{30%min} turning halfway.\nServe with @sweet potato fries{150%g} and @coleslaw{50%g}.\n> Batch marinate 4 portions. Freezes well before cooking.`},
  {id:"r44",category:"dinner",name:"Lamb Kofta with Tzatziki",emoji:"\u{1F9C6}",time:"30 min",kcal:560,protein:50,carbs:22,fat:28,prepFriendly:false,dayType:"train",phases:[2,3,4],
   cook:`---\ntitle: Lamb Kofta with Tzatziki\nservings: 1\ntags: [dinner, train-day, mediterranean]\n---\nMix @lean lamb mince{200%g}, @garlic{2%cloves}, @cumin{1%tsp}, @coriander{1%tsp}, @cinnamon{pinch}, @salt{}.\nShape into 4 kofta around skewers.\nGrill or cook in pan ~{3%min} each side, ~{12%min} total.\nFor tzatziki: mix @Greek yogurt{100%g}, @cucumber{1/4%grated}, @garlic{1%clove}, @mint{}, @lemon juice{}.\nServe with @pitta bread{1} and @salad leaves{}.\n> Classic Greek. Sub lamb with turkey mince to cut fat.`},
  {id:"r45",category:"dinner",name:"Prawn & Avocado Pasta",emoji:"\u{1F35D}",time:"20 min",kcal:580,protein:46,carbs:52,fat:18,prepFriendly:false,dayType:"train",phases:[2,3,4],
   cook:`---\ntitle: Prawn Avocado Pasta\nservings: 1\ntags: [dinner, train-day]\n---\nCook @wholegrain pasta{80%g} ~{10%min}. Reserve pasta water.\nSaut\u00E9 @king prawns{180%g} in @garlic{2%cloves} and @chilli flakes{pinch} in #pan{} ~{4%min}.\nMash @avocado{1/2} with @lemon juice{1%tbsp} and @black pepper{}.\nToss pasta with avocado, prawns, @cherry tomatoes{6}. Add pasta water to loosen.\nTop with @parmesan{20%g}.\n> Quick, no heavy sauce. Healthy fats from avocado.`},
  {id:"r46",category:"dinner",name:"Thai Green Curry (Lean)",emoji:"\u{1F958}",time:"30 min",kcal:520,protein:50,carbs:40,fat:16,prepFriendly:true,dayType:"any",phases:[1,2,3,4],
   cook:`---\ntitle: Lean Thai Green Curry\nservings: 1\ntags: [dinner, any-day, meal-prep]\n---\nFry @green curry paste{1%tbsp} in #wok{} ~{1%min}.\nAdd @light coconut milk{150%ml} and bring to simmer.\nAdd @chicken breast{150%g} diced, @courgette{1/2}, @mangetout{50%g}, @kaffir lime leaves{2}.\nSimmer ~{15%min}. Add @fish sauce{1%tsp}, @lime juice{}.\nServe over @jasmine rice{60%g}.\n> Use light coconut milk to halve the fat vs full-fat. Batch cook 4 portions.`},
  {id:"r47",category:"dinner",name:"Stuffed Bell Peppers (Beef)",emoji:"\u{1FAD1}",time:"45 min",kcal:520,protein:48,carbs:34,fat:18,prepFriendly:true,dayType:"train",phases:[1,2,3,4],
   cook:`---\ntitle: Beef Stuffed Bell Peppers\nservings: 1\ntags: [dinner, train-day, meal-prep]\n---\nCut @bell peppers{2} in half, scoop seeds. Roast at 180\u00B0C ~{10%min}.\nBrown @lean beef mince{150%g} with @onion{1/2}, @garlic{2%cloves}, @tomato paste{1%tbsp}.\nAdd @cooked rice{80%g}, @paprika{1%tsp}, @black pepper{}.\nFill pepper halves with mixture, top with @mozzarella{30%g}.\nBake ~{20%min}.\n> Batch fill 8 halves Sunday. Refrigerate 4 days or freeze.`},
  {id:"r48",category:"dinner",name:"Miso Glazed Cod",emoji:"\u{1F41F}",time:"20 min",kcal:420,protein:46,carbs:18,fat:12,prepFriendly:false,dayType:"rest",phases:[1,2,3,4],
   cook:`---\ntitle: Miso Glazed Cod\nservings: 1\ntags: [dinner, rest-day, low-calorie]\n---\nMix @white miso{1%tbsp}, @mirin{1%tbsp}, @rice wine vinegar{1%tsp}, @honey{1%tsp}.\nMarinate @cod fillet{160%g} ~{15%min}.\nSear in @sesame oil{1%tsp} in #oven-safe pan{} ~{3%min}.\nFlip, spoon glaze over, bake at 200\u00B0C ~{8%min}.\nServe with @edamame{80%g} and @steamed bok choy{100%g}.\n> Light but impressive. Only 420 kcal for a full dinner \u2014 ideal rest day.`},
  {id:"r49",category:"dinner",name:"Slow Cooker Pulled Chicken",emoji:"\u{1F357}",time:"15 min prep",kcal:560,protein:60,carbs:36,fat:14,prepFriendly:true,dayType:"train",phases:[1,2,3,4],
   cook:`---\ntitle: Slow Cooker Pulled Chicken\nservings: 4\ntags: [dinner, train-day, meal-prep]\n---\nPlace @chicken breasts{600%g} in #slow cooker{}.\nPour over @BBQ sauce{4%tbsp}, @chicken stock{100%ml}, @smoked paprika{1%tsp}, @garlic powder{1%tsp}.\nCook on low ~{6%hours} or high ~{3%hours}.\nShred with two forks directly in cooker.\nServe in @wholegrain buns{1} with @coleslaw{40%g}.\n> 4 portions. Freezes perfectly. Dead easy \u2014 set and forget.`},
  {id:"r50",category:"dinner",name:"Halloumi & Chickpea Tray Bake",emoji:"\u{1F9C0}",time:"35 min",kcal:540,protein:32,carbs:48,fat:22,prepFriendly:false,dayType:"rest",phases:[1,2,3],
   cook:`---\ntitle: Halloumi Chickpea Tray Bake\nservings: 1\ntags: [dinner, rest-day, vegetarian]\n---\nToss @chickpeas{200%g} drained, @cherry tomatoes{8}, @red pepper{1}, @courgette{1} with @olive oil{1%tbsp}, @cumin{1%tsp}, @smoked paprika{1%tsp}.\nSpread on baking tray. Slice @halloumi{80%g} and lay on top.\nRoast at 200\u00B0C ~{25%min} until golden.\nFinish with @lemon juice{} and @fresh coriander{}.\n> Full vegetarian meal. High in protein from chickpeas and halloumi combined.`},
  {id:"r51",category:"dinner",name:"Cajun Salmon with Quinoa",emoji:"\u{1F41F}",time:"25 min",kcal:560,protein:52,carbs:40,fat:20,prepFriendly:false,dayType:"train",phases:[2,3,4],
   cook:`---\ntitle: Cajun Salmon with Quinoa\nservings: 1\ntags: [dinner, train-day, omega-3]\n---\nCook @quinoa{70%g} in @chicken stock{150%ml} ~{15%min}.\nMix @cajun spice{1%tsp}, @smoked paprika{1/2%tsp}, @black pepper{}.\nRub spice mix on @salmon fillet{150%g}.\nPan sear skin-side up ~{3%min}, flip ~{4%min}.\nServe on quinoa with @grilled asparagus{80%g} and @lemon wedge{}.\n> Complete protein from quinoa + salmon. High omega-3. Quick and impressive.`},
  {id:"r52",category:"dinner",name:"Chilli & Lime Chicken Tacos",emoji:"\u{1F32E}",time:"20 min",kcal:540,protein:50,carbs:46,fat:14,prepFriendly:false,dayType:"train",phases:[2,3,4],
   cook:`---\ntitle: Chilli Lime Chicken Tacos\nservings: 1\ntags: [dinner, train-day, mexican]\n---\nMarinate @chicken breast{150%g} in @lime juice{1}, @chilli flakes{1/2%tsp}, @garlic{1%clove}, @cumin{1/2%tsp}.\nGrill or pan-fry ~{12%min}. Slice thin.\nWarm @corn tortillas{3} in dry pan ~{30%sec} each.\nFill with chicken, @black beans{60%g}, @salsa{2%tbsp}, @avocado{1/4}, @coriander{}.\n> 3 tacos = complete meal. Sub corn for lettuce cups on rest days.`},
  // --- BATCH 3: Post-workout & Snacks ---
  {id:"r53",category:"post-workout",name:"Chocolate Peanut Butter Shake",emoji:"\u{1F36B}",time:"3 min",kcal:380,protein:48,carbs:28,fat:10,prepFriendly:false,dayType:"train",phases:[1,2,3,4],
   cook:`---\ntitle: Chocolate PB Post-Workout Shake\nservings: 1\ntags: [post-workout, train-day]\n---\nBlend @chocolate whey protein{1%scoop}, @natural peanut butter{1%tbsp}, @frozen banana{1/2}, @skimmed milk{300%ml}, @ice cubes{3}.\n> Consume within 30 minutes of training. High leucine for muscle protein synthesis.`},
  {id:"r54",category:"post-workout",name:"Rice Cakes with Salmon",emoji:"\u{1F359}",time:"5 min",kcal:320,protein:36,carbs:28,fat:6,prepFriendly:false,dayType:"train",phases:[1,2,3,4],
   cook:`---\ntitle: Rice Cakes & Smoked Salmon\nservings: 1\ntags: [post-workout, train-day, quick]\n---\nTop @rice cakes{4} with @low-fat cream cheese{2%tbsp}.\nLayer @smoked salmon{120%g} across all 4.\nFinish with @capers{1%tsp} and @lemon juice{}.\n> Simple, low-fat protein refuel. Good for when you can't stomach a full shake.`},
  {id:"r55",category:"post-workout",name:"Tuna on Crackers",emoji:"\u{1F9C7}",time:"3 min",kcal:280,protein:36,carbs:18,fat:6,prepFriendly:false,dayType:"train",phases:[1,2,3,4],
   cook:`---\ntitle: Tuna Crackers Post-Workout\nservings: 1\ntags: [post-workout, train-day, ultra-quick]\n---\nDrain @tuna in spring water{160%g}.\nMix with @cottage cheese{50%g}, @black pepper{}, @lemon juice{1%tsp}.\nSpread on @wholegrain crackers{6}.\n> 3 minutes. Zero cooking. Keeps you fuelled without bloating.`},
  {id:"r56",category:"snack",name:"Edamame with Sea Salt",emoji:"\u{1FAD8}",time:"5 min",kcal:180,protein:18,carbs:10,fat:8,prepFriendly:true,dayType:"any",phases:[1,2,3,4],
   cook:`---\ntitle: Edamame with Sea Salt\nservings: 1\ntags: [snack, any-day, plant-protein]\n---\nBoil @frozen edamame{150%g} ~{4%min} from frozen.\nDrain and season with @sea salt flakes{} and @chilli flakes{pinch}.\n> High plant protein. Excellent fibre. Addictive and satisfying.`},
  {id:"r57",category:"snack",name:"Protein Brownie Bites",emoji:"\u{1F36B}",time:"20 min",kcal:290,protein:24,carbs:22,fat:10,prepFriendly:true,dayType:"any",phases:[1,2,3,4],
   cook:`---\ntitle: Protein Brownie Bites\nservings: 6\ntags: [snack, any-day, batch-prep]\n---\nMix @chocolate protein powder{2%scoops}, @black beans{400%g} drained and mashed, @cocoa powder{2%tbsp}, @eggs{2}, @honey{1%tbsp}.\nFold in @dark chocolate chips{30%g}.\nSpoon into greased #muffin tin{}, filling 6 holes.\nBake at 175\u00B0C ~{15%min}.\n> Makes 6 bites. Refrigerate 5 days. One bite = ~48g protein total across batch.`},
  {id:"r58",category:"snack",name:"Turkey & Avocado Lettuce Cups",emoji:"\u{1F96C}",time:"5 min",kcal:220,protein:26,carbs:6,fat:10,prepFriendly:false,dayType:"rest",phases:[1,2,3,4],
   cook:`---\ntitle: Turkey Avocado Lettuce Cups\nservings: 1\ntags: [snack, rest-day, low-carb, zero-cook]\n---\nSeparate @butter lettuce{4%leaves} as cups.\nFill each with @turkey breast slices{80%g}, @avocado{1/4%sliced}, @cherry tomato{1%halved}.\nDrizzle @lime juice{1%tsp} and crack @black pepper{}.\n> Zero carb. Zero cooking. Maximum protein density per calorie.`},
  {id:"r59",category:"snack",name:"Hummus & Veggie Platter",emoji:"\u{1F955}",time:"5 min",kcal:260,protein:12,carbs:26,fat:12,prepFriendly:true,dayType:"any",phases:[1,2,3],
   cook:`---\ntitle: Hummus & Crudit\u00E9s Platter\nservings: 1\ntags: [snack, any-day]\n---\nPortion @hummus{80%g} into a bowl.\nArrange @carrot sticks{80%g}, @celery sticks{50%g}, @cucumber{50%g}, @red pepper{1/4%sliced} around it.\nDrizzle @olive oil{1/2%tsp} and @paprika{pinch} on hummus.\n> High fibre, satisfying. Add 30g cottage cheese to hummus for protein boost.`},
  {id:"r60",category:"snack",name:"Cottage Cheese & Pineapple",emoji:"\u{1F34D}",time:"2 min",kcal:200,protein:24,carbs:18,fat:2,prepFriendly:true,dayType:"any",phases:[1,2,3,4],
   cook:`---\ntitle: Cottage Cheese with Pineapple\nservings: 1\ntags: [snack, any-day, pre-bed]\n---\nScoop @low-fat cottage cheese{200%g} into bowl.\nTop with @fresh pineapple{80%g} chunks.\nOptional: crack @black pepper{} for contrast.\n> Casein protein \u2014 very slow-digesting. Ideal pre-bed snack for muscle preservation.`},
  // --- BATCH 3: More dinners ---
  {id:"r61",category:"dinner",name:"Lamb Rogan Josh (Lean)",emoji:"\u{1F35B}",time:"50 min",kcal:560,protein:50,carbs:32,fat:20,prepFriendly:true,dayType:"train",phases:[2,3,4],
   cook:`---\ntitle: Lean Lamb Rogan Josh\nservings: 2\ntags: [dinner, train-day, meal-prep, indian]\n---\nBrown @diced lean lamb{300%g} in @oil{1%tsp} in batches. Set aside.\nFry @onion{1} in same pan ~{5%min}. Add @garlic{3%cloves}, @ginger{1%inch}.\nAdd @rogan josh paste{2%tbsp}, stir ~{1%min}.\nReturn lamb with @canned tomatoes{400%g}, @water{100%ml}.\nSimmer on low ~{30%min}. Serve with @basmati rice{70%g}.\n> 2 portions. Freezes perfectly. Trim all fat from lamb first.`},
  {id:"r62",category:"dinner",name:"Sea Bass with Chorizo & Beans",emoji:"\u{1F41F}",time:"25 min",kcal:540,protein:52,carbs:30,fat:22,prepFriendly:false,dayType:"any",phases:[2,3,4],
   cook:`---\ntitle: Sea Bass with Chorizo & Butter Beans\nservings: 1\ntags: [dinner, any-day, quick]\n---\nFry @chorizo{40%g} diced until crispy ~{3%min}. Remove.\nIn same pan fry @butter beans{200%g} drained with @garlic{2%cloves} ~{3%min}.\nAdd @cherry tomatoes{8}, @spinach{80%g}, @white wine{50%ml}. Simmer ~{3%min}.\nScore @sea bass fillets{150%g}, season and fry skin-side down ~{4%min}, flip ~{2%min}.\nServe fish over bean mixture with chorizo crumbled on top.\n> Restaurant-quality in 25 minutes.`},
  {id:"r63",category:"dinner",name:"Spiced Turkey Flatbreads",emoji:"\u{1FAD3}",time:"25 min",kcal:520,protein:52,carbs:44,fat:14,prepFriendly:false,dayType:"train",phases:[1,2,3,4],
   cook:`---\ntitle: Spiced Turkey Flatbreads\nservings: 1\ntags: [dinner, train-day, middle-eastern]\n---\nBrown @turkey mince{200%g} with @garlic{2%cloves}, @cumin{1%tsp}, @coriander{1%tsp}, @allspice{1/2%tsp}.\nSpread @labneh{2%tbsp} on @wholemeal flatbreads{2}.\nTop with turkey mince, @cucumber{4%slices}, @tomato{1/2%diced}, @parsley{}.\nDrizzle @pomegranate molasses{1%tsp}.\n> Quick weeknight meal. High protein, balanced macros.`},
  {id:"r64",category:"dinner",name:"Harissa Baked Eggs",emoji:"\u{1F373}",time:"25 min",kcal:380,protein:28,carbs:22,fat:18,prepFriendly:false,dayType:"rest",phases:[1,2,3],
   cook:`---\ntitle: Harissa Baked Eggs\nservings: 1\ntags: [dinner, rest-day, vegetarian, low-carb]\n---\nSaut\u00E9 @red onion{1/2} and @garlic{2%cloves} in @olive oil{1%tsp}.\nAdd @harissa paste{1%tsp}, @canned tomatoes{400%g}. Simmer ~{10%min}.\nAdd @chickpeas{100%g} drained. Make 3 wells.\nCrack @eggs{3} into wells. Cover ~{8%min} until whites set.\nTop with @feta{30%g} and @parsley{}.\n> Add a diced chicken breast to boost protein to 46g.`},
  {id:"r65",category:"dinner",name:"Protein Pasta Bolognese",emoji:"\u{1F35D}",time:"30 min",kcal:620,protein:56,carbs:60,fat:16,prepFriendly:true,dayType:"train",phases:[1,2,3,4],
   cook:`---\ntitle: High-Protein Pasta Bolognese\nservings: 1\ntags: [dinner, train-day, classic]\n---\nBrown @lean beef mince{150%g} with @onion{1/2}, @garlic{2%cloves}.\nAdd @tomato passata{250%ml}, @tomato paste{1%tbsp}, @beef stock{100%ml}, @mixed herbs{1%tsp}.\nSimmer ~{20%min}. Meanwhile cook @high-protein pasta{80%g} ~{9%min}.\nToss pasta with sauce. Top with @parmesan{20%g}.\n> Use high-protein pasta (25g protein per 100g) to boost macros significantly.`},
  {id:"r66",category:"dinner",name:"Korean Bulgogi Beef",emoji:"\u{1F969}",time:"25 min",kcal:540,protein:52,carbs:40,fat:16,prepFriendly:false,dayType:"train",phases:[2,3,4],
   cook:`---\ntitle: Korean Bulgogi Beef Bowl\nservings: 1\ntags: [dinner, train-day, korean]\n---\nMix @soy sauce{2%tbsp}, @sesame oil{1%tsp}, @brown sugar{1%tsp}, @garlic{2%cloves}, @ginger{1%tsp} for marinade.\nThinly slice @sirloin steak{170%g} and marinate ~{15%min}.\nStir-fry in hot #wok{} ~{4%min} over high heat.\nServe over @steamed rice{60%g} with @kimchi{50%g}, @spring onion{2}, @sesame seeds{1%tsp}.\n> Authentic Korean flavour. Freeze marinated beef for instant weeknight meals.`},
  {id:"r67",category:"dinner",name:"Roast Chicken with Root Veg",emoji:"\u{1F357}",time:"90 min",kcal:580,protein:56,carbs:38,fat:20,prepFriendly:true,dayType:"any",phases:[1,2,3,4],
   cook:`---\ntitle: Roast Chicken with Root Vegetables\nservings: 2\ntags: [dinner, any-day, meal-prep, batch]\n---\nRub @whole chicken thighs{400%g} with @garlic butter{1%tbsp}, @thyme{1%tsp}, @rosemary{1%tsp}, @lemon zest{}.\nSurround with @parsnips{100%g}, @carrots{100%g}, @new potatoes{150%g} all diced.\nRoast at 200\u00B0C ~{80%min} until juices run clear.\nRest ~{10%min} before carving.\n> Sunday roast that powers 2 days of lunches.`},
  {id:"r68",category:"dinner",name:"Moroccan Chicken Tagine",emoji:"\u{1FAD5}",time:"60 min",kcal:560,protein:52,carbs:42,fat:16,prepFriendly:true,dayType:"any",phases:[1,2,3,4],
   cook:`---\ntitle: Moroccan Chicken Tagine\nservings: 2\ntags: [dinner, any-day, meal-prep, moroccan]\n---\nBrown @chicken thighs{300%g} in @olive oil{1%tbsp} in #tagine or pot{}.\nAdd @onion{1}, @garlic{3%cloves}, @ras el hanout{2%tsp}, @cinnamon{1%stick}.\nAdd @canned tomatoes{400%g}, @chicken stock{200%ml}, @dried apricots{4}, @chickpeas{100%g}.\nSimmer on low ~{40%min} until chicken tender.\nServe with @couscous{80%g} and @fresh coriander{}.\n> 2 portions. Beautiful freezer meal.`},
  {id:"r69",category:"dinner",name:"Teriyaki Tofu & Broccoli",emoji:"\u{1F966}",time:"25 min",kcal:420,protein:30,carbs:36,fat:16,prepFriendly:false,dayType:"rest",phases:[1,2,3],
   cook:`---\ntitle: Teriyaki Tofu & Broccoli\nservings: 1\ntags: [dinner, rest-day, vegetarian, vegan]\n---\nPress @firm tofu{200%g} dry, cube and fry until golden ~{8%min}.\nMix @soy sauce{2%tbsp}, @mirin{1%tbsp}, @honey{1%tsp}, @cornstarch{1%tsp} for teriyaki.\nAdd @broccoli florets{150%g} to pan, stir-fry ~{4%min}.\nPour teriyaki sauce over, toss everything ~{2%min}.\nServe over @rice{60%g} with @sesame seeds{1%tsp}.\n> Full vegetarian day option. Add extra tofu to push protein to 40g.`},
  {id:"r70",category:"dinner",name:"Spicy Tuna Steak",emoji:"\u{1F41F}",time:"15 min",kcal:460,protein:56,carbs:16,fat:16,prepFriendly:false,dayType:"rest",phases:[1,2,3,4],
   cook:`---\ntitle: Seared Spicy Tuna Steak\nservings: 1\ntags: [dinner, rest-day, omega-3, low-carb]\n---\nRub @fresh tuna steak{180%g} with @sesame seeds{1%tbsp}, @chilli flakes{1/4%tsp}, @black pepper{}.\nHeat @sesame oil{1%tsp} in pan until smoking.\nSear tuna ~{90%sec} each side \u2014 pink inside.\nServe with @soy sauce{1%tbsp}, @pickled ginger{10%g}, @edamame{80%g}.\n> 15 minutes. Highest protein density. Tuna steak often cheaper than salmon.`},
];

/** All recipes: handcrafted + TheMealDB (deduplicated by id) */
export const BASE_RECIPES: Recipe[] = [
  ...HANDCRAFTED_RECIPES,
  ...MEALDB_RECIPES,
].filter((r, i, a) => a.findIndex((x) => x.id === r.id) === i);
