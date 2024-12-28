package app;

import io.javalin.Javalin;

public class Main {

    public static void main(String[] args) {
        Javalin app = Javalin.create().start(7000);

        WineController wineController = new WineController();
        app.get("/api/wines", wineController::getAll);
        app.get("/api/wines/red", wineController::getAllRed);
        app.get("/api/wines/white", wineController::getAllWhite);
        app.get("/api/wines/rose", wineController::getAllRose);
        app.post("/api/wines/", wineController::create);
        app.put("/api/wines/{id}", wineController::update);
        app.patch("/api/wines/{id}", ctx -> wineController.updateQuantity(ctx));
        app.delete("/api/wines/{id}", wineController::delete);
    }
}
