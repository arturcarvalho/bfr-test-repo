data class User(
    val id: Int,
    val name: String,
    val email: String
)

class UserRepository {
    private val users = mutableListOf<User>()

    fun add(user: User) {
        users.add(user)
    }

    fun findById(id: Int): User? {
        return users.find { it.id == id }
    }

    fun findAll(): List<User> {
        return users.toList()
    }

    fun remove(id: Int): Boolean {
        return users.removeIf { it.id == id }
    }
}

fun main() {
    val repo = UserRepository()
    repo.add(User(1, "Alice", "alice@example.com"))
    repo.add(User(2, "Bob", "bob@example.com"))

    println("All users: ${repo.findAll()}")
    println("User 1: ${repo.findById(1)}")
}
