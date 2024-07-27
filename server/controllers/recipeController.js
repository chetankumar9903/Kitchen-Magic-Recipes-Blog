require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");
const details = require("../models/form");

/*
get
homepage
 */

exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);

    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const thai = await Recipe.find({ category: "Thai" }).limit(limitNumber);
    const american = await Recipe.find({ category: "American" }).limit(
      limitNumber
    );
    const chinese = await Recipe.find({ category: "Chinese" }).limit(
      limitNumber
    );

    const food = { latest, thai, american, chinese };

    res.render("index", { title: "Cooking Blog - Home", categories, food });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};


/*
get / about
about

 */
exports.aboutpage = async (req, res) => {
  try {
    
    res.render("about", {
      title: "Cooking Blog - About",
    
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/*
get / contact
contact

 */
exports.contactpage = async (req, res) => {
  try {
    
    res.render("contact", {
      title: "Cooking Blog - Contact",
    
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};


/*
get / categories
Categories
 */

exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);

    res.render("categories", {
      title: "Cooking Blog - Categories",
      categories,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /categories/:id
 * Categories By Id
 */
exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ category: categoryId }).limit(
      limitNumber
    );
    res.render("categories", {
      title: "Cooking Blog - Categoreis",
      categoryById,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /recipe/:id
 * Recipe
 */
exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render("recipe", { title: "Cooking Blog - Recipe", recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * POST /search
 * Search
 */
exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    // res.json(recipe);
    res.render("search", { title: "Cooking Blog - Search", recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /explore-latest
 * Explplore Latest
 */
exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("explore-latest", {
      title: "Cooking Blog - Explore Latest",
      recipe,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /explore-random
 * Explore Random as JSON
 */
exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    // res.json(recipe);
    res.render("explore-random", {
      title: "Cooking Blog - Explore Random",
      recipe,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /submit-recipe
 * Submit Recipe
 */
exports.submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("submit-recipe", {
    title: "Cooking Blog - Submit Recipe",
    infoErrorsObj,
    infoSubmitObj,
  });
  // res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe' } );
};

/**
 * POST /submit-recipe
 * Submit Recipe
 */
exports.submitRecipeOnPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No Files were uploaded.");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath =
        require("path").resolve("./") + "/public/uploads/" + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      });
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName,
    });

    await newRecipe.save();

    req.flash("infoSubmit", "Recipe has been added.");
    res.redirect("/submit-recipe");
  } catch (error) {
    // res.json(error);
    req.flash("infoErrors", error);
    res.redirect("/submit-recipe");
  }
};

/**
 * POST /from daetails
 * Submit form details
 */
exports.contactpagedetails = async (req, res) => {
 try {
  const newdetails = new details({
    name: req.body.name,
    
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message,
    
  });

  await newdetails.save();
  res.redirect("/contact");
 } catch (error) {
  console.log("error occured")
  res.redirect("/contact")
  
 }
};


// async function insertForm() {
//   try {
//     await details.insertMany([
//       {
//         "name": "Chetan kumar",
//         "email": "abc@gmail.com",
//         "phone":"8899990357",
//         "message":"maintian site"
//       },
//     ]);
//     console.log('Data inserted successfully');
//   } catch (error) {
//     console.error('Error inserting data:', error);
//   } 
// }

// // Call the insertForm function to perform the insertion
// insertForm();



// Delete Recipe
// async function deleteRecipe(){
//   try {
//     await Recipe.deleteMany({ name: 'Recipe Name Goes Here' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();

// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();

// Dummy data TO Explain

// async function insertDummyCategoryData() {
//     try {
//         await Category.insertMany([
//             {
//                 "name": "Thai",
//                 "img": "thai-food.jpg"
//             },
//             {
//                 "name": "American",
//                 "img": "american-food.jpg"
//             },
            // {
            //     "name": "Chinese",
            //     "img": "chinese-food.jpg"
            // },
//             {
//                 "name": "Mexican",
//                 "img": "mexican-food.jpg"
//             },
//             {
//                 "name": "Indian",
//                 "img": "indian-food.jpg"
//             },
//             {
//                 "name": "Spanish",
//                 "img": "spanish-food.jpg"
//             }
//         ]);
//     } catch (error) {
//         console.log('err', error);  // Fixed the concatenation issue here
//     }
// }

// insertDummyCategoryData();

//recipe data
// async function insertDymmyRecipeData() {
//   try {
//     await Recipe.insertMany([

//       {
//         "name": "Tom Daley's sweet & sour chicken",
//         "description": `Drain the juices from the tinned fruit into a bowl, add the soy and fish sauces, then whisk in 1 teaspoon of cornflour until smooth. Chop the pineapple and peaches into bite-sized chunks and put aside.
// Pull off the chicken skin, lay it flat in a large, cold frying pan, place on a low heat and leave for a few minutes to render the fat, turning occasionally. Once golden, remove the crispy skin to a plate, adding a pinch of sea salt and five-spice.
// Meanwhile, slice the chicken into 3cm chunks and place in a bowl with 1 heaped teaspoon of five-spice, a pinch of salt, 1 teaspoon of cornflour and half the lime juice. Peel, finely chop and add 1 clove of garlic, then toss to coat.
// Next, prep the veg: trim and roughly slice the asparagus and broccoli at an angle, leaving the pretty tips intact. Peel the onion, cut into quarters and break apart into petals, then peel the remaining clove of garlic and finely slice with the chillies. Deseed and roughly chop the peppers, then peel and matchstick the ginger.
// Place the frying pan on a high heat and cook the chicken for 5 to 6 minutes, or until golden and cooked through, turning halfway, then leave on a low heat.
// Meanwhile, place a wok on a high heat and scatter in the pepper and onion to scald and char for 5 minutes. Add 1 tablespoon of oil, followed by the peaches, pineapple, ginger, garlic, most of the chillies, the baby sweetcorn, asparagus and broccoli.
// Stir-fry for 3 minutes, then pour in the sauce. Cook for just a few minutes – you want to keep the veg on the edge of raw – adding a good splash of boiling water to loosen the sauce, if needed.
// Drizzle the honey into the chicken pan, turn the heat back up to high, and toss until sticky and caramelized. Plate up the veg and top with the chicken. Clank up the reserved crispy skin, and scatter over with the remaining chilli.
// Pick over the coriander leaves and serve right away, with lime wedges for squeezing over. Good with classic fluffy rice.
//         Source: https://www.jamieoliver.com/recipes/chicken-recipes/tom-daley-s-sweet-sour-chicken/`,
//         "email": "hello@raddy.co.uk",
//         "ingredients": [
//         "1 x 227 g tin of pineapple in natural juice",
// "1 x 213 g tin of peaches in natural juice",
// "1 tablespoon low-salt soy sauce",
// "1 tablespoon fish sauce",
// "2 teaspoons cornflour",
// "2 x 120 g free-range chicken breasts , skin on",
// "Chinese five-spice",
// "1 lime",
// "2 cloves of garlic",
// "1 bunch of asparagus , (350g)",
// "100 g tenderstem broccoli",
// "1 small onion",
// "2 fresh red chillies",
// "1 red pepper",
// "1 yellow pepper",
// "7 cm piece of ginger",
// "groundnut oil",
// "100 g baby sweetcorn",
// "1 teaspoon runny honey",
// "½ a bunch of fresh coriander ,(15g)",
//         ],
//         "category": "Chinese",
//         "image": "tom-daley.jpg"
//         },

//         {
//           name: "Chinese steak & tofu stew",
//            description:`Get your prep done first, for smooth cooking. Chop the steak into 1cm chunks, trimming away and discarding any fat.
// Peel and finely chop the garlic and ginger and slice the chilli. Trim the spring onions, finely slice the top green halves and put aside, then chop the whites into 2cm chunks. Peel the carrots and mooli or radishes, and chop to a similar size.
// Place a large pan on a medium-high heat and toast the Szechuan peppercorns while it heats up. Tip into a pestle and mortar, leaving the pan on the heat.
// Place the chopped steak in the pan with 1 tablespoon of groundnut oil. Stir until starting to brown, then add the garlic, ginger, chilli, the white spring onions, carrots and mooli or radishes.
// Cook for 5 minutes, stirring regularly, then stir in the chilli bean paste for 30 seconds until dark. Pour in the stock and simmer for 10 minutes.
// Meanwhile, drain the beans, put them into a pan with the rice and a pinch of sea salt, and cover by 1cm with cold water. Place on a high heat, bring to the boil, then simmer until the water level meets the rice. Cover and leave on the lowest heat for 12 minutes, or until cooked through, stirring occasionally.
// Taste the stew and season to perfection. Mix the cornflour with 2 tablespoons of cold water until combined, then stir into the stew.
// Trim and stir in the broccoli. Chop the tofu into 2cm chunks and drop them in, then pop a lid on and keep on a low heat for 5 to 8 minutes while the stew thickens up and the broccoli just cooks through.
// Serve the stew scattered with the sliced green spring onions, with the sticky rice and beans on the side. Finely crush and scatter over some Szechuan pepper. Nice with drips of chilli oil, to taste.`,
//           email: "recipeemail@raddy.co.uk",
//           ingredients: [
//             "250g rump or sirloin steak",
// "2 cloves of garlic",
// "4cm piece of ginger",
// "2 fresh red chilli",
// "1 bunch of spring onions",
// "2 large carrots",
// "250g mooli or radishes",
// "1 heaped teaspoon Szechuan peppercorns",
// "groundnut oil",
// "2 tablespoons Chinese chilli bean paste , (find it in Asian supermarkets)",
// "1 litre veg stock",
// "1 x 400g tin of aduki beans",
// "250g pudding or risotto rice",
// "1 tablespoon cornflour",
// "200g tenderstem broccoli",
// "350g firm silken tofu",
//           ],
//           category: "Chinese",
//           image: "chinese-steak-tofu-stew.jpg",
//         },

//         {
//           name: "Chocolate & banoffee whoopie pies",
//           description: `Preheat the oven to 170ºC/325ºF/gas 3 and line 2 baking sheets with greaseproof paper.
// Combine the cocoa powder with a little warm water to form a paste, then add to a bowl with the remaining whoopie ingredients. Mix into a smooth, slightly stiff batter.
// Spoon equal-sized blobs, 2cm apart, onto the baking sheets, then place in the hot oven for 8 minutes, or until risen and cooked through.
// Cool for a couple of minutes on the sheets, then move to a wire rack to cool completely.
// Once the whoopies are cool, spread ½ a teaspoon of dulce de leche on the flat sides.
// Peel and slice the bananas, then top half the pies with 2 slices of the banana.
// Sandwich together with the remaining halves, and dust with icing sugar and cocoa powder.`,
//           email: "recipeemail@raddy.co.uk",
//           ingredients: [
//  " 2 heaped tablespoons cocoa powder , plus extra for dusting",
//  " 350 g self-raising flour",
//  " 175 g sugar",
//  " 200 ml milk",
//  " 100 ml nut or rapeseed oil",
//  " 1 large free-range egg",
//  " BANOFFEE FILLING",
//  " 240 g dulce de leche",
//  " 3 bananas",
//  " icing sugar , for dusting",
//           ],
//           category: "American",
//           image: "chocolate-banoffe-whoopie-pies.jpg",
//         },

//         {
//           name: "Crab cakes",
//           description: `Trim and finely chop the spring onions, and pick and finely chop the parsley. Beat the egg.
// Combine the crabmeat, potatoes, spring onion, parsley, white pepper, cayenne and egg in a bowl with a little sea salt.
// Refrigerate for 30 minutes, then shape into 6cm cakes.
// Dust with flour and shallow-fry in oil over a medium heat for about 5 minutes each side or until golden-brown.
// Serve with pinches of watercress and a dollop of tartare sauce.
// `,
//           email: "recipeemail@raddy.co.uk",
//           ingredients: [
//           " 3 spring onions",
// "½ a bunch of fresh flat-leaf parsley",
// "1 large free-range egg",
// "750 g cooked crabmeat , from sustainable sources",
// "300 g mashed potatoes",
// "1 teaspoon ground white pepper",
// "1 teaspoon cayenne pepper",
// "plain flour , for dusting",
// "olive oil",
// "watercress",
// "tartare sauce",
//           ],
//           category: "American",
//           image: "crab-cakes.jpg",
//         },

//         {
//           name: "Grilled lobster rolls",
//  description: `Remove the butter from the fridge and allow to soften.
//  Preheat a griddle pan until really hot.
//  Butter the rolls on both sides and grill on both sides until toasted and lightly charred (keep an eye on them so they don’t burn).
//  Trim and dice the celery, chop the lobster meat and combine with the mayonnaise. Season with sea salt and black pepper to taste.
//  Open your warm grilled buns, shred and pile the lettuce inside each one and top with the lobster mixture. Serve immediately.`,
//           email: "recipeemail@raddy.co.uk",
//           ingredients: [
//  " 85 g butter",
//  " 6 submarine rolls",
//  " 500 g cooked lobster meat, from sustainable sources",
//  " 1 stick of celery",
//  " 2 tablespoons mayonnaise , made using free-range eggs",
//  " ½ an iceberg lettuce",
//           ],
//           category: "American",
//           image: "grilled-lobster-rolls.jpg",
//         },

//         {
//           name: "Key lime pie",
//           description: `Preheat the oven to 175ºC/gas 3. Lightly grease a 22cm metal or glass pie dish with a little of the butter.
// For the pie crust, blend the biscuits, sugar and remaining butter in a food processor until the mixture resembles breadcrumbs.
// Transfer to the pie dish and spread over the bottom and up the sides, firmly pressing down.
// Bake for 10 minutes, or until lightly browned. Remove from oven and place the dish on a wire rack to cool.
// For the filling, whisk the egg yolks in a bowl. Gradually whisk in the condensed milk until smooth.
// Mix in 6 tablespoons of lime juice, then pour the filling into the pie crust and level over with the back of a spoon.
// Return to the oven for 15 minutes, then place on a wire rack to cool.
// Once cooled, refrigerate for 6 hours or overnight.
// To serve, whip the cream until it just holds stiff peaks. Add dollops of cream to the top of the pie, and grate over some lime zest, for extra zing if you like.`,
//           email: "recipeemail@raddy.co.uk",
//           ingredients: [
// "4 large free-range egg yolks",
// "400 ml condensed milk",
// "5 limes",
// "200 ml double cream",
// "CRUST",
// "135 g unsalted butter",
// "12 digestive biscuits",
// "45 g caster sugar"
//           ],
//           category: "American",
//           image: "key-lime-pie.jpg",
//         },

//       {
//         name: "Southern fried chicken",
//         description: `To make the brine, toast the peppercorns in a large pan on a high heat for 1 minute, then add the rest of the brine ingredients and 400ml of cold water. Bring to the boil, then leave to cool, topping up with another 400ml of cold water.
// Meanwhile, slash the chicken thighs a few times as deep as the bone, keeping the skin on for maximum flavour. Once the brine is cool, add all the chicken pieces, cover with clingfilm and leave in the fridge for at least 12 hours – I do this overnight.
// After brining, remove the chicken to a bowl, discarding the brine, then pour over the buttermilk, cover with clingfilm and place in the fridge for a further 8 hours, so the chicken is super-tender.
// When you’re ready to cook, preheat the oven to 190°C/375°F/gas 5.
// Wash the sweet potatoes well, roll them in a little sea salt, place on a tray and bake for 30 minutes.
// Meanwhile, make the pickle – toast the fennel seeds in a large pan for 1 minute, then remove from the heat. Pour in the vinegar, add the sugar and a good pinch of sea salt, then finely slice and add the cabbage. Place in the fridge, remembering to stir every now and then while you cook your chicken.
// In a large bowl, mix the flour with the baking powder, cayenne, paprika and the onion and garlic powders.
// Just under half fill a large sturdy pan with oil – the oil should be 8cm deep, but never fill your pan more than half full – and place on a medium to high heat. Use a thermometer to tell when it’s ready (180°C), or add a piece of potato and wait until it turns golden – that’s a sign it’s ready to go.
// Take the chicken out of the fridge, then, one or two pieces at a time, remove from the buttermilk and dunk into the bowl of flour until well coated. Give them a shake, then place on a large board and repeat with the remaining chicken pieces.
// Turn the oven down to 170°C/325°F/gas 3 and move the sweet potatoes to the bottom shelf.
// Once the oil is hot enough, start with 2 thighs – quickly dunk them back into the flour, then carefully lower into the hot oil using a slotted spoon. Fry for 5 minutes, turning halfway, then remove to a wire rack over a baking tray.
// Bring the temperature of the oil back up, repeat the process with the remaining 2 thighs, then pop the tray into the oven.
// Fry the 4 drumsticks in one batch, then add them to the rack of thighs in the oven for 30 minutes, or until all the chicken is cooked through.
// Serve with your baked sweet potatoes, cabbage pickle and some salad leaves.
//                        Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/  `,
//         email: "hello@raddy.co.uk",
//         ingredients: [
//           "4 free-range chicken thighs , skin on, bone in",
// "4 free-range chicken drumsticks",
// "200 ml buttermilk",
// "4 sweet potatoes",
// "200 g plain flour",
// "1 level teaspoon baking powder",
// "1 level teaspoon cayenne pepper",
// "1 level teaspoon hot smoked paprika",
// "1 level teaspoon onion powder",
// "1 level teaspoon garlic powder",
// "2 litres groundnut oil",
// "BRINE",
// "1 tablespoon black peppercorns",
// "25 g sea salt",
// "100 g brown sugar",
// "4 sprigs of fresh thyme",
// "4 fresh bay leaves",
// "4 cloves of garlic",
// "PICKLE",
// "1 teaspoon fennel seeds",
// "100 ml red wine vinegar",
// "1 heaped tablespoon golden caster sugar",
// "½ red cabbage , (500g)",
//         ],
//         category: "American",
//         image: "southern-friend-chicken.jpg",
//       },

//         {
//           name: "Spring rolls",
//           description: `Put your mushrooms in a medium-sized bowl, cover with hot water and leave for 10 minutes, or until soft. Meanwhile, place the noodles in a large bowl, cover with boiling water and leave for 1 minute. Drain, rinse under cold water, then set aside.
// For the filling, finely slice the cabbage and peel and julienne the carrot. Add these to a large bowl with the noodles.
// Slice the white part of the spring onions on the diagonal and add to the bowl. Finely slice the green parts into ribbons and reserve for later.
// Peel and grate the ginger, then finely chop the chilli. Roughly chop the herbs and add to the bowl with the ginger and chilli.
// Crush the peanuts and add to the bowl with the sesame oil, beansprouts, soy and oyster sauces, and mix well.
// When they’re ready, drain the mushrooms, then chop them and stir into the filling. Season to taste.
// In a small bowl, blend the cornflour and 2 tablespoons of cold water.
// Next, lay one spring-roll wrapper, smooth-side down, on a clean surface as a diamond shape, with one corner pointing down towards you. Sprinkle a little of the five spice powder over it, then place another wrapper on top (the extra thickness will stop the rolls from breaking open while cooking).
// Spoon 2 tablespoons of the filling on the bottom corner of the double wrapper. Brush each corner with the cornflour mixture, then start rolling up from the bottom. When the filling is covered, pull the corners in from each side (to seal the ends as you go). Continue rolling until the filling is tightly covered, then press to seal the top corner.
// Lay the finished roll on a large baking tray and cover with a damp tea towel. Continue until you’ve filled all the wrappers.
// Heat the groundnut oil in a large wok or saucepan over a medium heat. To check whether the oil is ready, drop in a piece of potato; it should sizzle and start to turn golden. In small batches, carefully lower the spring rolls into the oil and deep-fry for 2 to 3 minutes, or until golden brown. Remove with a slotted spoon and drain on kitchen paper.
// Serve with the sweet chilli sauce and reserved sliced spring-onion tops.`,
//           email: "recipeemail@raddy.co.uk",
//           ingredients: [
// "40 g dried Asian mushrooms",
// "50 g vermicelli noodles",
// "200 g Chinese cabbage",
// "1 carrot",
// "3 spring onions",
// "5 cm piece of ginger",
// "1 red chilli",
// "1 big bunch of fresh Thai basil , (30g)",
// "1 big bunch of fresh coriander , (30g)",
// "3 tablespoons toasted peanuts",
// "20 ml sesame oil",
// "75 g beansprouts , (ready to eat)",
// "2 tablespoons low-salt soy sauce",
// "2 tablespoons oyster sauce",
// "1 tablespoon cornflour",
// "16 large spring-roll wrappers , thawed if frozen",
// "1 tablespoon five-spice powder",
// "1 litre groundnut oil",
// "sweet chilli sauce , to serve",
//           ],
//           category: "Chinese",
//           image: "spring-rolls.jpg",
//         },

//         {
//           name: "Stir-fried vegetables",
//           description: `Crush the garlic and finely slice the chilli and spring onion. Peel and finely slice the red onion, and mix with the garlic, chilli and spring onion.
// Shred the mangetout, slice the mushrooms and water chestnuts, and mix with the shredded cabbage in a separate bowl to the onion mixture.
// Heat your wok until it’s really hot. Add a splash of oil – it should start to smoke – then the chilli and onion mix. Stir for just 2 seconds before adding the other mix. Flip and toss the vegetables in the wok if you can; if you can’t, don’t worry, just keep the vegetables moving with a wooden spoon, turning them over every few seconds so they all keep feeling the heat of the bottom of the wok. Season with sea salt and black pepper.
// After a minute or two, the vegetables should have begun to soften. Add the soy sauce and 1 teaspoon of sesame oil and stir in. After about 30 seconds the vegetables should smell amazing! Tip on to a serving dish, sprinkle over some sesame seeds and tuck in.`,
//           email: "recipeemail@raddy.co.uk",
//           ingredients: [
// "1 clove of garlic",
// "1 fresh red chilli",
// "3 spring onions",
// "1 small red onion",
// "1 handful of mangetout",
// "a few shiitake mushrooms",
// "a few water chestnuts",
// "1 handful of shredded green cabbage",
// "olive oil",
// "2 teaspoons soy sauce",
// "sesame oil",
// "sesame seeds , to sprinkle on top",
//           ],
//           category: "Chinese",
//           image: "stir-fried-vegetables.jpg",
//         },

//         {
//           name: "Thai-Chinese-inspired pinch salad",
//           description: `Peel and very finely chop the ginger and deseed and finely slice the chilli (deseed if you like). Toast the sesame seeds in a dry frying pan until lightly golden, then remove to a bowl.
// Mix the prawns with the five-spice and ginger, finely grate in the lime zest and add a splash of sesame oil. Toss to coat, then leave to marinate.
// Trim the lettuces, discarding any tatty outer leaves, then click the leaves apart. Pick out 12 nice-looking inner leaves (save the remaining lettuce for another recipe).
// Cook the noodles according to the packet instructions, then drain and toss in a little sesame oil. Leave to cool, then squeeze over the lime juice.
// Scatter over the chilli and sesame seeds, then pick over the coriander leaves. Mix well.
// Stir-fry the marinated prawns in a hot wok or frying pan over a high heat for 2 to 3 minutes, or until just cooked.
// Pile pinches of noodle salad onto the lettuce leaves, and top each with a couple of prawns, then tuck in.`,
//           email: "recipeemail@raddy.co.uk",
//           ingredients: [
//  " 5 cm piece of ginger",
//  " 1 fresh red chilli",
//  " 25 g sesame seeds",
//  " 24 raw peeled king prawns , from sustainable sources (defrost first, if using frozen)",
//  " 1 pinch Chinese five-spice powder",
//  " 1 lime",
//  " sesame oil",
//  " 2 round lettuces",
//  " 50 g fine rice noodles",
//  " ½ a bunch of fresh coriander (15g)",
//           ],
//           category: "Thai",
//           image: "thai-chinese-inspired-pinch-salad.jpg",
//         },

//         {
//           name: "Thai green curry",
//           description: `Preheat the oven to 180ºC/350ºF/gas 4.
// Wash the squash, carefully cut it in half lengthways and remove the seeds, then cut into wedges. In a roasting tray, toss with 1 tablespoon of groundnut oil and a pinch of sea salt and black pepper, then roast for around 1 hour, or until tender and golden.
// For the paste, toast the cumin seeds in a dry frying pan for 2 minutes, then tip into a food processor.
// Peel, roughly chop and add the garlic, shallots and ginger, along with the kaffir lime leaves, 2 tablespoons of groundnut oil, the fish sauce, chillies (pull off the stalks), coconut and most of the coriander (stalks and all).
// Bash the lemongrass, remove and discard the outer layer, then snap into the processor, squeeze in the lime juice and blitz into a paste, scraping down the sides halfway.
// Put 1 tablespoon of groundnut oil into a large casserole pan on a medium heat with the curry paste and fry for 5 minutes to get the flavours going, stirring regularly.
// Tip in the coconut milk and half a tin’s worth of water, then simmer and thicken on a low heat for 5 minutes.
// Stir in the roasted squash, roughly chop and add the leftover greens and leave to tick away on the lowest heat, then taste and season to perfection.
// Meanwhile, cube the tofu and fry in a pan on a medium- high heat with 1 tablespoon of groundnut oil for 2 minutes, or until golden.
// Crush the peanuts in a pestle and mortar and toast in the tofu pan until lightly golden.
// Serve the curry topped with the golden tofu and peanuts, drizzled with a little sesame oil. Slice the chilli and sprinkle over with the reserved coriander leaves. Serve with lime wedges, for squeezing over. Great with sticky rice.`,
//           email: "recipeemail@raddy.co.uk",
//           ingredients: [
//  " 1 butternut squash (1.2kg)",
//  " groundnut oil",
//  " 2x 400 g tins of light coconut milk",
//  " 400 g leftover cooked greens, such as Brussels sprouts, Brussels tops, kale, cabbage, broccoli",
//  " 350 g firm silken tofu",
//  " 75 g unsalted peanuts",
//  " sesame oil",
//  " 1 fresh red chilli",
//  " 2 limes",
//  " CURRY PASTE",
//  " 1 teaspoon cumin seeds",
//  " 2 cloves garlic",
//  " 2 shallots",
//  " 5 cm piece of ginger",
//  " 4 lime leaves",
//  " 2 tablespoons fish sauce",
//  " 4 fresh green chillies",
//  " 2 tablespoons desiccated coconut",
//  " 1 bunch fresh coriander (30g)",
//  " 1 stick lemongrass",
//  " 1 lime",
//           ],
//           category: "Thai",
//           image: "thai-green-curry.jpg",
//         },

//         {
//           name: "Thai-inspired vegetable broth",
//           description: `Peel and crush the garlic, then peel and roughly chop the ginger. Trim the greens, finely shredding the cabbage, if using. Trim and finely slice the spring onions and chilli. Pick the herbs.
// Bash the lemongrass on a chopping board with a rolling pin until it breaks open, then add to a large saucepan along with the garlic, ginger and star anise.
// Place the pan over a high heat, then pour in the vegetable stock. Bring it just to the boil, then turn down very low and gently simmer for 30 minutes.
// A couple of minutes before it’s cooked, throw in your Asian veggies and gently cook until they are wilted but still crunchy.
// Serve the broth in deep bowls seasoned with fish sauce (if using) and soy sauce, sprinkle with the herbs, cress, spring onion and chilli, then serve with wedges of lime.`,
//           email: "recipeemail@raddy.co.uk",
//           ingredients: [
// "3 cloves of garlic",
// "5cm piece of ginger",
// "200 g mixed Asian greens , such as baby pak choi, choy sum, Chinese cabbage",
// "2 spring onions",
// "1 fresh red chilli",
// "5 sprigs of fresh Thai basil",
// "1 stick of lemongrass",
// "2 star anise",
// "800 ml clear organic vegetable stock",
// "1 teaspoon fish sauce , (optional)",
// "1 teaspooon soy sauce",
// "1 small punnet shiso cress",
// "1 lime",
//           ],
//           category: "Thai",
//           image: "thai-inspired-vegetable-broth.jpg",
//         },

//         {
//           name: "Thai red chicken soup",
//           description: `Sit the chicken in a large, deep pan.
// Carefully halve the squash lengthways, then cut into 3cm chunks, discarding the seeds.
// Slice the coriander stalks, add to the pan with the squash, curry paste and coconut milk, then pour in 1 litre of water. Cover and simmer on a medium heat for 1 hour 20 minutes.
// Use tongs to remove the chicken to a platter. Spoon any fat from the surface of the soup over the chicken, then sprinkle with half the coriander leaves.
// Serve with 2 forks for divvying up the meat at the table. Use a potato masher to crush some of the squash, giving your soup a thicker texture.
// Taste, season to perfection with sea salt and black pepper, then divide between six bowls and sprinkle with the remaining coriander.
// Shred and add chicken, as you dig in.`,
//           email: "recipeemail@raddy.co.uk",
//           ingredients: [
//  " 1 x 1.6 kg whole chicken",
//  " 1 butternut squash (1.2kg)",
//  " 1 bunch of fresh coriander (30g)",
//  " 100 g Thai red curry paste",
//  " 1 x 400 ml tin of light coconut milk",
//           ],
//           category: "Thai",
//           image: "thai-red-chicken-soup.jpg",
//         },

//         {
//           name: "Thai-style mussels",
//           description: `Wash the mussels thoroughly, discarding any that aren’t tightly closed.
// Trim and finely slice the spring onions, peel and finely slice the garlic. Pick and set aside the coriander leaves, then finely chop the stalks. Cut the lemongrass into 4 pieces, then finely slice the chilli.
// In a wide saucepan, heat a little groundnut oil and soften the spring onion, garlic, coriander stalks, lemongrass and most of the red chilli for around 5 minutes.
// Add the coconut milk and fish sauce and bring to the boil, then add the mussels and cover the pan.
// Steam the mussels for 5 minutes, or until they've all opened and are cooked. Discard any unopened mussels.
// Finish with a squeeze of lime juice, then sprinkle with coriander leaves and the remaining chilli to serve.`,
//           email: "recipeemail@raddy.co.uk",
//           ingredients: [
// "1 kg mussels , debearded, from sustainable sources",
// "4 spring onions",
// "2 cloves of garlic",
// "½ a bunch of fresh coriander",
// "1 stick of lemongrass",
// "1 fresh red chilli",
// "groundnut oil",
// "1 x 400 ml tin of reduced fat coconut milk",
// "1 tablespoon fish sauce",
// "1 lime",
//           ],
//           category: "Thai",
//           image: "thai-style-mussels.jpg",
//         },

//         {
//           name: "Veggie pad Thai",
//           description: `Cook the noodles according to the packet instructions, then drain and refresh under cold running water and toss with 1 teaspoon of sesame oil.
// Lightly toast the peanuts in a large non-stick frying pan on a medium heat until golden, then bash in a pestle and mortar until fine, and tip into a bowl.
// Peel the garlic and bash to a paste with the tofu, add 1 teaspoon of sesame oil, 1 tablespoon of soy, the tamarind paste and chilli sauce, then squeeze and muddle in half the lime juice.
// Peel and finely slice the shallot, then place in the frying pan over a high heat. Trim, prep and slice the crunchy veg, as necessary, then dry-fry for 4 minutes, or until lightly charred (to bring out a nutty, slightly smoky flavour).
// Add the noodles, sauce, beansprouts, and a good splash of water, toss together over the heat for 1 minute, then divide between serving bowls.
// Wipe out the pan, crack in the eggs and cook to your liking in a little olive oil, sprinkling with a pinch of chilli flakes. Trim the lettuce, click apart the leaves and place a few in each bowl.
// Pop the eggs on top, pick over the herbs, and sprinkle with the nuts. Serve with lime wedges for squeezing over, and extra soy, to taste.`,
//           email: "recipeemail@raddy.co.uk",
//           ingredients: [
//  " 150 g rice noodles",
//  " sesame oil",
//  " 20 g unsalted peanuts",
//  " 2 cloves of garlic",
//  " 80 g silken tofu",
//  " low-salt soy sauce",
//  " 2 teaspoons tamarind paste",
//  " 2 teaspoons sweet chilli sauce",
//  " 2 limes",
//  " 1 shallot",
//  " 320 g crunchy veg , such as asparagus, purple sprouting broccoli, pak choi, baby corn",
//  " 80 g beansprouts",
//  " 2 large free-range eggs",
//  " olive oil",
//  " dried chilli flakes",
//  " ½ a cos lettuce",
//  " ½ a mixed bunch of fresh basil, mint and coriander , (15g)",
//           ],
//           category: "Thai",
//           image: "veggie-pad-thai.jpg",
//         },

//     ]);
//   } catch (error) {
//     console.log("err", +error);
//   }
// }

// insertDymmyRecipeData();
