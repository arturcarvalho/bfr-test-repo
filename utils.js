function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = { debounce, deepClone, capitalize };
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function processUserData(users) {
  const results = [];
  const errors = [];
  const warnings = [];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const entry = {
      id: user.id,
      name: null,
      email: null,
      age: null,
      role: null,
      status: "pending",
      score: 0,
      tags: [],
      metadata: {},
      createdAt: null,
      updatedAt: null,
    };

    if (!user.name || typeof user.name !== "string") {
      errors.push({ userId: user.id, field: "name", message: "Name is required and must be a string" });
      entry.status = "invalid";
      continue;
    }
    entry.name = user.name.trim();

    if (entry.name.length < 2) {
      errors.push({ userId: user.id, field: "name", message: "Name must be at least 2 characters" });
      entry.status = "invalid";
      continue;
    }

    if (entry.name.length > 100) {
      warnings.push({ userId: user.id, field: "name", message: "Name exceeds recommended length" });
      entry.name = entry.name.substring(0, 100);
    }

    if (!user.email) {
      errors.push({ userId: user.id, field: "email", message: "Email is required" });
      entry.status = "invalid";
      continue;
    }

    if (!validateEmail(user.email)) {
      errors.push({ userId: user.id, field: "email", message: "Invalid email format" });
      entry.status = "invalid";
      continue;
    }
    entry.email = user.email.toLowerCase().trim();

    const existingEmail = results.find((r) => r.email === entry.email);
    if (existingEmail) {
      errors.push({ userId: user.id, field: "email", message: "Duplicate email found" });
      entry.status = "duplicate";
      continue;
    }

    if (user.age !== undefined && user.age !== null) {
      const age = parseInt(user.age, 10);
      if (isNaN(age)) {
        warnings.push({ userId: user.id, field: "age", message: "Age is not a valid number" });
      } else if (age < 0 || age > 150) {
        warnings.push({ userId: user.id, field: "age", message: "Age is out of reasonable range" });
      } else {
        entry.age = age;
      }
    }

    const validRoles = ["admin", "user", "moderator", "editor", "viewer"];
    if (user.role) {
      const normalizedRole = user.role.toLowerCase().trim();
      if (validRoles.includes(normalizedRole)) {
        entry.role = normalizedRole;
      } else {
        warnings.push({ userId: user.id, field: "role", message: "Unknown role, defaulting to viewer" });
        entry.role = "viewer";
      }
    } else {
      entry.role = "viewer";
    }

    if (entry.role === "admin" && entry.age !== null && entry.age < 18) {
      errors.push({ userId: user.id, field: "role", message: "Admins must be at least 18 years old" });
      entry.status = "invalid";
      continue;
    }

    if (Array.isArray(user.tags)) {
      for (const tag of user.tags) {
        if (typeof tag === "string" && tag.trim().length > 0) {
          const normalized = tag.trim().toLowerCase();
          if (!entry.tags.includes(normalized)) {
            entry.tags.push(normalized);
          }
        }
      }
    }

    if (entry.tags.length > 20) {
      warnings.push({ userId: user.id, field: "tags", message: "Too many tags, truncating to 20" });
      entry.tags = entry.tags.slice(0, 20);
    }

    let score = 0;
    if (entry.name) score += 10;
    if (entry.email) score += 10;
    if (entry.age !== null) score += 5;
    if (entry.role !== "viewer") score += 5;
    if (entry.tags.length > 0) score += entry.tags.length * 2;

    if (user.profileComplete) score += 15;
    if (user.emailVerified) score += 20;
    if (user.twoFactorEnabled) score += 25;

    if (score > 100) score = 100;
    entry.score = score;

    if (user.metadata && typeof user.metadata === "object") {
      const allowedKeys = ["bio", "website", "location", "company", "twitter", "github"];
      for (const key of allowedKeys) {
        if (user.metadata[key] && typeof user.metadata[key] === "string") {
          entry.metadata[key] = user.metadata[key].trim().substring(0, 500);
        }
      }
    }

    const now = new Date().toISOString();
    entry.createdAt = user.createdAt || now;
    entry.updatedAt = now;

    if (entry.score >= 80) {
      entry.status = "premium";
    } else if (entry.score >= 50) {
      entry.status = "active";
    } else if (entry.score >= 20) {
      entry.status = "basic";
    } else {
      entry.status = "incomplete";
    }

    if (user.suspended === true) {
      entry.status = "suspended";
      warnings.push({ userId: user.id, field: "status", message: "User account is suspended" });
    }

    if (user.deleted === true) {
      entry.status = "deleted";
      continue;
    }

    results.push(entry);
  }

  const summary = {
    total: users.length,
    processed: results.length,
    errorCount: errors.length,
    warningCount: warnings.length,
    byStatus: {},
    byRole: {},
    averageScore: 0,
  };

  for (const r of results) {
    summary.byStatus[r.status] = (summary.byStatus[r.status] || 0) + 1;
    summary.byRole[r.role] = (summary.byRole[r.role] || 0) + 1;
  }

  if (results.length > 0) {
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    summary.averageScore = Math.round(totalScore / results.length);
  }

  return {
    results,
    errors,
    warnings,
    summary,
  };
}

function formatCurrency(amount, currency) {
  const symbols = { USD: "$", EUR: "€", GBP: "£", JPY: "¥" };
  const symbol = symbols[currency] || currency + " ";
  return symbol + amount.toFixed(2);
}

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function groupBy(array, key) {
  return array.reduce((groups, item) => {
    const value = item[key];
    if (!groups[value]) {
      groups[value] = [];
    }
    groups[value].push(item);
    return groups;
  }, {});
}

module.exports = {
  validateEmail,
  processUserData,
  formatCurrency,
  debounce,
  groupBy,
};
