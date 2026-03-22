import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class Service {
    private final List<String> items;

    public Service() {
        this.items = new ArrayList<>();
    }

    public void addItem(String item) {
        if (item != null && !item.isEmpty()) {
            items.add(item);
        }
    }

    public Optional<String> getItem(int index) {
        if (index >= 0 && index < items.size()) {
            return Optional.of(items.get(index));
        }
        return Optional.empty();
    }

    public List<String> getAllItems() {
        return List.copyOf(items);
    }

    public int count() {
        return items.size();
    }

    public static void main(String[] args) {
        Service service = new Service();
        service.addItem("first");
        service.addItem("second");
        System.out.println("Items: " + service.getAllItems());
        System.out.println("Count: " + service.count());
    }
}
