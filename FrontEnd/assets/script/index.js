// URL de l'API pour recuperer les works
const apiWorks = 'http://localhost:5678/api/works';

// Div avec l'ID "gallery" dans l'HTML pour pouvoir afficher les éléments.
const galleryDiv = document.getElementById('gallery');

// Utiliser Fetch pour effectuer une requête GET
fetch(apiWorks)
    .then(response => {
        // Vérifier si la requête a réussi (statut 200)
        if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }
        // Réponse JSON
        return response.json();
    })
    .then(data => {
        // Parcourir les éléments dans la réponse du serveur
        data.forEach(item => {
            // Créer un élément figure
            const figureElement = document.createElement('figure');

            // Créer un élément d'image + alt image
            const imageElement = document.createElement('img');
            imageElement.src = item.imageUrl;
            imageElement.alt = item.title;

            // Créer un élément figcaption avec le titre du projet
            const figcaptionElement = document.createElement('figcaption');
            figcaptionElement.textContent = item.title;

            // Ajouter l'image et le figcaption à la figure
            figureElement.appendChild(imageElement);
            figureElement.appendChild(figcaptionElement);

            // Ajouter la figure à la galerie
            galleryDiv.appendChild(figureElement);
        });
    })


    // Message d'erreur si les données ne peuvent être récupérées
    .catch(error => {
        console.error('Erreur lors de la récupération des données:', error);
    });

// URL de l'API pour récupérer les catégories
const apiCategories = 'http://localhost:5678/api/categories';

// Utiliser Fetch pour effectuer une requête GET
fetch(apiCategories)
    .then(response => {
        // Vérifier si la requête a réussi (statut 200)
        if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }
        // Réponse JSON
        return response.json();
    })
    .then(categories => {
        // Les categories sont recuperes
        console.log(categories);
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des catégories:', error);
    });