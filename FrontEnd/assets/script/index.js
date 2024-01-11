let allWorks; // Variable pour stocker toutes les œuvres

const token = localStorage.getItem('token');

// Bouton de déconnexion
const logoutButton = document.getElementById('log-button');

// Sélectionner la modale
const modal = document.getElementById('myModal');
// Sélectionner la bouton pour fermer la modale
const closeBtn = document.getElementsByClassName('close')[0];
// Sélectionner le bouton "Modifier"
const modifyButton = document.getElementById('modify-button');
// Sélectionner le bouton "ajouter une photo"
const modalButton = document.querySelector('.modal-button');
// Titre de la modale
const modalTitle = document.getElementById('modal-title');
// Bouton de retour de la modale
const modalBackButton = document.getElementById('modal-back-btn');



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
        html += `<div class="modal-image-container">
        <img src="${work.imageUrl}" alt="${work.title}" class="modal-image">
        <i class="fa-solid fa-trash-can modal-delete-icon" data-work-id="${work.id}"></i>
     </div>`;
    });

    let galleryDiv = document.getElementById('modal-gallery');
    galleryDiv.innerHTML = html;

    // Appel de la fonction pour supprimer un work
    addDeleteEventListeners();
}

// Fonction pour ajouter un EventListener aux icônes de poubelle
function addDeleteEventListeners() {
    // EventListener pour chaque icône de poubelle
    document.querySelectorAll('.modal-delete-icon').forEach(icon => {
        icon.addEventListener('click', function (event) {
            // Obtenir l'ID du work correspondant
            const workId = event.target.dataset.workId;


            // Ajouter un console.log pour voir si la fonction deleteWork est appelée
            console.log('Clic sur icône de poubelle avec ID du work :', workId);


            // Appeler la fonction pour supprimer le travail
            deleteWork(workId, token);
        });
    });
}

// Fonction pour supprimer un projet 
async function deleteWork(workId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
        });

        if (response.ok) {
            console.log('Work supprimé !');

            // Actualiser la galerie après la suppression réussie
            const updatedWorks = await getWorks();
            renderWorksInModal(updatedWorks);
            renderWorks(updatedWorks);

        } else {
            // Gérer les autres codes de réponse 
            console.error('Échec de la suppression');
        }
    } catch (error) {
        console.error('Erreur lors de la requête :', error);
    }
}

//Modale 2
// Fonction pour soumettre le formulaire
async function submitForm() {
    // Récupérez le formulaire
    const form = document.getElementById('newWorkForm');

    // Créez un objet FormData à partir du formulaire
    const formData = new FormData(form);

    // Récupérez les valeurs des champs du formulaire
    const image = document.getElementById('image-input').files[0];
    const title = document.getElementById('text-input').value;
    const categoryId = document.getElementById('categorySelect').value;

    // Ajoutez les valeurs des champs spécifiques à l'objet FormData existant
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", categoryId);

    // Récupérez le token
    const token = localStorage.getItem('token');

    // Ajoutez cette ligne pour afficher le token dans la console avant l'envoi de la requête
    console.log("Token avant envoi de la requête :", token);

    // Envoyez les données au serveur via une requête POST
    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: formData,
            headers: {
                "Authorization": "Bearer " + token
            },
        });

        if (response.ok) {
            // La requête a réussi, ajout d'actions supplémentaires
            console.log('Nouveau work ajouté avec succès !');
            // Actualiser la galerie après ajout réussi
            const updatedWorks = await getWorks(); // Assurez-vous que getWorks est défini dans votre code
            renderWorksInModal(updatedWorks);
            renderWorks(updatedWorks);
        } else {
            // La requête a échoué, gérez les erreurs ici
            console.error('Erreur ajout du nouveau work');
        }
    } catch (error) {
        console.error('Erreur lors de la requête :', error);
    }
}

// Apercu de l'image avant ajout !

