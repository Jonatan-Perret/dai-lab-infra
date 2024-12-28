package app;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import io.javalin.http.Context;

class WineController {

    // "Database" of users
    // Since the server is multi-threaded, we need to use a thread-safe data structure
    // such as ConcurrentHashMap or HashMap
    private final ConcurrentHashMap<Integer, Wine> wines = new ConcurrentHashMap<>();
    private int lastId = 0;

    public WineController() {
        // Add some users to the "database"
        wines.put(++lastId, new Wine("Pinot gris", "Les Freres Dutruy", "Blanc", "Valais", 2023, 15.0, 1));
        wines.put(++lastId, new Wine("Bordeaux", "Château Lamothe", "Rouge", "Bordeaux", 2019, 25.0, 20));
        wines.put(++lastId, new Wine("Bordeaux", "Mise de la Baronnie", "Rouge", "Bordeaux", 2018, 30.0, 10));
        wines.put(++lastId, new Wine("Chardonnay", "Les Freres Dutruy", "Blanc", "Valais", 2022, 20.0, 5));
        wines.put(++lastId, new Wine("Rosé", "Les Freres Dutruy", "Rosé", "Valais", 2022, 18.0, 3));
        wines.put(++lastId, new Wine("Oeil de Perdrix", "Caves du Château d’Auvernier", "Rosé", "Neuchâtel", 2021, 22.0, 8));
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
