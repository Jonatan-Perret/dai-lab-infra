package app;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import io.javalin.http.Context;

class WineController {

    // "Database" of wines
    // Since the server is multi-threaded, we need to use a thread-safe data structure
    // such as ConcurrentHashMap or HashMap
    private final ConcurrentHashMap<Integer, Wine> wines = new ConcurrentHashMap<>();
    private int lastId = 0;

    public WineController() {
        // Add Red Wines
        wines.put(++lastId, new Wine("Bordeaux", "Château Lamothe", "Rouge", "Bordeaux", 2019, 25.0, 20));
        wines.put(++lastId, new Wine("Bordeaux", "Mise de la Baronnie", "Rouge", "Bordeaux", 2018, 30.0, 10));
        wines.put(++lastId, new Wine("Merlot", "Château Margaux", "Rouge", "Bordeaux", 2020, 35.0, 15));
        wines.put(++lastId, new Wine("Syrah", "Domaine Jean-Louis Chave", "Rouge", "Rhône", 2021, 40.0, 12));
        wines.put(++lastId, new Wine("Zinfandel", "Ridge Vineyards", "Rouge", "Californie", 2020, 28.0, 25));
        wines.put(++lastId, new Wine("Cabernet Sauvignon", "Robert Mondavi", "Rouge", "Napa Valley", 2019, 50.0, 18));
        wines.put(++lastId, new Wine("Grenache", "Clos Saint Jean", "Rouge", "Rhône", 2020, 32.0, 20));

        // Add White Wines
        wines.put(++lastId, new Wine("Pinot gris", "Les Freres Dutruy", "Blanc", "Valais", 2023, 15.0, 1));
        wines.put(++lastId, new Wine("Chardonnay", "Les Freres Dutruy", "Blanc", "Valais", 2022, 20.0, 5));
        wines.put(++lastId, new Wine("Riesling", "Dr. Loosen", "Blanc", "Mosel", 2021, 22.0, 10));
        wines.put(++lastId, new Wine("Sauvignon Blanc", "Cloudy Bay", "Blanc", "Marlborough", 2022, 25.0, 8));
        wines.put(++lastId, new Wine("Gewürztraminer", "Zind-Humbrecht", "Blanc", "Alsace", 2021, 30.0, 7));
        wines.put(++lastId, new Wine("Chenin Blanc", "Domaine Huet", "Blanc", "Loire", 2022, 18.0, 9));
        wines.put(++lastId, new Wine("Viognier", "Domaine Georges Vernay", "Blanc", "Rhône", 2022, 27.0, 6));

        // Add Rosé Wines
        wines.put(++lastId, new Wine("Rosé", "Les Freres Dutruy", "Rosé", "Valais", 2022, 18.0, 3));
        wines.put(++lastId, new Wine("Oeil de Perdrix", "Caves du Château d’Auvernier", "Rosé", "Neuchâtel", 2021, 22.0, 8));
        wines.put(++lastId, new Wine("Côtes de Provence Rosé", "Domaines Ott", "Rosé", "Provence", 2021, 26.0, 15));
        wines.put(++lastId, new Wine("Tavel", "Domaine de la Mordorée", "Rosé", "Rhône", 2022, 22.0, 12));
        wines.put(++lastId, new Wine("Pinot Noir Rosé", "Domaine Drouhin", "Rosé", "Oregon", 2021, 24.0, 10));
        wines.put(++lastId, new Wine("Grenache Rosé", "Miraval", "Rosé", "Provence", 2022, 28.0, 8));
        wines.put(++lastId, new Wine("Cabernet Franc Rosé", "Chinon", "Rosé", "Loire", 2021, 18.0, 20));
    }

    public void getAll(Context ctx) {
        ctx.json(wines);
    }

    public void getAllRed(Context ctx) {
        // Filtrer les vins rouges et conserver leur ID
        Map<Integer, Wine> redWines = wines.entrySet().stream()
                .filter(entry -> entry.getValue().getType().equals("Rouge"))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        ctx.json(redWines);
    }

    public void getAllWhite(Context ctx) {
        // Filtrer les vins blancs et conserver leur ID
        Map<Integer, Wine> whiteWines = wines.entrySet().stream()
                .filter(entry -> entry.getValue().getType().equals("Blanc"))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        ctx.json(whiteWines);
    }

    public void getAllRose(Context ctx) {
        // Filtrer les vins rosés et conserver leur ID
        Map<Integer, Wine> roseWines = wines.entrySet().stream()
                .filter(entry -> entry.getValue().getType().equals("Rosé"))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        ctx.json(roseWines);
    }

    public void create(Context ctx) {
        Wine wine = ctx.bodyAsClass(Wine.class);
        wines.put(++lastId, wine);
        ctx.status(201);
    }

    public void delete(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        wines.remove(id);
        ctx.status(204);
    }

    public void update(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        Wine wine = ctx.bodyAsClass(Wine.class);
        wines.put(id, wine);
        ctx.status(200);
    }

    public void updateQuantity(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        int quantity = ctx.bodyAsClass(Wine.class).getQuantity();
        wines.get(id).setQuantity(quantity);
        ctx.status(200);
    }

}
