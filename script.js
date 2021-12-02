const $recipeContainer = document.querySelector(".js-recipe-container");

const $popupContainer = document.querySelector(".js-popup-container");
const $popupTitle = document.querySelector(".js-popup-title");
const $instructions = document.querySelector(".js-instructions");
const $ingredientContainer = document.querySelector(".js-ingredients");
const popupCloseBtn = document.querySelector(".js-popup-close");

const $inputField = document.querySelector(".js-input-field");
const $searchBtn = document.querySelector(".js-search");
const $errorMessage = document.querySelector(".js-error-message");

/**Some working meal id's from the MealDb API**/
function init() {
  let ids = [];
  for (let i = 52770; i < 52783; i++) {
    ids.push(i);
  }
  loadPage(ids);
}

/**By clicking "View Recipe" button generate the recipe details**/
function popupCard() {
  let popupText = this.dataset;
  $popupTitle.innerHTML = `${decodeURIComponent(popupText.foodname)}`;
  $instructions.innerHTML = `${decodeURIComponent(popupText.instructions)}`;
  $ingredientContainer.innerHTML = `${decodeURIComponent(
    popupText.ingredients
  )}`;
  $popupContainer.classList.add("visible");

  popupCloseBtn.addEventListener("click", () => {
    $popupContainer.classList.remove("visible");
  });
}

function showDetails() {
  const popupBtn = document.querySelectorAll(".js-full-recipe");
  for (let button of popupBtn) {
    button.onclick = popupCard;
  }
}

/**Generate the recipe card html and the data attributes**/
function createCardHtml(details) {
  return `<img class="meal-image"
          src=${details.thumbnail} 
          alt="" 
   />
    <p class="food-name">${details.foodname}</p>
    <div class="infos">
      <span class="serving">
        <i class="fas fa-concierge-bell"></i>
        3 servings
      </span>
      <span class="time">
        <i class="fas fa-clock"></i>
        30 min
      </span>
    </div>
    <button class="full-recipe js-full-recipe"
    data-foodname=${encodeURIComponent(details.foodname)}
    data-ingredients=${encodeURIComponent(details.ingredients)}
    data-instructions=${encodeURIComponent(details.instructions)}
    >
      View Recipe
    </button>`;
}

/**Create list items for each ingredients and connect with the measures**/
function getIngredients(meal) {
  let ingredientHtml = "";
  let j = 1;
  while (
    `${meal[`strIngredient${j}`]}` !== "null" &&
    `${meal[`strIngredient${j}`]}`?.length > 0 &&
    j <= 20
  ) {
    ingredientHtml += `<li>
      ${meal[`strMeasure${j}`]} ${meal[`strIngredient${j}`]}
    </li>`;
    j += 1;
  }
  return ingredientHtml;
}

/**Create object for used recipe details**/
function getApiDetails(meal) {
  return {
    foodname: meal.strMeal,
    thumbnail: meal.strMealThumb,
    instructions: meal.strInstructions,
    ingredients: getIngredients(meal)
  };
}

/**Fetch API and create div for each recipe**/
function loadPage(recipeIds) {
  for (let recipeId of recipeIds) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.meals !== null && data.meals?.length > 0) {
          let newRecipe = document.createElement("div");
          newRecipe.classList.add("meal");
          let details = getApiDetails(data.meals[0]);
          let cardContent = createCardHtml(details);
          newRecipe.innerHTML += cardContent;
          $recipeContainer.appendChild(newRecipe);
        }

        showDetails();
      });
  }
}

/**Generate recipe cards if searching on ingredients**/
function listRecipes(recipes) {
  $recipeContainer.innerHTML = "";
  let recipeId = [];
  for (let recipe of recipes) {
    recipeId.push(recipe.idMeal);
  }
  loadPage(recipeId);
}

/**Entering on inputfield triggers the click event on search button**/
$inputField.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    $searchBtn.click();
  }
});

/**Searching recipes by ingredients**/
$searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${$inputField.value.trim()}`
  )
    .then((resp) => resp.json())
    .then((data) => {
      let recipes = data.meals;
      if ($inputField.value.trim() !== "") {
        try {
          listRecipes(recipes);
          $errorMessage.classList.remove("visible");
          $errorMessage.innerHTML = "";
        } catch {
          $errorMessage.classList.add("visible");
          $errorMessage.innerHTML = `There is no recipe with ${$inputField.value}. Please choose another ingredient or a meal`;
          init();
        }
      } else {
        $errorMessage.innerHTML = `Please type in an ingredient or a meal!`;
        init();
      }
    });
});

/**Hamburger menu**/
const hamMenu = document.querySelector(".js-ham-menu");
hamMenu.addEventListener("click", () => {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
});

init();
