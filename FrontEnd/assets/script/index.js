let allWorks; // Variable pour stocker toutes les œuvres

// Ajouter un EventListener au bouton de déconnexion
const logoutButton = document.getElementById('log-button');

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

// Pour afficher les images des Works dans la modale
async function renderWorksInModal(works) {
    let html = '';
    works.forEach(work => {
      html += `<img src="${work.imageUrl}" alt="${work.title}" class="modal-image">`;
    });
  
    let galleryDiv = document.getElementById('modal-gallery');
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
    await renderWorksInModal(allWorks);
}

// Appeler la fonction d'initialisation
initialize();

//Maintenant je suis connecte

// Vérifier la connexion au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('token');

    if (token) {
        console.log('Token stocké :', token);
        // Je suis connecté
        updatePageForUser();
    }
});

// Fonction de déconnexion
function logout() {
    // Supprimer le token du local storage
    localStorage.removeItem('token');
    // Rediriger vers la page de login
    window.location.href = 'index.html';
}

// Fonction pour faire les changements sur la page lorsque je suis connecté
function updatePageForUser() {
    // Modifier le texte du bouton de connexion
    const loginButton = document.getElementById('log-button');
    // Stockage du token
    const token = localStorage.getItem('token');
    // Boutons de filtre
    const filterButtonsContainer = document.getElementById('buttons');
    // Bandeau noir Mode Edition
    const adminBanner = document.getElementById('admin-banner');
    // Bouton "modifier"
    const modifyButton = document.getElementById('modify-button');
    if (token) {
        loginButton.textContent = 'Logout';
        filterButtonsContainer.style.display = 'none';
        adminBanner.style.display = 'block';
        modifyButton.style.display = 'flex';
    }
    else {
        loginButton.textContent = 'Login';
        modifyButton.style.display = 'none';
    }
}

const modal = document.getElementById('myModal');
const closeBtn = document.getElementsByClassName('close')[0];
// Sélectionner le bouton "Modifier"
const modifyButton = document.getElementById('modify-button');

// Gestionnaire d'événement pour le clic sur la croix
closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Gestionnaire d'événement pour le clic en dehors de la modal
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});


// Gestionnaire d'événement pour le clic sur le bouton "modifier"
modifyButton.addEventListener('click', function() {
    // Afficher la modal en changeant le style display
    modal.style.display = 'block';
});


function initEventListener() {
    // Ajout de l'EventListener pour le bouton "se connecter"
    
    logoutButton.addEventListener('click', logout);
}




function init() {
    initEventListener();
    updatePageForUser();
    
}

init();

