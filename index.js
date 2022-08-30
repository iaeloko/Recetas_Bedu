// Variables y Selectores
const btnSearchRecipe = document.getElementById('btnSearchRecipe'),
      txtRecipe = document.getElementById('txtRecipe'),
      form = document.getElementById('search'),
      dishesContent = document.querySelector('.dishes');
    //   submit = document.getElementById('submit'),
    //   random = document.getElementById('random'),
    //   mealsElement = document.getElementById('meals'),
    //   resultHeading = document.getElementById('result-heading'),
    //   singleMealElement = document.getElementById('single-meal');


init();

function init(){
    evenListeners();
}

// Eventos

function evenListeners(){
    // Buscar y mostrar comidas desde la API
    btnSearchRecipe.addEventListener('click', searchMeal);
}

// //Event Listeners

// //Event Listener obtener comida random
// random.addEventListener('click', getRandomMeal);

// //Event Listener desplegar detalles de la receta
// mealsElement.addEventListener('click', element => {
//     const mealInfo = element.path.find(item => {
//         if (item.classList) {
//             return item.classList.contains('meal-info');
//         } else {
//             return false;
//         }
//     });

//     if (mealInfo) {
//         const mealID = mealInfo.getAttribute('data-mealid');
//         getMealByID(mealID);
//     }
// })



//Función Buscar comida desde la api
function searchMeal(event) {
    event.preventDefault();

    const recipeName = txtRecipe.value; //Obtener término de búsqueda

    if(!recipeName.length) { showAlert('No has introducido ningun nombre de receta a buscar.', 'error'); return; }

    //limpiar singleMeal
    //singleMealElement.innerHTML = '';

    //comprobar si está vacío
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`)
        .then(response => response.json())
        .then(data => showMeal(data));
    //Borrar texto de búsqueda
    //search.value = '';
}

function showMeal(data){

    const {meals} = data;
    
    showSpinner(true);
    if(!meals){
        setTimeout( () => {
            showSpinner(false);
            showAlert('No hay resultados de busqueda.', 'error');
        }, 1000)
        return;
    }

    // Show spinner
    setTimeout( () => {
        showSpinner(false);

        const dishSearched = document.createElement('h2');
        dishSearched.textContent = `Resultados de busqueda de: '${txtRecipe.value}':`;
        document.querySelector('.dishes-content').insertBefore(dishSearched, dishesContent);

        form.reset();

        meals.forEach( meal => {
            const {idMeal, strMealThumb, strArea, strCategory} = meal;
            const mealDataCard = {idMeal, strMealThumb, strArea, strCategory};
            buildMealCards(mealDataCard);
        })

        

        

        // btnResetForm.classList.remove('cursor-not-allowed', 'opacity-50');

        // fields.forEach( field => {
        //     field.removeAttribute('disabled');
        // });

        // setTimeout(() => {
        //     confirmationMessage.remove(); // Delete confirmation message
        // }, 5000);

    }, 1000);
}


function hoverFunctionInCards(){
    const dishses = document.querySelectorAll('.dish');

    // if(!dishses) return;
    dishses.forEach( dishCard=> {
        dishCard.addEventListener('mouseenter', () => hover(dishCard));
        dishCard.addEventListener('mouseleave', () => hoverExit(dishCard));
    })
}

function hover(dishCard){
    const dishCardElemnts = dishCard.children;
    const dishImg = dishCardElemnts[1];
    const dishDataElements = dishCardElemnts[0].children;
    const dishName = dishDataElements[0].children[0];
    const dishCategory = dishDataElements[1].children[1];
    const dishArea = dishDataElements[2].children[1];

    dishName.style.color = "white";
    dishCategory.style.color = "white";
    dishArea.style.color = "white";
    dishImg.style.transform = "rotate(4deg)";
}

function hoverExit(dishCard){
    const dishCardElemnts = dishCard.children;
    const dishImg = dishCardElemnts[1];
    const dishDataElements = dishCardElemnts[0].children;
    const dishName = dishDataElements[0].children[0];
    const dishCategory = dishDataElements[1].children[1];
    const dishArea = dishDataElements[2].children[1];

    dishName.style.color = "black";
    dishCategory.style.color = "black";
    dishArea.style.color = "black";
    dishImg.style.transform = "";
}

function buildMealCards(mealData){
    const {idMeal, strMealThumb, strArea, strCategory} = mealData;
    const dish = document.createElement('div');
    const dishData = document.createElement('ul');
    const dishImg = document.createElement('img');
    dish.classList.add('dish');
    dishData.classList.add('dish__data')
    dishImg.classList.add('dish-img');
    
    dish.setAttribute('id', idMeal);
    dishImg.src = strMealThumb;

    dishData.innerHTML = `<li>
                                <p class="dish__data__name">Double Spicy Pizasdsadza</p>
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
    dishesContent.appendChild(dish);

    hoverFunctionInCards();
}

function showSpinner(value){
    const spinner = document.querySelector('#spinner');
    (value) ? spinner.style.display = 'flex' : spinner.style.display = 'none';
}

function showAlert(message, type){
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('text-center', 'alert');

    (type === 'error')
        ? divMensaje.classList.add('alert-danger')
        : divMensaje.classList.add('alert-success');

    // Mensaje de error
    divMensaje.textContent = message;

    // Insertar ern el HTML
    alerts = document.querySelectorAll('.alert');
    if(alerts.length === 0) form.insertBefore(divMensaje, btnSearchRecipe.nextSibling);

    // Quitar el HTML
    setTimeout(() => {
        divMensaje.remove();
    }, 3000);
}





// //Función Obtener comida por ID desde la api
// function getMealByID(mealID) {
//     fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
//         .then(response => response.json())
//         .then(data => {
//             const meal = data.meals[0];

//             addMealToDOM(meal);
//         });

// }

// //Function comida aleatoria
// function getRandomMeal() {
//     //limpiar mealsElement y el heading
//     mealsElement.innerHTML = '';
//     resultHeading.innerHTML = '';

//     fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
//         .then(response => response.json())
//         .then(data => {
//             const meal = data.meals[0];

//             addMealToDOM(meal);
//         });
// }


// //Función Agregar comida a DOM
// function addMealToDOM(meal) {
//     const ingredients = [];

//     for (let i = 1; i < 30; i++) {
//         if (meal[`strIngredient${i}`]) {
//             ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
//         } else {
//             break;
//         }
//     }

//     singleMealElement.innerHTML = `
//         <div class="single-meal">
//             <h1>${meal.strMeal}</h1>
//             <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
//             <div class="single-meal-info">
//                 ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
//                 ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
//             </div>
//             <div class="main">
//                 <p>${meal.strInstructions}</p>
//                 <h2>Ingredients</h2>
//                 <ol>
//                     ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
//                 </ol>
//             </div>
//         </div>
//     `;
// }

