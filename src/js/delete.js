const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsElement = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading'),
    singleMealElement = document.getElementById('single-meal');


//Función Buscar comida desde la api
function searchMeal(event) {
    event.preventDefault();

    //limpiar singleMeal
    singleMealElement.innerHTML = '';

    //Obtener término de búsqueda
    const term = search.value;

    //comprobar si está vacío
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                resultHeading.innerHTML = `<h2>Search results for '${term}'</h2>`;

                if (data.meals === null) {
                    resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
                } else {
                    mealsElement.innerHTML = data.meals.map(meal => `
                        <div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                            <div class="meal-info" data-mealID="${meal.idMeal}">
                                <h3>${meal.strMeal}</h3>
                            </div>
                        </div>
                    `).join('');
                }
            });
        //Borrar texto de búsqueda
        search.value = '';
    } else {
        alert('Please enter a search term');
    }
}

//Función Obtener comida por ID desde la api
function getMealByID(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];

            addMealToDOM(meal);
        });

}

//Function comida aleatoria
function getRandomMeal() {
    //limpiar mealsElement y el heading
    mealsElement.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];

            addMealToDOM(meal);
        });
}


//Función Agregar comida a DOM
function addMealToDOM(meal) {
    const ingredients = [];

    for (let i = 1; i < 30; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    singleMealElement.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ol>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ol>
            </div>
        </div>
    `;
}

//Event Listeners

//Event Listener buscar y mostrar comidas desde la API
submit.addEventListener('submit', searchMeal);
//Event Listener obtener comida random
random.addEventListener('click', getRandomMeal);

//Event Listener desplegar detalles de la receta
mealsElement.addEventListener('click', element => {
    const mealInfo = element.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });

    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealByID(mealID);
    }
})