// Sélectionnez l'élément d'entrée de fichier
const fileInput = document.getElementById('image-input');

// Ajoutez un gestionnaire d'événements pour écouter les changements
fileInput.addEventListener('change', handleFileInputChange);

function handleFileInputChange() {
    // Sélectionnez l'élément d'aperçu de l'image
    const imagePreview = document.getElementById('image-preview');

    // Sélectionnez le label "Ajouter photo"
    const addPhotoLabel = document.getElementById('add-photo-label');

    // Sélectionnez l'élément image-description
    const imageDescription = document.getElementById('image-description');

    // Vérifiez s'il y a un fichier sélectionné
    if (fileInput.files.length > 0) {
        // Cachez l'élément image-description
        imageDescription.style.display = 'none';
    } else {
        // Affichez l'élément image-description s'il n'y a pas de fichier sélectionné
        imageDescription.style.display = 'block';
    }


    // Vérifiez s'il y a un fichier sélectionné
    if (fileInput.files.length > 0) {
        // Obtenez le fichier sélectionné
        const selectedFile = fileInput.files[0];

        // Créez un objet URL pour l'aperçu de l'image
        const imageURL = URL.createObjectURL(selectedFile);

        // Mettez à jour l'attribut src de l'élément d'aperçu de l'image
        imagePreview.src = imageURL;

        // Affichez l'élément d'aperçu de l'image
        imagePreview.style.display = 'block';

        // Cachez le label "Ajouter photo"
        addPhotoLabel.style.display = 'none';
    } else {
        // Cachez l'élément d'aperçu de l'image s'il n'y a pas de fichier sélectionné
        imagePreview.style.display = 'none';

        // Affichez le label "Ajouter photo"
        addPhotoLabel.style.display = 'block';
    }
}

// Possibilité d'ajout dynamique pour les options de la catégorie provenant de l'API
// Ajout d'options statiques pour la catégorie
const categorySelect = document.getElementById('categorySelect');
const categories = ['Objet', 'Appartements', 'Hotels & restaurants'];
categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
});

// EventListener pour le bouton de la modale
modalButton.addEventListener('click', function () {
    // Changer le titre
    modalTitle.textContent = 'Ajout photo';
    // Cacher les works
    document.getElementById('modal-gallery').style.display = 'none';
    // Afficher le bouton de retour
    modalBackButton.style.display = 'block';
    // Changez le bouton en "Valider"
    modalButton.textContent = 'Valider';
    // Afficher le formulaire 
    document.getElementsByClassName('work-form')[0].style.display = 'block';
    if (document.getElementsByClassName('work-form')[0].style.display === 'block') {
        // Appeler la fonction pour soumettre le formulaire lorsque le bouton est cliqué
        submitForm();
    }
});

// EventListener pour retourner a la Modale 1
modalBackButton.addEventListener('click', function () {
    // Changer le titre
    modalTitle.textContent = 'Galerie Photo';
    // Afficher les works
    document.getElementById('modal-gallery').style.display = 'grid';
    // Cacher le bouton de retour
    modalBackButton.style.display = 'none';
    // Changez le bouton en "Ajouter une photo"
    modalButton.textContent = 'Ajouter une photo';
    // Cacher le Formulaire
    document.getElementsByClassName('work-form')[0].style.display = 'none';
});

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




function initEventListener() {
    // EventListener pour le bouton "se connecter"
    logoutButton.addEventListener('click', logout);

    // EventListener pour le clic sur la croix
    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // EventListener pour le clic en dehors de la modal
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // EventListener pour le clic sur le bouton "modifier"
    modifyButton.addEventListener('click', function () {
        // Afficher la modal en changeant le style display
        modal.style.display = 'block';
    });

}


function init() {
    initEventListener();
    // Appeler la fonction pour ajouter les gestionnaires d'événements lors de l'initialisation
    addDeleteEventListeners();
    updatePageForUser();

}

init();