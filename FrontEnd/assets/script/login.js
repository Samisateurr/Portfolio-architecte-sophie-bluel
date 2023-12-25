// Sélectionner le bouton "se connecter"
const loginButton = document.getElementById('submit');
// Ajouter un EventListener au bouton de déconnexion
const logoutButton = document.getElementById('log-button');


async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        if (response.status === 200) {
            const data = await response.json();

            // Recuperer l'identifiant et le token via l'API
            const userId = data.userId;
            const token = data.token;

            // Stocker le token
            localStorage.setItem('token', token);

            // Rediriger vers la page index.html
            window.location.href = "./index.html";
        } else if (response.status === 401) {
            alert('Votre Email ou mot de passe est incorrect');
        } else if (response.status === 404) {
            alert('Utilisateur non trouvé');
        } else {
            alert('Erreur technique');
        }
    } catch (error) {
        console.error('Erreur lors de la requête:', error);
    }
}



// Fonction de déconnexion
function logout() {
    // Supprimer le token du local storage
    localStorage.removeItem('token');

    // Rediriger vers la page de login
    window.location.href = 'login.html';
}

// Fonction pour faire les changements sur la page lorsque je suis connecté
function updatePageForUser() {
    // Modifier le texte du bouton de connexion
    const loginButton = document.getElementById('log-button');
    const token = localStorage.getItem('token');
    if (token) {
        loginButton.textContent = 'Logout';
    }
}

// Fonction pour initier  les EventListener 
function initEventListener() {
    // Ajout de l'EventListener pour le bouton "se connecter"
    loginButton.addEventListener('click', function (event) {
        // Empecher le rechargement de la page
        event.preventDefault();
        // Appeller la fonction login lorsque le bouton est cliqué
        login();
    });
    logoutButton.addEventListener('click', logout);
}


function init() {
    initEventListener();
    updatePageForUser();
}

init();
