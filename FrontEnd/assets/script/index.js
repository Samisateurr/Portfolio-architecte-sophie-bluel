let allWorks; // Variable pour stocker toutes les œuvres

async function getWorks() {
    let url = 'http://localhost:5678/api/works';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function renderWorks(works) {
    let html = '';
    works.forEach(work => {
        let htmlSegment = `<figure>
                                  <img src="${work.imageUrl}" alt="${work.title}">
                                  <figcaption>${work.title}</figcaption>
                               </figure>`;
        html += htmlSegment;
    });

    let galleryDiv = document.getElementById('gallery');
    galleryDiv.innerHTML = html;
}

async function filterWorks(categoryId) {
    let worksToDisplay;

    if (categoryId === 'all') {
        worksToDisplay = allWorks;
    } else {
         // Filtrez les œuvres par catégorie
         worksToDisplay = allWorks.filter(work => work.categoryId && String(work.categoryId) === String(categoryId));
        }
        
    renderWorks(worksToDisplay);
}

// Fonction à appeler lors du clic sur un bouton de catégorie
function categoryButtonClick() {
    let categoryId = this.dataset.categoryId;
    filterWorks(categoryId);
}

async function getCategories() {
    let url = 'http://localhost:5678/api/categories';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function renderCategories() {
    let categories = await getCategories();
    let html = '';

    // Ajouter le bouton "Tous"
    html += `<button class="categoryButton" data-category-id="all">Tous</button>`;

    // Ajouter les boutons pour chaque catégorie
    categories.forEach(category => {
        let htmlSegment = `<button class="categoryButton" data-category-id="${category.id}">${category.name}</button>`;
        html += htmlSegment;
    });

    let buttonsDiv = document.getElementById('buttons');
    buttonsDiv.innerHTML = html;

    // Ajouter EventListener pour chaque bouton
    document.querySelectorAll('.categoryButton').forEach(button => {
        button.addEventListener('click', categoryButtonClick);
    });

    // Initialiser la variable allWorks avec toutes les œuvres
    allWorks = await getWorks();

    // Afficher toutes les œuvres au chargement de la page
    renderWorks(allWorks);
}

// Fonction d'initialisation
async function initialize() {
    await renderCategories();
}

// Appeler la fonction d'initialisation
initialize();