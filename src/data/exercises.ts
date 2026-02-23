import { Exercise } from '../types/exercise';
import { GITHUB_EXERCISES } from './exercises-github';

export const IMG = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// OPEN-SOURCE EXERCISES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const EX: Exercise[] = [
  // CHEST
  {id:"Barbell_Bench_Press_-_Medium_Grip",name:"Barbell Bench Press",level:"intermediate",equipment:"barbell",primaryMuscles:["chest"],secondaryMuscles:["shoulders","triceps"],
   instructions:["Lie flat on bench, eyes under the bar.","Grip just wider than shoulder-width, retract scapula and arch slightly.","Unrack, lower bar to mid-chest with control over ~2 seconds.","Drive feet into floor, press explosively to lockout.","Keep wrists straight throughout."]},
  {id:"Dumbbell_Bench_Press",name:"Dumbbell Bench Press",level:"beginner",equipment:"dumbbell",primaryMuscles:["chest"],secondaryMuscles:["shoulders","triceps"],
   instructions:["Sit on bench with dumbbells on knees, kick them up as you lie back.","Position at chest height, elbows ~75\u00b0 from torso.","Press upward until arms near lockout, don't touch dumbbells at top.","Lower slowly, feel chest stretch at bottom.","Keep feet flat, core braced."]},
  {id:"Incline_Dumbbell_Press",name:"Incline Dumbbell Press",level:"beginner",equipment:"dumbbell",primaryMuscles:["chest"],secondaryMuscles:["shoulders","triceps"],
   instructions:["Set bench to 30-45\u00b0, sit back with dumbbells at shoulder height.","Elbows at 75\u00b0 from torso, not flared straight out.","Press up and slightly inward, squeeze chest at top.","Lower under control, feel the upper chest stretch.","Don't lock elbows fully at top \u2014 keep tension on chest."]},
  {id:"Incline_Dumbbell_Flyes",name:"Incline Dumbbell Fly",level:"intermediate",equipment:"dumbbell",primaryMuscles:["chest"],secondaryMuscles:["shoulders"],
   instructions:["Lie on incline bench at 30\u00b0, dumbbells above chest with slight elbow bend.","Open arms wide in arc motion until chest fully stretches.","Squeeze chest to bring dumbbells back up \u2014 don't press, hug a tree.","Keep slight bend in elbows throughout entire motion.","Use light weight \u2014 this is a stretch/squeeze exercise."]},
  {id:"Dumbbell_Flyes",name:"Dumbbell Flat Fly",level:"beginner",equipment:"dumbbell",primaryMuscles:["chest"],secondaryMuscles:["shoulders"],
   instructions:["Lie flat, dumbbells above chest, palms facing each other.","Wide arc down until upper arm is parallel to floor.","Feel maximum chest stretch, then squeeze back up.","Maintain slight elbow bend \u2014 never straight.","Control the negative \u2014 2-3 seconds down."]},
  {id:"Close-Grip_Barbell_Bench_Press",name:"Close-Grip Bench Press",level:"intermediate",equipment:"barbell",primaryMuscles:["triceps"],secondaryMuscles:["chest","shoulders"],
   instructions:["Lie on flat bench, grip barbell shoulder-width or narrower.","Unrack and lower bar to lower chest, elbows tight to body.","Press explosively, squeezing triceps at lockout.","Keep elbows from flaring \u2014 they should drag along the torso.","Full ROM \u2014 all the way down, full lockout."]},
  // BACK / LATS
  {id:"Barbell_Bent_Over_Row",name:"Barbell Bent-Over Row",level:"intermediate",equipment:"barbell",primaryMuscles:["middle back"],secondaryMuscles:["biceps","lats","shoulders"],
   instructions:["Stand with barbell, hinge to ~45\u00b0 torso angle, flat back.","Overhand or underhand grip, just outside shoulder width.","Pull bar to belly button, drive elbows behind you.","Squeeze scapula hard at the top \u2014 hold 1 second.","Lower under control, full arm extension at bottom."]},
  {id:"One-Arm_Dumbbell_Row",name:"Single-Arm Dumbbell Row",level:"beginner",equipment:"dumbbell",primaryMuscles:["middle back"],secondaryMuscles:["biceps","lats","shoulders"],
   instructions:["Plant one knee and hand on bench, opposite foot on floor.","Hold dumbbell with arm fully extended, keep back flat.","Pull elbow toward ceiling \u2014 think elbow, not hand.","Squeeze lat at top, lower slowly with control.","Don't rotate torso \u2014 keep hips and shoulders square."]},
  {id:"Dumbbell_Bent_Over_Row",name:"Dumbbell Bent-Over Row",level:"beginner",equipment:"dumbbell",primaryMuscles:["lats"],secondaryMuscles:["biceps","shoulders"],
   instructions:["Hold two dumbbells, hinge forward ~45\u00b0, flat back.","Pull both dumbbells to sides of torso simultaneously.","Drive elbows past your hips, squeeze lats at top.","Lower fully \u2014 arms straight at bottom.","Keep core braced throughout \u2014 don't round lower back."]},
  {id:"Barbell_Deadlift",name:"Barbell Deadlift",level:"intermediate",equipment:"barbell",primaryMuscles:["hamstrings"],secondaryMuscles:["calves","glutes","lower back"],
   instructions:["Bar over mid-foot, shoulder-width stance, toes slightly out.","Hinge down, grip just outside legs, flat back, chest up.","Drive floor away \u2014 leg press motion initially.","Bar stays in contact with shins all the way up.","Lock out hips and knees simultaneously, don't hyperextend back."]},
  {id:"Barbell_Row_-_Overhand",name:"Barbell Pendlay Row",level:"intermediate",equipment:"barbell",primaryMuscles:["lats"],secondaryMuscles:["biceps","middle back","shoulders"],
   instructions:["Bar on floor, torso horizontal to ground \u2014 more strict than bent-over row.","Explode bar from floor to lower chest each rep.","Reset bar to floor each rep \u2014 this is key for Pendlay style.","Maximally strict \u2014 no body English, no hip drive.","Heavy: this builds massive back thickness."]},
  {id:"Renegade_Dumbbell_Row",name:"Renegade Row",level:"intermediate",equipment:"dumbbell",primaryMuscles:["lats"],secondaryMuscles:["abdominals","biceps"],
   instructions:["Plank position with hands on dumbbells, slightly wider than shoulder-width.","Keep hips square \u2014 don't rotate as you row.","Pull one dumbbell to ribcage, lower, repeat other side.","Feet wide for stability, squeeze glutes and core.","Alternate sides for prescribed reps."]},
  // SHOULDERS
  {id:"Barbell_Shoulder_Press",name:"Barbell Overhead Press",level:"intermediate",equipment:"barbell",primaryMuscles:["shoulders"],secondaryMuscles:["triceps"],
   instructions:["Bar in front rack position, hands just outside shoulders.","Brace core hard \u2014 imagine someone's about to punch your stomach.","Press bar vertically, move head back to avoid bar path.","Squeeze glutes and abs throughout \u2014 don't arch excessively.","Full lockout at top, lower to collar bone."]},
  {id:"Dumbbell_Shoulder_Press",name:"Dumbbell Shoulder Press",level:"beginner",equipment:"dumbbell",primaryMuscles:["shoulders"],secondaryMuscles:["triceps"],
   instructions:["Seated or standing, dumbbells at ear height.","Press straight up, keep wrists neutral.","Don't let dumbbells drift forward \u2014 vertical path.","Full lockout, lower until upper arm is parallel to floor.","Control both the press and the descent."]},
  {id:"Dumbbell_Lateral_Raise",name:"Dumbbell Lateral Raise",level:"beginner",equipment:"dumbbell",primaryMuscles:["shoulders"],secondaryMuscles:[],
   instructions:["Stand with light dumbbells at sides, slight forward lean.","Lead with elbows, raise to just above shoulder height.","Tilt thumbs slightly down at top (like pouring water).","Pause 1 second at top, lower slowly over 2-3 seconds.","Never swing \u2014 if swinging, go lighter."]},
  {id:"Bent_Over_Dumbbell_Rear_Delt_Raise",name:"DB Rear Delt Fly",level:"beginner",equipment:"dumbbell",primaryMuscles:["shoulders"],secondaryMuscles:["middle back"],
   instructions:["Hinge forward until torso near parallel, slight knee bend.","Arms hang below chest with slight elbow bend.","Raise arms wide in arc, lead with elbows.","Squeeze rear delts at top \u2014 don't shrug traps.","Lower slowly \u2014 the negative builds the muscle."]},
  {id:"Dumbbell_Front_Raise",name:"Dumbbell Front Raise",level:"beginner",equipment:"dumbbell",primaryMuscles:["shoulders"],secondaryMuscles:[],
   instructions:["Stand with dumbbells in front of thighs, palms down.","Raise one or both arms to shoulder height.","Keep slight elbow bend, don't swing body.","Lower slowly, don't drop arms.","Avoid going too heavy \u2014 this isolates the front delt."]},
  {id:"Dumbbell_Arnold_Press",name:"Arnold Press",level:"intermediate",equipment:"dumbbell",primaryMuscles:["shoulders"],secondaryMuscles:["triceps"],
   instructions:["Start with dumbbells at shoulder height, palms facing you.","As you press up, rotate palms away so they face forward at top.","Reverse the rotation on the way down.","Hits all three delt heads in one movement.","Don't rush \u2014 the rotation is the point."]},
  // BICEPS
  {id:"Barbell_Curl",name:"Barbell Curl",level:"beginner",equipment:"barbell",primaryMuscles:["biceps"],secondaryMuscles:["forearms"],
   instructions:["Stand with barbell, shoulder-width underhand grip.","Keep elbows pinned to sides \u2014 they should not move.","Curl bar up to chest, squeeze hard at top.","Lower fully \u2014 arms straight at bottom.","Don't swing \u2014 if swinging, the weight is too heavy."]},
  {id:"Dumbbell_Bicep_Curl",name:"Dumbbell Bicep Curl",level:"beginner",equipment:"dumbbell",primaryMuscles:["biceps"],secondaryMuscles:["forearms"],
   instructions:["Stand with dumbbells at sides, palms forward.","Curl simultaneously, supinate (rotate) wrists as you lift.","Squeeze bicep hard at the top.","Lower with 2-3 second negative.","Keep upper arms stationary throughout."]},
  {id:"Hammer_Curls",name:"Hammer Curl",level:"beginner",equipment:"dumbbell",primaryMuscles:["biceps"],secondaryMuscles:["forearms"],
   instructions:["Hold dumbbells with neutral grip (thumbs up).","Curl without rotating wrists \u2014 keep the hammer grip throughout.","Elbows fixed at sides, curl to shoulder height.","Lower slowly \u2014 this hits the brachialis and brachioradialis.","Can alternate arms or do simultaneously."]},
  {id:"Alternate_Incline_Dumbbell_Curl",name:"Incline Dumbbell Curl",level:"beginner",equipment:"dumbbell",primaryMuscles:["biceps"],secondaryMuscles:["forearms"],
   instructions:["Set incline bench to 45-60\u00b0, sit back with dumbbells hanging.","Curl alternately \u2014 the incline creates peak stretch.","Supinate at the top for maximum contraction.","Lower fully \u2014 arms completely straight.","The stretch at the bottom is the key benefit here."]},
  {id:"Concentration_Curls",name:"Concentration Curl",level:"beginner",equipment:"dumbbell",primaryMuscles:["biceps"],secondaryMuscles:[],
   instructions:["Sit on bench, elbow braced against inner thigh.","Curl dumbbell from full extension to full contraction.","Squeeze hard at top \u2014 hold 1-2 seconds.","The braced elbow eliminates all cheating.","Go slow \u2014 this is a peak contraction exercise."]},
  // TRICEPS
  {id:"Dumbbell_One_Arm_Triceps_Extension",name:"Dumbbell Overhead Tricep Extension",level:"beginner",equipment:"dumbbell",primaryMuscles:["triceps"],secondaryMuscles:[],
   instructions:["Hold one dumbbell overhead with both hands, elbows vertical.","Lower dumbbell behind head by bending elbows only.","Keep elbows pointing straight up \u2014 don't let them flare.","Press back to full extension, squeeze triceps hard.","The overhead position stretches the long head of the triceps."]},
  {id:"Tricep_Dumbbell_Kickback",name:"Tricep Kickback",level:"beginner",equipment:"dumbbell",primaryMuscles:["triceps"],secondaryMuscles:[],
   instructions:["Hinge forward, upper arm parallel to floor and fixed.","Extend forearm back to full lockout.","Squeeze triceps hard at lockout \u2014 hold 1 second.","Lower slowly \u2014 don't let arm swing down.","Keep upper arm absolutely stationary."]},
  {id:"Skull_Crusher",name:"Skull Crusher (EZ Bar / DB)",level:"intermediate",equipment:"barbell",primaryMuscles:["triceps"],secondaryMuscles:[],
   instructions:["Lie on bench with bar/dumbbells above forehead.","Lower toward forehead by bending only at elbows.","Elbows point toward ceiling throughout.","Press back to full extension, squeeze triceps.","Don't let elbows flare \u2014 track straight."]},
  {id:"Dips_-_Tricep_Version",name:"Tricep Dips",level:"intermediate",equipment:"body only",primaryMuscles:["triceps"],secondaryMuscles:["chest","shoulders"],
   instructions:["Grip parallel bars, body upright and straight.","Lower body by bending elbows \u2014 don't lean forward.","Go until upper arms are parallel to floor.","Press back to full lockout, squeeze triceps.","Lean forward for chest emphasis, stay upright for tricep focus."]},
  // QUADRICEPS
  {id:"Barbell_Full_Squat",name:"Barbell Back Squat",level:"intermediate",equipment:"barbell",primaryMuscles:["quadriceps"],secondaryMuscles:["calves","glutes","hamstrings"],
   instructions:["Bar on traps (high bar) or rear delts (low bar), feet shoulder-width, toes ~30\u00b0 out.","Brace core, pull elbows forward/down to engage upper back.","Sit between heels \u2014 knees track over toes throughout.","Break parallel \u2014 hip crease below knee is depth.","Drive through full foot, hips and knees rise at same rate."]},
  {id:"Front_Barbell_Squat",name:"Front Squat",level:"intermediate",equipment:"barbell",primaryMuscles:["quadriceps"],secondaryMuscles:["calves","glutes"],
   instructions:["Bar in front rack or cross-grip, elbows HIGH.","Feet slightly closer than back squat, very upright torso.","Sit straight down \u2014 front squat is more vertical than back squat.","Drive knees out over toes, chest stays tall throughout.","Heels elevated slightly helps if ankle mobility is limited."]},
  {id:"Dumbbell_Lunges",name:"Dumbbell Lunge",level:"beginner",equipment:"dumbbell",primaryMuscles:["quadriceps"],secondaryMuscles:["calves","glutes","hamstrings"],
   instructions:["Stand holding dumbbells at sides, feet together.","Step forward and lower rear knee toward ground.","Front shin stays vertical \u2014 knee doesn't go past toes.","Push through front heel to return to start.","Keep torso upright \u2014 don't lean forward."]},
  {id:"Dumbbell_Step_Ups",name:"Dumbbell Step-Up",level:"beginner",equipment:"dumbbell",primaryMuscles:["quadriceps"],secondaryMuscles:["calves","glutes"],
   instructions:["Hold dumbbells at sides, face a sturdy bench or box (40-60cm).","Step onto bench with one foot, drive through heel to stand up.","Bring other foot up, then step back down with control.","Don't push off the floor foot \u2014 all work should be the lead leg.","Alternate legs or complete all reps on one side."]},
  {id:"Goblet_Squat",name:"Goblet Squat",level:"beginner",equipment:"kettlebell",primaryMuscles:["quadriceps"],secondaryMuscles:["calves","glutes"],
   instructions:["Hold kettlebell or dumbbell at chest with both hands.","Feet shoulder-width, toes out 30\u00b0.","Squat deep \u2014 use the weight to counterbalance.","Drive knees out at bottom, elbows between knees.","Press through full foot to stand, squeeze glutes at top."]},
  {id:"Dumbbell_Bulgarian_Split_Squat",name:"Bulgarian Split Squat",level:"intermediate",equipment:"dumbbell",primaryMuscles:["quadriceps"],secondaryMuscles:["glutes","hamstrings"],
   instructions:["Place rear foot on bench, front foot far enough forward.","Lower rear knee toward ground \u2014 don't touch.","Front shin stays near-vertical, knee tracks over toes.","Drive through front heel to stand.","Keep torso upright \u2014 don't let it lean forward."]},
  {id:"Walking_Dumbbell_Lunge",name:"Walking Dumbbell Lunge",level:"beginner",equipment:"dumbbell",primaryMuscles:["quadriceps"],secondaryMuscles:["glutes","hamstrings"],
   instructions:["Hold dumbbells at sides, stand tall.","Step forward into lunge, lower rear knee near ground.","Drive through front heel and step forward into next lunge.","Alternate legs continuously \u2014 walking motion.","Keep steps long enough that front shin stays vertical."]},
  // HAMSTRINGS
  {id:"Romanian_Deadlift",name:"Romanian Deadlift",level:"beginner",equipment:"barbell",primaryMuscles:["hamstrings"],secondaryMuscles:["calves","glutes","lower back"],
   instructions:["Hold bar at hips, feet shoulder-width, slight knee bend.","Hinge at hips \u2014 bar drags down legs, back stays flat.","Lower until you feel hamstring stretch (usually mid-shin).","Drive hips forward to return to start \u2014 squeeze glutes.","Don't squat down \u2014 hinge, not squat."]},
  {id:"Stiff-Legged_Barbell_Deadlift",name:"Stiff-Leg Deadlift",level:"intermediate",equipment:"barbell",primaryMuscles:["hamstrings"],secondaryMuscles:["calves","glutes"],
   instructions:["Hold bar with legs nearly straight (slight soft knee).","Hinge forward \u2014 feel a massive hamstring stretch.","Go as low as hamstring flexibility allows with flat back.","Drive hips forward to standing.","More extreme hamstring stretch than Romanian DL."]},
  {id:"Dumbbell_Romanian_Deadlift",name:"Dumbbell Romanian Deadlift",level:"beginner",equipment:"dumbbell",primaryMuscles:["hamstrings"],secondaryMuscles:["calves","glutes"],
   instructions:["Hold dumbbells in front of thighs, feet hip-width.","Hinge at hips, letting dumbbells glide down legs.","Keep back flat, slight knee bend.","Lower until hamstring stretch is felt, usually mid-shin.","Hip drive to return, squeeze glutes at top."]},
  {id:"Kettlebell_Romanian_Deadlift",name:"KB Single-Leg Deadlift",level:"intermediate",equipment:"kettlebell",primaryMuscles:["hamstrings"],secondaryMuscles:["glutes","lower back"],
   instructions:["Stand on one leg, hold KB in opposite hand.","Hinge forward, extending free leg behind.","Keep hips square \u2014 don't rotate open.","Lower KB toward standing foot, back stays flat.","Return to standing, squeeze glute of standing leg."]},
  // GLUTES
  {id:"Kettlebell_Swing",name:"Kettlebell Swing",level:"intermediate",equipment:"kettlebell",primaryMuscles:["glutes"],secondaryMuscles:["hamstrings","lower back","shoulders"],
   instructions:["Feet shoulder-width, KB between feet, hinge to grab.","Hike KB back between legs \u2014 load the hamstrings.","Explode hips forward \u2014 the hips power the swing, not arms.","KB floats to chest height, arms relaxed.","Hinge back on the way down \u2014 same pattern each rep."]},
  {id:"Glute_Bridge",name:"Glute Bridge",level:"beginner",equipment:"body only",primaryMuscles:["glutes"],secondaryMuscles:["hamstrings"],
   instructions:["Lie on back, knees bent, feet flat near glutes.","Drive through heels, raise hips until body forms a straight line.","Squeeze glutes hard at top \u2014 hold 2 seconds.","Lower hips, barely touch floor, repeat.","Add barbell or dumbbell across hips for resistance."]},
  {id:"Glute_Ham_Raise",name:"Glute Ham Raise",level:"intermediate",equipment:"body only",primaryMuscles:["hamstrings"],secondaryMuscles:["calves","glutes"],
   instructions:["Secure feet under something heavy, kneel on padded surface.","Lower torso toward floor by letting knees extend slowly.","Use hamstrings to pull body back up (not hands).","If too hard, use hands for assisted push back up.","One of the most effective hamstring exercises \u2014 brutal when done right."]},
  {id:"Barbell_Hip_Thrust",name:"Barbell Hip Thrust",level:"intermediate",equipment:"barbell",primaryMuscles:["glutes"],secondaryMuscles:["hamstrings","quadriceps"],
   instructions:["Upper back against bench, barbell across hip crease with pad.","Feet flat, knees bent ~90\u00b0.","Drive hips up until body forms straight line from knees to shoulders.","Squeeze glutes maximally at top \u2014 chin tucked.","Lower under control, hips don't touch floor between reps."]},
  {id:"Kettlebell_Sumo_Deadlift_High_Pull",name:"KB Sumo Deadlift High Pull",level:"intermediate",equipment:"kettlebell",primaryMuscles:["glutes"],secondaryMuscles:["hamstrings","shoulders","traps"],
   instructions:["Wide stance with KB between feet, hinge to grip.","Stand explosively, pull KB to chin as you rise.","Elbows flare wide at top.","Lower with control back to floor.","Great power and glute developer combined."]},
  // CORE / ABS
  {id:"Plank",name:"Plank",level:"beginner",equipment:"body only",primaryMuscles:["abdominals"],secondaryMuscles:["shoulders"],
   instructions:["Forearms on floor, elbows under shoulders.","Maintain straight line from head to heels.","Squeeze glutes AND abs \u2014 don't just hang.","Breathe normally \u2014 exhale contracts core more.","If form breaks, stop. Quality over duration."]},
  {id:"Russian_Twist",name:"Russian Twist",level:"beginner",equipment:"body only",primaryMuscles:["abdominals"],secondaryMuscles:["obliques"],
   instructions:["Sit on floor, knees bent, feet elevated or grounded.","Lean back slightly \u2014 feel abs engage.","Rotate torso side to side, touch floor each side.","Add weight (KB, plate) for more resistance.","Keep spine long \u2014 don't collapse."]},
  {id:"Dead_Bug",name:"Dead Bug",level:"beginner",equipment:"body only",primaryMuscles:["abdominals"],secondaryMuscles:["lower back"],
   instructions:["Lie on back, arms pointing to ceiling, knees 90\u00b0 above hips.","Press lower back INTO floor \u2014 this must not lift.","Extend opposite arm and leg until near floor.","Return to start, repeat other side.","The moment your back lifts, the set is over."]},
  {id:"Ab_Roller",name:"Ab Wheel Rollout",level:"intermediate",equipment:"other",primaryMuscles:["abdominals"],secondaryMuscles:["lower back","shoulders"],
   instructions:["Kneel on floor, grip wheel handles, arms extended.","Roll forward slowly, maintaining brace \u2014 don't let hips sag.","Go as far as you can with flat back.","Pull back to start using abs, not shoulders.","Build up range gradually \u2014 this is extremely demanding."]},
  {id:"Side_Bridge",name:"Side Plank",level:"beginner",equipment:"body only",primaryMuscles:["abdominals"],secondaryMuscles:["obliques"],
   instructions:["Side-lying, forearm on floor, elbow under shoulder.","Raise hips \u2014 body forms straight diagonal line.","Hips must not drop \u2014 squeeze obliques.","Hold for time, or add hip dips for reps.","Harder version: raise top leg."]},
  {id:"Pallof_Press",name:"Pallof Press (Band)",level:"beginner",equipment:"bands",primaryMuscles:["abdominals"],secondaryMuscles:["obliques"],
   instructions:["Anchor band at chest height, stand sideways to anchor.","Hold band at chest with both hands.","Press arms straight out \u2014 resist rotation from band.","Hold 2 seconds, bring back to chest.","Core must work to resist rotation \u2014 that's the entire point."]},
  // CALVES
  {id:"Standing_Calf_Raises",name:"Standing Calf Raise",level:"beginner",equipment:"body only",primaryMuscles:["calves"],secondaryMuscles:[],
   instructions:["Stand with balls of feet on edge of step, heels hanging.","Lower heels as far below step as flexibility allows.","Raise up onto tiptoes explosively.","Pause at top \u2014 squeeze calves hard.","Do 20+ reps for best results \u2014 calves need volume."]},
  {id:"Donkey_Calf_Raises",name:"Dumbbell Calf Raise",level:"beginner",equipment:"dumbbell",primaryMuscles:["calves"],secondaryMuscles:[],
   instructions:["Hold dumbbells at sides, stand on edge of step.","Lower heels, then raise up onto balls of feet.","Full range of motion \u2014 stretch and squeeze.","Toes straight for all heads, turned out hits inner head.","20-25 reps minimum."]},
  // COMPOUND / FULL BODY
  {id:"Farmers_Walk",name:"Farmer's Walk",level:"beginner",equipment:"dumbbell",primaryMuscles:["forearms"],secondaryMuscles:["calves","glutes","hamstrings","traps"],
   instructions:["Pick up heavy dumbbells or kettlebells, stand tall.","Walk with purpose \u2014 no swinging, shoulders back.","Maintain upright posture, core braced throughout.","Cover prescribed distance or time.","Drop set: go heavy until grip fails, then lighter."]},
  {id:"Kettlebell_Turkish_Get-Up",name:"Kettlebell Turkish Get-Up",level:"expert",equipment:"kettlebell",primaryMuscles:["shoulders"],secondaryMuscles:["abdominals","glutes","quadriceps"],
   instructions:["Lie holding KB above chest in one hand, arm locked.","Keep KB pointed at ceiling throughout entire movement.","Roll to elbow, then hand, then sweep leg under.","Stand up fully \u2014 reverse the movement to return to floor.","Never lose sight of the KB \u2014 eyes on it throughout."]},
  {id:"Barbell_Hip_Thrust_2",name:"Barbell Hip Thrust",level:"intermediate",equipment:"barbell",primaryMuscles:["glutes"],secondaryMuscles:["hamstrings","quadriceps"],
   instructions:["Sit on floor with upper back against bench edge.","Place padded barbell across hips.","Plant feet flat, drive hips up to parallel.","Chin tucked, squeeze glutes maximally at top.","Lower until just before touching floor, repeat."]},
  {id:"Air_Bike",name:"Air Bike Sprint",level:"beginner",equipment:"other",primaryMuscles:["quadriceps"],secondaryMuscles:["calves","glutes","hamstrings","shoulders"],
   instructions:["Lie on back, hands behind head.","Bring opposite elbow to opposite knee simultaneously.","Extend the other leg straight as you rotate.","Continuous alternating motion without stopping.","Keep lower back pressed to floor throughout."]},
  {id:"Resistance_Band_Pull_Apart",name:"Band Pull-Apart",level:"beginner",equipment:"bands",primaryMuscles:["shoulders"],secondaryMuscles:["middle back"],
   instructions:["Hold band with both hands, arms straight in front.","Pull band apart by squeezing shoulder blades together.","Pause when band touches chest.","Control return \u2014 don't let band snap forward.","High reps (20-30) for shoulder health."]},
  {id:"Face_Pull",name:"Band Face Pull",level:"beginner",equipment:"bands",primaryMuscles:["shoulders"],secondaryMuscles:["biceps"],
   instructions:["Anchor band at head height.","Grip with both hands, palms down. Step back.","Pull to face \u2014 external rotate so thumbs point back.","Elbows stay high throughout \u2014 don't drop them.","Essential for rotator cuff health."]},
  {id:"Barbell_Full_Squat_2",name:"Bulgarian Split Squat",level:"intermediate",equipment:"barbell",primaryMuscles:["quadriceps"],secondaryMuscles:["glutes","hamstrings"],
   instructions:["Rear foot elevated on bench, front foot forward.","Keep torso upright.","Lower rear knee toward floor under control.","Drive through front heel to return.","Most demanding single-leg exercise \u2014 builds imbalance resistance."]},
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FITBOD-SOURCED EXERCISES (src:"fitbod") -- excluded from RELEASE_BUILD
// Exercise names, muscles, equipment are factual fitness knowledge.
// Instructions are original descriptions not copied from Fitbod.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const FITBOD_EX: Exercise[] = [
  // CHEST
  {id:"Chest_Dip",name:"Chest Dip",level:"intermediate",equipment:"body only",primaryMuscles:["chest"],secondaryMuscles:["triceps","shoulders"],src:"fitbod",
   instructions:["Use parallel bars, lean torso forward 30\u00b0.","Lower until upper arms parallel to floor \u2014 full chest stretch.","Drive through chest to push back up, maintaining the forward lean.","Don't lock elbows fully at top \u2014 keep tension on chest.","Add weight belt when bodyweight reps exceed 12."]},
  {id:"Push_Up",name:"Push-Up",level:"beginner",equipment:"body only",primaryMuscles:["chest"],secondaryMuscles:["triceps","shoulders"],src:"fitbod",
   instructions:["Hands slightly wider than shoulder-width, body in straight line.","Lower chest to floor, elbows at ~45\u00b0 from torso.","Press explosively to lockout, squeeze chest at top.","Full range \u2014 chest nearly touches floor each rep.","Elevate feet to target upper chest; hands elevated for lower."]},
  {id:"Decline_Dumbbell_Press",name:"Decline DB Press",level:"beginner",equipment:"dumbbell",primaryMuscles:["chest"],secondaryMuscles:["triceps","shoulders"],src:"fitbod",
   instructions:["Set bench to -15\u00b0 decline. Lie back, feet secured.","Dumbbells at chest level, elbows ~75\u00b0 from torso.","Press up and slightly inward. Squeeze chest at top.","Lower slowly \u2014 you can go heavier than flat bench here.","Great for developing lower/outer chest thickness."]},
  {id:"Cable_Chest_Fly",name:"Cable Chest Fly",level:"beginner",equipment:"other",primaryMuscles:["chest"],secondaryMuscles:["shoulders"],src:"fitbod",
   instructions:["Set cables at shoulder height. Stand between the stacks.","Arc handles together at chest center with slight elbow bend.","Squeeze chest hard at center \u2014 holds better tension than DBs.","Control the opening \u2014 feel the stretch at full extension.","Set cables higher for lower chest, lower for upper chest."]},
  {id:"Dumbbell_Pullover",name:"DB Pullover",level:"intermediate",equipment:"dumbbell",primaryMuscles:["chest"],secondaryMuscles:["lats","triceps"],src:"fitbod",
   instructions:["Lie perpendicular on bench, shoulders on pad, hips lower.","Hold one dumbbell with both hands above chest.","Arc it back and down behind head as far as comfortable.","Pull back over chest using lats and chest together.","Keep slight elbow bend throughout \u2014 don't straighten arms."]},
  // BACK
  {id:"Pull_Up",name:"Pull-Up",level:"intermediate",equipment:"body only",primaryMuscles:["lats"],secondaryMuscles:["biceps","middle back"],src:"fitbod",
   instructions:["Overhand grip just wider than shoulders, dead hang start.","Initiate with lat depression \u2014 pull shoulder blades down and back.","Pull until chin clears bar, chest to bar if possible.","Lower to full dead hang \u2014 complete ROM matters.","Add weight belt once you can do 10+ clean reps."]},
  {id:"Chin_Up",name:"Chin-Up",level:"intermediate",equipment:"body only",primaryMuscles:["lats"],secondaryMuscles:["biceps"],src:"fitbod",
   instructions:["Underhand (supinated) grip, shoulder-width.","Dead hang start. Pull elbows toward hips \u2014 not just up.","Chin over bar \u2014 squeeze biceps and lats hard at top.","Lower slowly to full extension \u2014 2-3 second descent.","Easier than pull-ups for most \u2014 excellent lat and bicep builder."]},
  {id:"Face_Pull_Fitbod",name:"Face Pull (Band/Cable)",level:"beginner",equipment:"bands",primaryMuscles:["shoulders"],secondaryMuscles:["middle back"],src:"fitbod",
   instructions:["Anchor band at face height. Grip with both hands, palms down.","Pull toward face, spreading hands apart at end of movement.","External rotate \u2014 elbows high, hands finish beside ears.","Squeeze rear delts and external rotators hard. Pause 1 second.","Critical for shoulder health and posture \u2014 do these every session."]},
  {id:"T_Bar_Row",name:"T-Bar Row",level:"intermediate",equipment:"barbell",primaryMuscles:["middle back"],secondaryMuscles:["biceps","lats"],src:"fitbod",
   instructions:["Straddle loaded barbell end in landmine or corner. Bend to ~45\u00b0.","Use close V-grip handle or hands close together on bar.","Pull bar to chest, squeeze scapula together at top.","Lower under control to full arm extension.","One of the best exercises for back thickness."]},
  {id:"Good_Morning",name:"Good Morning",level:"intermediate",equipment:"barbell",primaryMuscles:["hamstrings"],secondaryMuscles:["glutes","lower back"],src:"fitbod",
   instructions:["Bar across upper traps, feet shoulder-width.","Brace core hard, hinge forward at hips with soft knee bend.","Lower until torso near-parallel or hamstring limit.","Drive hips forward to return, squeeze glutes at top.","Treat like a squat for setup \u2014 spine must stay neutral."]},
  {id:"Back_Extension",name:"Back Extension",level:"beginner",equipment:"body only",primaryMuscles:["lower back"],secondaryMuscles:["glutes","hamstrings"],src:"fitbod",
   instructions:["Lock feet in hyperextension station, body at ~45\u00b0.","Lower torso with flat back until comfortable stretch.","Raise back to horizontal \u2014 don't hyperextend past level.","Hold 1 second at top, squeeze glutes.","Add plate held at chest for resistance progression."]},
  {id:"Seated_Cable_Row",name:"Seated Cable Row",level:"beginner",equipment:"other",primaryMuscles:["middle back"],secondaryMuscles:["biceps","lats"],src:"fitbod",
   instructions:["Sit at cable station, feet on pads, slight knee bend.","Torso upright with neutral spine throughout.","Pull handles to lower abdomen, squeeze shoulder blades.","Extend arms fully between reps \u2014 don't shortchange the stretch.","Don't lean back to pull \u2014 torso stays upright."]},
  // SHOULDERS
  {id:"Cable_Lateral_Raise",name:"Cable Lateral Raise",level:"beginner",equipment:"other",primaryMuscles:["shoulders"],secondaryMuscles:[],src:"fitbod",
   instructions:["Cable at floor level, hold handle with far hand.","Raise arm to the side to just above shoulder height.","Lead with elbow, slight forward lean for better side delt hit.","Lower slowly \u2014 3 second negative is ideal.","Constant tension makes this superior to DB lateral raises."]},
  {id:"Upright_Row",name:"Upright Row",level:"intermediate",equipment:"barbell",primaryMuscles:["shoulders"],secondaryMuscles:["traps","biceps"],src:"fitbod",
   instructions:["Hold barbell in front of thighs, hands shoulder-width.","Pull straight up, leading with elbows \u2014 elbows stay higher than wrists.","Pull to chin height \u2014 no higher.","Squeeze deltoids and traps at top.","Use wide grip and moderate weight to reduce shoulder impingement risk."]},
  {id:"Push_Press",name:"Push Press",level:"intermediate",equipment:"barbell",primaryMuscles:["shoulders"],secondaryMuscles:["triceps","quadriceps"],src:"fitbod",
   instructions:["Bar in front rack, brace core.","Small dip \u2014 quarter squat depth.","Explode hips up, use leg drive to start bar moving.","Press arms to full lockout overhead as hips extend.","Allows heavier loading than strict press \u2014 great for shoulder strength."]},
  // BICEPS
  {id:"Preacher_Curl",name:"Preacher Curl",level:"beginner",equipment:"barbell",primaryMuscles:["biceps"],secondaryMuscles:["forearms"],src:"fitbod",
   instructions:["Pad chest against preacher bench, arms draped over pad.","Grip EZ-bar or barbell with underhand grip, arms fully extended.","Curl up \u2014 the pad prevents all swinging.","Squeeze at top, lower slowly to full arm extension.","One of the best isolation exercises for bicep peak."]},
  {id:"Cable_Bicep_Curl",name:"Cable Bicep Curl",level:"beginner",equipment:"other",primaryMuscles:["biceps"],secondaryMuscles:["forearms"],src:"fitbod",
   instructions:["Set cable at floor, grip straight bar with underhand grip.","Curl up with elbows fixed at sides \u2014 don't let them travel forward.","Constant tension throughout entire ROM \u2014 advantage over dumbbells.","Lower fully \u2014 complete stretch at bottom.","Use rope for hammer curl variation. Use EZ-bar to reduce wrist stress."]},
  {id:"Drag_Curl",name:"Drag Curl",level:"intermediate",equipment:"barbell",primaryMuscles:["biceps"],secondaryMuscles:[],src:"fitbod",
   instructions:["Hold barbell at thighs, drag it up the body.","Elbows move backward as you curl \u2014 not forward like normal.","Bar drags up along torso \u2014 keeps front delts out of the movement.","Slower, more controlled than regular curl.","Targets the long head of biceps \u2014 builds the peak."]},
  {id:"Zottman_Curl",name:"Zottman Curl",level:"intermediate",equipment:"dumbbell",primaryMuscles:["biceps"],secondaryMuscles:["forearms"],src:"fitbod",
   instructions:["Supinate (palms up) on the way up \u2014 standard curl motion.","Rotate to pronated grip (palms down) at the very top.","Lower with pronated grip \u2014 loads forearms and brachioradialis eccentrically.","Rotate back to supinated at the bottom for next rep.","Trains both biceps and forearms in a single movement \u2014 very efficient."]},
  {id:"Reverse_Curl",name:"Reverse Curl",level:"beginner",equipment:"barbell",primaryMuscles:["biceps"],secondaryMuscles:["forearms"],src:"fitbod",
   instructions:["Hold bar with overhand (pronated) grip at thighs.","Curl up with elbows fixed \u2014 forearms and brachioradialis activate more.","Squeeze at top, lower under control.","Use EZ-bar for less wrist stress than straight bar.","Builds forearm and brachialis thickness \u2014 pairs well with regular curls."]},
  // TRICEPS
  {id:"Rope_Tricep_Pushdown",name:"Rope Tricep Pushdown",level:"beginner",equipment:"other",primaryMuscles:["triceps"],secondaryMuscles:[],src:"fitbod",
   instructions:["Cable high, rope attachment. Stand facing machine.","Elbows fixed at sides. Push rope down AND out at bottom.","Spread the rope at the very bottom \u2014 maximizes tricep contraction.","Control the return \u2014 elbows stay at sides on the way back up.","The spreading at bottom is key \u2014 better than straight bar."]},
  {id:"Overhead_Cable_Tricep_Ext",name:"Overhead Cable Tricep Extension",level:"beginner",equipment:"other",primaryMuscles:["triceps"],secondaryMuscles:[],src:"fitbod",
   instructions:["Cable set high, turn away from it, grip rope overhead.","Extend arms forward with elbows fixed close to ears.","Overhead position stretches the tricep long head fully.","Squeeze at lockout \u2014 hold 1 second.","Hits the long head better than pushdowns alone."]},
  {id:"Band_Tricep_Pushdown",name:"Band Tricep Pushdown",level:"beginner",equipment:"bands",primaryMuscles:["triceps"],secondaryMuscles:[],src:"fitbod",
   instructions:["Anchor band above head height. Face anchor point.","Push band down with both hands, elbows fixed at sides.","Full extension at bottom \u2014 squeeze triceps hard.","Resistance increases at bottom \u2014 different stimulus to cables.","Great finisher: 3x20 after main tricep work."]},
  {id:"JM_Press",name:"JM Press",level:"intermediate",equipment:"barbell",primaryMuscles:["triceps"],secondaryMuscles:["chest"],src:"fitbod",
   instructions:["Lie on flat bench, bar over lower chest.","Lower toward throat in skull-crusher path \u2014 elbows pointing toward ceiling.","Stop 4 inches above throat, then press back at angle.","Hybrid between skull crusher and close-grip bench.","Very effective for heavy tricep loading \u2014 favored by powerlifters."]},
  // QUADS
  {id:"Leg_Press",name:"Leg Press",level:"beginner",equipment:"other",primaryMuscles:["quadriceps"],secondaryMuscles:["glutes","hamstrings"],src:"fitbod",
   instructions:["Sit in machine, feet shoulder-width on platform.","Lower sled until legs reach ~90\u00b0 \u2014 don't let knees cave inward.","Press to near-lockout \u2014 don't fully lock knees.","High feet = more glute. Low feet = more quad.","Can load very heavy safely \u2014 excellent for quad volume work."]},
  {id:"Hack_Squat",name:"Hack Squat (Machine)",level:"intermediate",equipment:"other",primaryMuscles:["quadriceps"],secondaryMuscles:["glutes","hamstrings"],src:"fitbod",
   instructions:["Shoulders under pads, back flat against pad, feet shoulder-width.","Lower until thighs past parallel \u2014 knees track over toes.","Press back up through full foot \u2014 don't fully lock knees.","Plates under heels shifts emphasis to quads.","More controlled than barbell squat \u2014 great for adding quad volume."]},
  {id:"Wall_Sit",name:"Wall Sit",level:"beginner",equipment:"body only",primaryMuscles:["quadriceps"],secondaryMuscles:["glutes"],src:"fitbod",
   instructions:["Back flat against wall, slide down until thighs parallel.","Knees at 90\u00b0, feet flat on floor directly under knees.","Hold for prescribed time \u2014 don't let form break.","Add weight (plate on thighs) for progression.","Isometric endurance \u2014 excellent for circuits and conditioning."]},
  {id:"Pause_Squat",name:"Pause Squat",level:"intermediate",equipment:"barbell",primaryMuscles:["quadriceps"],secondaryMuscles:["glutes","hamstrings"],src:"fitbod",
   instructions:["Set up exactly like regular back squat.","Descend to full depth, PAUSE 2-3 full seconds at the bottom.","No bounce \u2014 control completely, then drive up.","Eliminates the stretch reflex \u2014 builds raw bottom-position strength.","Use 70-80% of your regular squat weight."]},
  // HAMSTRINGS
  {id:"Lying_Leg_Curl",name:"Lying Leg Curl (Machine)",level:"beginner",equipment:"other",primaryMuscles:["hamstrings"],secondaryMuscles:["calves"],src:"fitbod",
   instructions:["Lie face down, ankle roller pad above heels.","Curl legs up \u2014 bring pad toward glutes as far as possible.","Squeeze hamstrings at top, pause 1 second.","Lower with 2-3 second negative \u2014 don't just let it drop.","Don't let hips rise off pad \u2014 that reduces hamstring work."]},
  {id:"Nordic_Hamstring_Curl",name:"Nordic Hamstring Curl",level:"expert",equipment:"body only",primaryMuscles:["hamstrings"],secondaryMuscles:["glutes"],src:"fitbod",
   instructions:["Kneel on pad, ankles secured under bench or by a partner.","Lower body forward \u2014 resist with hamstrings the whole way.","Use hands to push up when hamstrings can't control further.","Eccentric-focused \u2014 among the most effective hamstring exercises.","Build up slowly \u2014 start with partial reps before full range."]},
  {id:"Sumo_Deadlift",name:"Sumo Deadlift",level:"intermediate",equipment:"barbell",primaryMuscles:["hamstrings"],secondaryMuscles:["glutes","quadriceps","lower back"],src:"fitbod",
   instructions:["Wide stance (2x shoulder-width), toes out ~45\u00b0.","Grip bar inside legs, narrow overhand or mixed grip.","Push knees out tracking over toes as you pull.","More upright torso than conventional \u2014 less lower back stress.","Great variation for those with long torsos or tight hips."]},
  {id:"Seated_Leg_Curl",name:"Seated Leg Curl (Machine)",level:"beginner",equipment:"other",primaryMuscles:["hamstrings"],secondaryMuscles:[],src:"fitbod",
   instructions:["Sit in machine, thigh pad across lower thighs, ankle pad resting.","Curl legs down and under the seat as far as possible.","Seated position creates better stretch on hamstrings than lying.","Squeeze at bottom, control the return.","Excellent for the outer hamstring head \u2014 combine with lying curls."]},
  // GLUTES
  {id:"Cable_Glute_Kickback",name:"Cable Glute Kickback",level:"beginner",equipment:"other",primaryMuscles:["glutes"],secondaryMuscles:["hamstrings"],src:"fitbod",
   instructions:["Ankle cuff on, cable at floor level. Face the machine.","Kick leg back and up \u2014 extend at the hip.","Squeeze glute maximally at top. Pause 1 second.","Keep hips square \u2014 don't rotate or tilt pelvis.","Lower under control \u2014 don't let cable drag leg forward."]},
  {id:"Fire_Hydrant",name:"Fire Hydrant",level:"beginner",equipment:"body only",primaryMuscles:["glutes"],secondaryMuscles:["core"],src:"fitbod",
   instructions:["On all fours, hands under shoulders, knees under hips.","Raise one knee out to the side \u2014 maintaining the 90\u00b0 bend.","Keep hips level \u2014 don't tilt away from the working leg.","Squeeze glute medius at top \u2014 hold 1 second.","Add ankle weight or loop band above knees for resistance."]},
  {id:"Lateral_Band_Walk",name:"Lateral Band Walk",level:"beginner",equipment:"bands",primaryMuscles:["glutes"],secondaryMuscles:["quadriceps"],src:"fitbod",
   instructions:["Band around ankles or above knees. Quarter-squat position.","Step sideways \u2014 lead foot out, then trail foot follows.","Keep hips low and constant tension in band throughout.","Feet should never fully come together \u2014 maintain tension.","15 steps each direction, 3 rounds as activation."]},
  {id:"Frog_Pump",name:"Frog Pump",level:"beginner",equipment:"body only",primaryMuscles:["glutes"],secondaryMuscles:["hamstrings"],src:"fitbod",
   instructions:["Lie on back, soles of feet pressed together, knees open like a frog.","Drive hips up, squeezing glutes at the very top.","Frog position reduces hamstring involvement \u2014 more direct glute burn.","20-30 reps as a glute activation or finisher.","Add barbell across hips for resistance."]},
  // CALVES
  {id:"Seated_Calf_Raise_Machine",name:"Seated Calf Raise",level:"beginner",equipment:"other",primaryMuscles:["calves"],secondaryMuscles:[],src:"fitbod",
   instructions:["Sit in machine, pad resting on lower thighs.","Lower heels as far below platform as flexibility allows.","Raise up onto balls of feet \u2014 full ROM.","The seated position targets the soleus (deep calf) more than standing.","20+ slow reps \u2014 calves respond to full stretch and high volume."]},
  {id:"Box_Jump",name:"Box Jump",level:"intermediate",equipment:"other",primaryMuscles:["quadriceps"],secondaryMuscles:["calves","glutes","hamstrings"],src:"fitbod",
   instructions:["Stand facing a sturdy box (40-60cm). Athletic stance.","Dip into quarter squat, swing arms back then explode.","Land softly in partial squat on top of box.","Stand fully upright on the box, then step back down.","Focus on max height and soft landing \u2014 rest fully between jumps."]},
  // CORE
  {id:"Hanging_Knee_Raise",name:"Hanging Knee Raise",level:"beginner",equipment:"body only",primaryMuscles:["abdominals"],secondaryMuscles:["hip flexors"],src:"fitbod",
   instructions:["Hang from pull-up bar in dead hang.","Curl knees toward chest \u2014 posterior pelvic tilt to engage abs.","Don't just swing legs \u2014 actively crunch the abs.","Lower under control \u2014 avoid swinging.","Progress to straight leg raises as you get stronger."]},
  {id:"Dragon_Flag",name:"Dragon Flag",level:"expert",equipment:"body only",primaryMuscles:["abdominals"],secondaryMuscles:["lower back","shoulders"],src:"fitbod",
   instructions:["Lie on flat bench. Grip bench behind head with both hands.","Raise entire body to near-vertical \u2014 only shoulders stay on bench.","Lower body in a rigid plank \u2014 hips absolutely must not sag.","Control the descent all the way to the bottom.","Build up with negatives-only before attempting full reps."]},
  {id:"Hollow_Body_Hold",name:"Hollow Body Hold",level:"intermediate",equipment:"body only",primaryMuscles:["abdominals"],secondaryMuscles:["hip flexors"],src:"fitbod",
   instructions:["Lie flat, press lower back completely into floor.","Arms overhead, legs straight and low \u2014 form a dish shape.","If lower back lifts, raise legs higher until it stays down.","Hold for time \u2014 quality over duration.","Foundation of gymnastics strength \u2014 excellent anti-extension exercise."]},
  {id:"Cable_Woodchop",name:"Cable Woodchop",level:"beginner",equipment:"other",primaryMuscles:["abdominals"],secondaryMuscles:["obliques","shoulders"],src:"fitbod",
   instructions:["Cable set high. Stand sideways, reach across to grip handle.","Pull cable diagonally down and across body \u2014 rotate torso.","Keep arms relatively straight \u2014 torso drives the movement.","Control the return \u2014 resist the cable's pull.","Train both directions for oblique balance."]},
  {id:"L_Sit",name:"L-Sit",level:"expert",equipment:"body only",primaryMuscles:["abdominals"],secondaryMuscles:["triceps","hip flexors"],src:"fitbod",
   instructions:["Support body on parallel bars or floor (fists or plates).","Raise legs to parallel with floor \u2014 horizontal L shape.","Legs as straight as possible \u2014 keep pressing down hard.","Hold for time \u2014 start with 5-10 seconds.","One of the most demanding core exercises \u2014 builds serious strength."]},
  {id:"Landmine_Rotation",name:"Landmine Rotation",level:"intermediate",equipment:"barbell",primaryMuscles:["abdominals"],secondaryMuscles:["obliques","shoulders"],src:"fitbod",
   instructions:["Anchor barbell in landmine or corner. Hold end with both hands overhead.","Rotate the bar from one side of the body to the other in a wide arc.","Slight hip hinge as bar comes to each side.","Core both drives and resists the rotation.","Load bar with plate for resistance \u2014 excellent rotational trainer."]},
  // CONDITIONING / FULL BODY
  {id:"Burpee",name:"Burpee",level:"beginner",equipment:"body only",primaryMuscles:["quadriceps"],secondaryMuscles:["chest","shoulders","abdominals"],src:"fitbod",
   instructions:["From standing, drop hands to floor beside feet.","Jump or step feet back to push-up position \u2014 perform 1 push-up.","Jump or step feet forward to hands.","Explode upward \u2014 jump and clap overhead.","Scale by removing push-up or jump. Add weight vest when easy."]},
  {id:"Mountain_Climber",name:"Mountain Climber",level:"beginner",equipment:"body only",primaryMuscles:["abdominals"],secondaryMuscles:["shoulders","quadriceps"],src:"fitbod",
   instructions:["High push-up position \u2014 arms straight, body in plank.","Drive one knee toward chest, then rapidly switch feet.","Keep hips level \u2014 don't pike up or let them sink.","Fast = cardio/conditioning. Slow = core stability emphasis.","30 seconds of fast mountain climbers is serious conditioning."]},
  {id:"Jump_Squat",name:"Jump Squat",level:"beginner",equipment:"body only",primaryMuscles:["quadriceps"],secondaryMuscles:["glutes","calves"],src:"fitbod",
   instructions:["Feet shoulder-width. Squat to parallel depth.","Explode upward \u2014 maximum height.","Land softly, absorbing through quads and glutes.","Elastic return \u2014 minimal pause at bottom.","Add light dumbbells or barbell for loaded variation."]},
  {id:"Bear_Crawl",name:"Bear Crawl",level:"beginner",equipment:"body only",primaryMuscles:["shoulders"],secondaryMuscles:["abdominals","quadriceps"],src:"fitbod",
   instructions:["On all fours, knees hovering 2 inches off floor.","Move opposite arm and leg forward simultaneously.","Keep hips low and level \u2014 don't let them rise.","Core works constantly to maintain the hovering position.","Crawl 20m forward and back = 1 set. Add vest for progression."]},
  {id:"Battle_Rope_Waves",name:"Battle Rope Waves",level:"beginner",equipment:"other",primaryMuscles:["shoulders"],secondaryMuscles:["abdominals","quadriceps"],src:"fitbod",
   instructions:["Stand in athletic stance holding one rope end in each hand.","Alternate arms up and down rapidly \u2014 create continuous waves.","Slight squat position maintained throughout \u2014 don't stand up.","30-40 seconds maximum effort = great conditioning stimulus.","Slam both arms simultaneously for alternating variation."]},
  {id:"Sled_Push",name:"Sled Push",level:"intermediate",equipment:"other",primaryMuscles:["quadriceps"],secondaryMuscles:["glutes","calves","shoulders"],src:"fitbod",
   instructions:["Lean into sled handles at ~45\u00b0, arms extended.","Drive legs with short powerful steps \u2014 stay low.","Keep hips below shoulders throughout the push.","Push prescribed distance then rest fully.","Zero eccentric = very low soreness \u2014 can train frequently."]},
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MERGED DATABASE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** RELEASE_BUILD flag: set true to exclude fitbod-sourced exercises */
const RELEASE_BUILD = false;

/** Merged exercise database (deduplicated by id) — our curated exercises take priority */
export const EXERCISE_DB: Exercise[] = [
  ...EX,
  ...(RELEASE_BUILD ? [] : FITBOD_EX),
  ...GITHUB_EXERCISES,
].filter((e, i, a) => a.findIndex((x) => x.id === e.id) === i);

/** Find up to 10 exercises that share the same primary muscle group */
export function getAlternatives(exercise: Exercise): Exercise[] {
  const muscles = exercise.primaryMuscles || [];
  return EXERCISE_DB.filter(
    (ex) =>
      ex.id !== exercise.id &&
      ex.name !== exercise.name &&
      muscles.some((m) =>
        ex.primaryMuscles.some((pm) => pm.toLowerCase() === m.toLowerCase())
      )
  ).slice(0, 10);
}
