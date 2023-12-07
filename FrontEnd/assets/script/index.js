async function getWorks() {
    let url = 'http://localhost:5678/api/works';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function renderWorks() {
    let works = await getWorks();
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

// Appeler la fonction pour afficher les Works
renderWorks();

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



    // Ajouter les boutons pour chaques categories
    categories.forEach(category => {
        let htmlSegment = `<button class="categoryButton" data-category-id="${category.id}">${category.name}</button>`;
        html += htmlSegment;
    });


    let buttonsDiv = document.getElementById('buttons');
    buttonsDiv.innerHTML = html;

    // Ajouter EventListener pour chaque button
    document.querySelectorAll('.categoryButton').forEach(button => {
        button.addEventListener('click', categoryButtonClick);
    });

    // Appel pour afficher tous les works au chargement de la page
    renderWorks();
}


// Appeler la fonction pour afficher les categories
renderCategories();