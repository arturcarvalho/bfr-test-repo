interface User {
  id: number;
  name: string;
  email: string;
}

function greet(user: User): string {
  return `Hello, ${user.name}!`;
}

async function fetchUsers(): Promise<User[]> {
  const response = await fetch("/api/users");
  return response.json();
}

const admin: User = {
  id: 1,
  name: "Admin",
  email: "admin@example.com",
};

export { greet, fetchUsers, admin };
