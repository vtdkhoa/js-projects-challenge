const mealsElement = document.querySelector('#meals')
const favoriteList = document.querySelector('#fav-meals')
const mealPopup = document.querySelector('#meal-popup')
const mealInfoElement = document.querySelector('#meal-info')
const popupClose = document.querySelector('#close-popup')

const searchTerm = document.querySelector('#search-term')
const search = document.querySelector('#search')

getRandomMeal()
fetchFavoriteMeals()

async function getRandomMeal() {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
  const responseData = await response.json()
  const randomMeal = responseData.meals[0]
  addMeal(randomMeal, true)
}

async function getMealById(id) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
  const responseData = await response.json()
  const meal = responseData.meals[0]
  return meal
}

async function getMealsBySearch(term) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
  const responseData = await response.json()
  const meals = responseData.meals
  return meals
}

function addMeal(mealData, random = false) {
  const meal = document.createElement('div')
  meal.classList.add('meal')

  meal.innerHTML = `
    <div class="meal-header">
      ${random ? `<span class="random">Random Recipe</span>` : ''}
      <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" />
    </div>
    <div class="meal-body">
      <h4>${mealData.strMeal}</h4>
      <button class="fav-btn">
        <i class="fas fa-heart"></i>
      </button>
    </div>
  `

  const btn = meal.querySelector('.meal-body .fav-btn')

  btn.addEventListener('click', () => {
    if (btn.classList.contains('active')) {
      removeMeals(mealData.idMeal)
      btn.classList.remove('active')
    } else {
      addMeals(mealData.idMeal)
      btn.classList.add('active')
    }

    fetchFavoriteMeals()
  })

  meal.addEventListener('click', () => {
    showMealInfo(mealData)
  })

  mealsElement.appendChild(meal)
}

// Todo: add meals in local storage
function addMeals(mealId) {
  const mealIds = getMeals()
  localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]))
}

// Todo: remove meals from local storage
function removeMeals(mealId) {
  const mealIds = getMeals()
  localStorage.setItem(
    'mealIds',
    JSON.stringify(mealIds.filter(id => id !== mealId))
  )
}

// Todo: get/fetch meals from local storage
function getMeals() {
  const mealIds = JSON.parse(localStorage.getItem('mealIds'))
  return mealIds === null ? [] : mealIds
}

async function fetchFavoriteMeals() {
  // clean the container
  favoriteList.innerHTML = ''
  const mealIds = getMeals()

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i]
    meal = await getMealById(mealId)
    addFavoriteMeal(meal)
  }
}

function addFavoriteMeal(mealData) {
  const favoriteMeal = document.createElement('li')
  favoriteMeal.innerHTML = `
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" />
    <span>${mealData.strMeal}</span>
    <button class="clear">
      <i class="fas fa-window-close"></i>
    </button>
  `

  const btn = favoriteMeal.querySelector('.clear')

  btn.addEventListener('click', () => {
    removeMeals(mealData.idMeal)
    fetchFavoriteMeals()
  })

  favoriteMeal.addEventListener('click', () => {
    showMealInfo(mealData)
  })

  favoriteList.appendChild(favoriteMeal)
}

function showMealInfo(mealData) {
  // clean it up
  mealInfoElement.innerHTML = ''

  // update the Meal info
  const mealElement = document.createElement('div')

  const ingredients = []

  // get ingredients and measures
  for (let i = 1; i <= 20; i++) {
    if (mealData['strIngredient' + i]) {
      ingredients.push(`${mealData['strIngredient' + i]} - ${mealData['strMeasure' + i]}`)
    } else {
      break
    }
  }

  mealElement.innerHTML = `
    <h1>${mealData.strMeal}</h1>
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" />
    <p>${mealData.strInstructions}</p>
    <h3>Ingredients:</h3>
    <ul>
      ${ingredients.map(ingre => `<li>${ingre}</li>`).join('')}
    </ul>
  `

  mealInfoElement.appendChild(mealElement)

  // show popup
  mealPopup.classList.remove('hidden')
}

search.addEventListener('click', async () => {
  // clean container
  mealsElement.innerHTML = ''
  const term = searchTerm.value
  const meals = await getMealsBySearch(term)

  if (meals) {
    meals.forEach(meal => {
      addMeal(meal)
    })
  }
})

popupClose.addEventListener('click', () => {
  mealPopup.classList.add('hidden')
})