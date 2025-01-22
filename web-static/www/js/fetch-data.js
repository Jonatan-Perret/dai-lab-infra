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
                </div>
            `;

            row.appendChild(col); // Ajoute la colonne à la ligne
        }

        targetElement.appendChild(row); // Ajoute la ligne au conteneur
    } else {
        console.warn('Aucun élément avec l\'ID "api-data" trouvé sur la page.');
    }
}

// Démarrer les appels périodiques
setInterval(fetchData, interval);

// Premier appel immédiat pour éviter d'attendre le premier intervalle
fetchData();
