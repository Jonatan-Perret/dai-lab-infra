// Configuration de l'URL de base de l'API
const apiBaseUrl = 'https://api.dai.heig-vd.ch/api/wines';
const interval = 5000; // Intervalle de 5 secondes

// Fonction pour récupérer les données de l'API en fonction du filtre
async function fetchData(filter = 'all') {
    try {
        // Construire l'URL en fonction du filtre
        let apiUrl = apiBaseUrl;
        if (filter !== 'all') {
            // Remplace "rosé" par "rose" pour l'URL
            const normalizedFilter = filter === 'rosé' ? 'rose' : filter;
            apiUrl = `${apiBaseUrl}/${normalizedFilter}`;
        }

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

        const row = document.createElement('div');
        row.className = 'row';

        for (const key in data) {
            const wine = data[key];

            const col = document.createElement('div');
            col.className = 'col-md-6';

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

            row.appendChild(col);
        }

        targetElement.appendChild(row);

        const editButtons = document.querySelectorAll('.btn-edit');
        editButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const wineId = button.getAttribute('data-id');
                const wine = data[wineId];
                if (wine) {
                    openEditForm(wineId, wine);
                } else {
                    console.error(`Vin avec l'ID ${wineId} introuvable.`);
                }
            });
        });
    } else {
        console.warn('Aucun élément avec l\'ID "api-data" trouvé sur la page.');
    }
}

// Fonction pour ouvrir la modale d'ajout de vin
function openAddForm() {
    const addForm = document.getElementById('add-form');
    if (!addForm) {
        console.error('Le formulaire d\'ajout (add-form) est introuvable.');
        return;
    }

    addForm.reset();

    const saveButton = document.getElementById('save-new-wine');
    saveButton.onclick = async (e) => {
        e.preventDefault();

        const formData = new FormData(addForm);
        const newWineData = {};
        formData.forEach((value, key) => {
            newWineData[key] = value;
        });

        try {
            const response = await fetch(apiBaseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newWineData),
            });

            if (!response.ok) {
                throw new Error(`Erreur lors de l'ajout: ${response.status}`);
            }

            alert('Nouveau vin ajouté avec succès');
            fetchData();
            $('#add-modal').modal('hide');
        } catch (error) {
            console.error('Erreur lors de l\'ajout du vin:', error);
        }
    };

    $('#add-modal').modal('show');
}

// Fonction pour ouvrir la modale d'édition d'un vin
function openEditForm(wineId, wineData) {
    const editForm = document.getElementById('edit-form');
    editForm.elements['name'].value = wineData.name;
    editForm.elements['producer'].value = wineData.producer;
    editForm.elements['type'].value = wineData.type;
    editForm.elements['region'].value = wineData.region;
    editForm.elements['vintage'].value = wineData.vintage;
    editForm.elements['price'].value = wineData.price;
    editForm.elements['quantity'].value = wineData.quantity;

    const saveButton = document.getElementById('save-changes');
    saveButton.onclick = async (e) => {
        e.preventDefault();

        const formData = new FormData(editForm);
        const updatedData = {};
        formData.forEach((value, key) => {
            updatedData[key] = value;
        });

        try {
            const response = await fetch(`${apiBaseUrl}/${wineId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error(`Erreur lors de la mise à jour: ${response.status}`);
            }

            alert('Vin mis à jour avec succès');
            fetchData();
            $('#edit-modal').modal('hide');
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
        }
    };

    const deleteButton = document.getElementById('delete-wine');
    deleteButton.onclick = async () => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer le vin "${wineData.name}" ?`)) {
            return;
        }

        try {
            const response = await fetch(`${apiBaseUrl}/${wineId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Erreur lors de la suppression: ${response.status}`);
            }

            alert('Vin supprimé avec succès');
            fetchData();
            $('#edit-modal').modal('hide');
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    $('#edit-modal').modal('show');
}

// Ajouter un gestionnaire d'événements pour le filtre
document.getElementById('wine-filter').addEventListener('change', (event) => {
    const selectedFilter = event.target.value;
    fetchData(selectedFilter);
});

// Ajouter un gestionnaire d'événements pour le bouton "Ajouter un vin"
document.getElementById('add-wine').addEventListener('click', openAddForm);

// Charger les données initiales avec le filtre "tous"
fetchData();
setInterval(() => {
    const currentFilter = document.getElementById('wine-filter').value;
    fetchData(currentFilter);
}, interval);
