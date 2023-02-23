import '../css/styles.css';
import logo from '../assets/recetapp.jpeg'

const imageLogo = document.getElementById('logoapp')
imageLogo.src = logo;

// Variables y Selectores
const btnSearchRecipe = document.getElementById('btnSearchRecipe'),
    btnSearchRandomRecipe = document.getElementById('btnSearchRandom'),
    txtRecipe = document.getElementById('txtRecipe'),
    form = document.getElementById('search'),
    dishes = document.querySelector('.dishes'),
    dishesContent = document.querySelector('.dishes-content'),
    dishSelectedContent = document.querySelector('.dish-selected-content'),
    dishSelected = document.querySelector('.dish-selected'),
    btnCloseselectedDisd = document.querySelector('#btnCloseDishSelected'),
    body = document.querySelector('body');
    txtRecipe.placeholder = "Write an ingredient";



init();

function init() {
    evenListeners();
}

// Event Listeners
function evenListeners() {
    btnSearchRecipe.addEventListener('click', searchMeal); // Buscar y mostrar comidas desde la API
    btnCloseselectedDisd.addEventListener('click', () => showDish(false))
    btnSearchRandomRecipe.addEventListener('click', getRandomMeal);
}


//Función Buscar comida desde la api
function searchMeal(event) {
    event.preventDefault();
    cleanMealsHTML();

    const recipeName = txtRecipe.value; //Obtener término de búsqueda

    if (!recipeName.length) { showAlert('Write the name of an ingredient', 'error'); return; }

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`)
        .then(response => response.json())
        .then(data => getMealData(data))
        .catch(error => console.log(error));
}

//Función Obtener comida por ID desde la api
function getMealByID(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            buildMealBigCard(meal);
        })
        .catch(error => console.log(error));
}

//Comida aleatoria
function getRandomMeal(event) {
    event.preventDefault();
    cleanMealsHTML();

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(response => response.json())
        .then(data => {
            getMealData(data, true);
        })
        .catch(error => console.log(error));
}


function getMealData(data, random = false) {
    const { meals } = data;

    showSpinner(true);
    if (!meals) {
        setTimeout(() => {
            showSpinner(false);
            showAlert('Try again', 'error');
        }, 1000)
        return;
    }

    // Show spinner
    setTimeout(() => {
        showSpinner(false);

        const dishSearched = document.createElement('h2');

        const dishSearchedText =
            (random)
                ? `Search results:`
                : `Search results of: '${txtRecipe.value}'`;

        dishSearched.textContent = dishSearchedText;

        dishesContent.insertBefore(dishSearched, dishes);
        dishSearched.classList.add('searchResultH2');

        form.reset();

        meals.forEach(meal => {
            const { idMeal, strMeal, strMealThumb, strArea, strCategory } = meal;
            const mealDataCard = { idMeal, strMeal, strMealThumb, strArea, strCategory };
            buildMealCards(mealDataCard);
        })
    }, 1000);
}


function hoverFunctionInCards() {
    const dishses = document.querySelectorAll('.dish');

    if (!dishses) return;

    dishses.forEach(dishCard => {
        dishCard.addEventListener('mouseenter', () => hoverSelected(dishCard, true));
        dishCard.addEventListener('mouseleave', () => hoverSelected(dishCard, false));
    })
}


let scrrollOntop;
let doc = document.documentElement;

function showDish(value) {
    if (value) {
        scrrollOntop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        dishSelectedContent.classList.remove('no-display');
        body.classList.add('no-show-scroll');
        dishSelectedContent.style.top = `${scrrollOntop}px`;
    } else {
        dishSelectedContent.classList.add('no-display');
        body.classList.remove('no-show-scroll');
        dishSelectedContent.style.top = `0px`;
        cleanMealHTML();
    }

    doc.scrollTop = scrrollOntop;
}

function hoverSelected(dishCard, value) {
    const dishCardElemnts = dishCard.children,
        dishImg = dishCardElemnts[1],
        dishDataElements = dishCardElemnts[0].children,
        dishName = dishDataElements[0].children[0],
        dishCategory = dishDataElements[1].children[1],
        dishArea = dishDataElements[2].children[1];

    if (value) {
        dishName.style.color = "white";
        dishCategory.style.color = "white";
        dishArea.style.color = "white";
        dishImg.style.transform = "rotate(4deg)";
    } else {
        dishName.style.color = "black";
        dishCategory.style.color = "black";
        dishArea.style.color = "black";
        dishImg.style.transform = "";
    }

}

function buildMealCards(mealData) {
    const { idMeal, strMeal, strMealThumb, strArea, strCategory } = mealData;
    const dish = document.createElement('div');
    const dishData = document.createElement('ul');
    const dishImg = document.createElement('img');
    dish.classList.add('dish');
    dishData.classList.add('dish__data')
    dishImg.classList.add('dish-img');

    dish.setAttribute('id', idMeal);
    dishImg.src = strMealThumb;

    dishData.innerHTML = `<li>
                                <p class="dish__data__name">${strMeal}</p>
                            </li>
                            <li class="dish__data__list">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon-kitchen" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#597e8d" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M19 3v12h-5c-.023 -3.681 .184 -7.406 5 -12zm0 12v6h-1v-3m-10 -14v17m-3 -17v3a3 3 0 1 0 6 0v-3" />
                                </svg>
                                <p class="dish__data__category">${strCategory}</p>
                            </li>
                            <li class="dish__data__list">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon-place" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#597e8d" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <circle cx="12" cy="11" r="3" />
                                    <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
                                    </svg>
                                <p class="dish__data__area">${strArea}</p>
                            </li>`;

    dish.appendChild(dishData);
    dish.appendChild(dishImg);
    dishes.appendChild(dish);

    dish.addEventListener('click', () => searchMealByID(dish));
    hoverFunctionInCards();
}

function searchMealByID(dishCard) {
    showDish(true);
    const dishId = dishCard.getAttribute('id');
    getMealByID(dishId);
}

function showSpinner(value) {
    const spinner = document.querySelector('#spinner');
    (value) ? spinner.style.display = 'flex' : spinner.style.display = 'none';
}

function showAlert(message, type) {
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('text-center', 'alert');

    (type === 'error')
        ? divMensaje.classList.add('alert-danger')
        : divMensaje.classList.add('alert-success');

    // Mensaje
    divMensaje.textContent = message;

    // Insertar el HTML
    const alerts = document.querySelectorAll('.alert');
    if (alerts.length === 0) form.insertBefore(divMensaje, btnSearchRecipe.nextSibling);

    // Quitar el HTML
    setTimeout(() => {
        divMensaje.remove();
    }, 3000);
}


function cleanMealsHTML() {
    document.querySelectorAll('.searchResultH2').forEach(searchResultH2 => {
        searchResultH2.remove();
    });

    while (dishes.firstChild) {
        dishes.removeChild(dishes.firstChild);
    }
}

function cleanMealHTML() {
    const dataMealHtml = document.querySelector('.dish-selected-data');
    while (dataMealHtml.children.firstChild) {
        dataMealHtml.removeChild(dataMealHtml.firstChild);
    }
    dataMealHtml.remove();
}

function buildMealBigCard(meal) {
    const dish = document.createElement('div');
    dish.classList.add('dish-selected-data');

    const dishName = document.createElement('h2');
    dishName.textContent = meal.strMeal;

    const dishImg = document.createElement('img');
    dishImg.classList.add('dish-selected-img');
    dishImg.src = meal.strMealThumb;
    dishImg.alt = `Imagen de la comida ${meal.strMeal}`;

    const dishAreaCategory = document.createElement('div');
    dishAreaCategory.classList.add('dish-selected-area-category');
    dishAreaCategory.innerHTML = `<div class="dish-selected-area-category">
                                    <div class="dish-selected-flex">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon-kitchen" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#597e8d" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                            <path d="M19 3v12h-5c-.023 -3.681 .184 -7.406 5 -12zm0 12v6h-1v-3m-10 -14v17m-3 -17v3a3 3 0 1 0 6 0v-3" />
                                        </svg>
                                        <p class="dish-selected-data__category">${meal.strCategory}</p>
                                    </div>
                                    <div class="dish-selected-flex">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon-place" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#597e8d" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                            <circle cx="12" cy="11" r="3" />
                                            <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
                                            </svg>
                                        <p class="dish-selected-data__area">${meal.strArea}</p>
                                    </div>
                                </div>`;

    const dishInstructions = document.createElement('div');
    dishInstructions.classList.add('dish-selected-instructions');
    dishInstructions.innerHTML = `<div class="dish-selected-instructions">
                                    <h3>Instructions</h3>
                                    <p>${meal.strInstructions}</p>
                                </div>`;

    const dishIngredients = document.createElement('div');
    const dishIngredientsTitle = document.createElement('h3');
    const dishIngredientsUl = document.createElement('ul');
    dishIngredientsUl.classList.add('indredients-list');
    dishIngredients.classList.add('dish-selected-ingredients');
    dishIngredientsTitle.textContent = 'List of ingredients';

    dishIngredients.appendChild(dishIngredientsTitle);

    const ingredientsAndMeasure = getIngredientsAndMasures(meal);

    ingredientsAndMeasure.forEach((ingredientAndMeasure) => {
        const dishIngredient = document.createElement('li');
        dishIngredient.classList.add('indredients-list-item');
        dishIngredient.textContent = `${ingredientAndMeasure[0]} - ${ingredientAndMeasure[1]}`;
        dishIngredientsUl.appendChild(dishIngredient);
    });

    dishIngredients.appendChild(dishIngredientsUl);

    dish.appendChild(dishName);
    dish.appendChild(dishImg);
    dish.appendChild(dishAreaCategory);
    dish.appendChild(dishIngredients);
    dish.appendChild(dishInstructions);
    
    

    dishSelected.appendChild(dish);
}

function getIngredientsAndMasures(meal) {
    const ingredientPrefix = 'strIngredient';
    const measurePrefix = 'strMeasure';

    const ingredientsAndMeasure = [];

    let i = 1;
    let ingredient = `${meal[`${ingredientPrefix}${i}`]}`;
    let measure = `${meal[`${measurePrefix}${i}`]}`;
    ingredientsAndMeasure.push([ingredient, measure]);

    getIngredients:
    while (ingredient.length > 0) {
        i++;
        ingredient = `${meal[`${ingredientPrefix}${i}`]}`;
        measure = `${meal[`${measurePrefix}${i}`]}`;

        if (ingredient.length === 0 || ingredient === 'undefined' || ingredient === 'null') break getIngredients;

        ingredientsAndMeasure.push([ingredient, measure]);
    }

    return ingredientsAndMeasure;
    
}



