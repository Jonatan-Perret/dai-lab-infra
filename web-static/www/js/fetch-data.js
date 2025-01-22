// Configuration de l'URL de l'API et de l'intervalle en millisecondes
const apiUrl = 'https://api.dai.heig-vd.ch/api/wines'; // Remplacez par l'URL de votre API
const interval = 5000; // Intervalle de 5 secondes

// Fonction pour récupérer les données de l'API
async function fetchData() {
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Erreur: ${response.status}`);
        }

        const data = await response.json();

        // Mettre à jour le contenu de la page avec les données récupérées
        updatePageContent(data);
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
    }
}

// Fonction pour mettre à jour le contenu de la page Web
function updatePageContent(data) {
    const targetElement = document.getElementById('api-data');

    if (targetElement) {
        targetElement.innerHTML = ''; // Efface le contenu précédent

        // Crée une structure pour les éléments
        const row = document.createElement('div');
        row.className = 'row';

        for (const key in data) {
            const wine = data[key];

            // Crée une colonne pour chaque élément
            const col = document.createElement('div');
            col.className = 'col-md-6';

            // Structure du contenu (basée sur votre exemple)
            col.innerHTML = `
                <div class="service-item">
                    <h4>${wine.name}</h4>
                    <div class="line-dec"></div>
                    <p><strong>Producteur:</strong> ${wine.producer}</p>
                    <p><strong>Type:</strong> ${wine.type}</p>
                    <p><strong>Région:</strong> ${wine.region}</p>
                    <p><strong>Millésime:</strong> ${wine.vintage}</p>
                    <p><strong>Prix:</strong> ${wine.price} CHF</p>
                    <p><strong>Quantité:</strong> ${wine.quantity}</p>
                    <button class="btn btn-primary btn-edit" data-id="${key}">Modifier</button>
                </div>
            `;

            row.appendChild(col); // Ajoute la colonne à la ligne
        }

        targetElement.appendChild(row); // Ajoute la ligne au conteneur

        // Ajouter les gestionnaires d'événements pour les boutons "Modifier"
        const editButtons = document.querySelectorAll('.btn-edit');
        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const wineId = button.getAttribute('data-id'); // Assure un accès correct via l'ID en string
                const wine = data[wineId];
                if (wine) {
                    openEditForm(wineId, wine); // Ouvre le formulaire d'édition
                } else {
                    console.error(`Vin avec l'ID ${wineId} introuvable.`);
                }
            });
        });
    } else {
        console.warn('Aucun élément avec l\'ID "api-data" trouvé sur la page.');
    }
}

// Fonction pour afficher le formulaire d'édition
function openEditForm(wineId, wineData) {
    // Crée un formulaire HTML
    const formHtml = `
        <form id="edit-form">
            <h4>Modifier le vin : ${wineData.name}</h4>
            <label>Nom:</label>
            <input type="text" name="name" value="${wineData.name}" required>
            <label>Producteur:</label>
            <input type="text" name="producer" value="${wineData.producer}" required>
            <label>Type:</label>
            <input type="text" name="type" value="${wineData.type}" required>
            <label>Région:</label>
            <input type="text" name="region" value="${wineData.region}" required>
            <label>Millésime:</label>
            <input type="number" name="vintage" value="${wineData.vintage}" required>
            <label>Prix (CHF):</label>
            <input type="number" step="0.01" name="price" value="${wineData.price}" required>
            <label>Quantité:</label>
            <input type="number" name="quantity" value="${wineData.quantity}" required>
            <button type="submit" class="btn btn-success">Enregistrer</button>
            <button type="button" class="btn btn-secondary" id="cancel-edit">Annuler</button>
        </form>
    `;

    // Affiche le formulaire dans une boîte de dialogue ou un modal
    const modalContainer = document.createElement('div');
    modalContainer.id = 'edit-modal';
    modalContainer.innerHTML = formHtml;
    document.body.appendChild(modalContainer);

    // Gestion des événements du formulaire
    const editForm = document.getElementById('edit-form');
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Récupère les données du formulaire
        const formData = new FormData(editForm);
        const updatedData = {};
        formData.forEach((value, key) => {
            updatedData[key] = value;
        });

        // Envoie une requête PUT ou PATCH pour mettre à jour le vin
        try {
            const response = await fetch(`${apiUrl}/${wineId}`, {
                method: 'PUT', // Ou 'PATCH', selon votre API
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error(`Erreur lors de la mise à jour: ${response.status}`);
            }

            alert('Vin mis à jour avec succès');
            fetchData(); // Recharge les données pour refléter les changements
            modalContainer.remove(); // Ferme le modal
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
        }
    });

    // Bouton Annuler
    document.getElementById('cancel-edit').addEventListener('click', () => {
        modalContainer.remove();
    });
}

// Démarrer les appels périodiques
setInterval(fetchData, interval);
fetchData(); // Premier appel immédiat
