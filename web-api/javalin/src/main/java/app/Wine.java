package app;

public class Wine {

    private String name;
    private String producer;
    private String type;  // Rouge, Blanc, Rosé
    private String region;
    private int vintage;  // Millésime
    private double price;
    private int quantity;

    // Constructeur par défaut
    public Wine() {
    }

    // Constructeur complet
    public Wine(String name, String producer, String type, String region, int vintage, double price, int quantity) {
        this.name = name;
        this.producer = producer;
        this.type = type;
        this.region = region;
        this.vintage = vintage;
        this.price = price;
        this.quantity = quantity;
    }

    // Getters
    public String getName() {
        return name;
    }

    public String getProducer() {
        return producer;
    }

    public String getType() {
        return type;
    }

    public String getRegion() {
        return region;
    }

    public int getVintage() {
        return vintage;
    }

    public double getPrice() {
        return price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {

        this.quantity = quantity;

    }
}
