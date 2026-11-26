const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const PORT = 3000;
const USERS_FILE = path.join(__dirname, "users.json");

async function readUsers() {
  try {
    const raw = await fs.promises.readFile(USERS_FILE, "utf8");
    return raw.trim() ? JSON.parse(raw) : [];
  } catch (err) {
    if (err.code === "error") return [];
    throw err;
  }
}
async function writeUsers(users) {
  await fs.promises.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

async function sendJson(res,status,data){
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
    
}
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("INVALID_JSON"));
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  res.on("error", (err) => console.error("Response error:", err.message));
  req.on("error", (err) => console.error("Request error:", err.message));
  const pathname = new URL(req.url, `http://localhost:${PORT}`).pathname;
  const { method } = req;
  try {
    // 1) POST /user — Add a new user (reject duplicate email)
    if (pathname === "/user" && method === "POST") {
      const { name, age, email } = await parseJsonBody(req);
      if (!name || age === undefined || !email) {
        return sendJson(res, 400, { message: "name, age, and email are required." });
      }
      const users = await readUsers();
      const emailExists = users.some((u) => u.email === email);
      if (emailExists) {
        return sendJson(res, 409, { message: "Email already exists." });
      }
      const nextId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      users.push({ id: nextId, name, age, email });
      await writeUsers(users);
      return sendJson(res, 201, { message: "User added successfully." });
    }
    // 4) GET /user — Get all users
    if (pathname === "/user" && method === "GET") {
      const users = await readUsers();
      return sendJson(res, 200, users);
    }
    // Routes with :id -> /user/:id
    const idMatch = pathname.match(/^\/user\/(\d+)$/);
    if (idMatch) {
      const id = Number(idMatch[1]);
      // 5) GET /user/:id — Get user by ID
      if (method === "GET") {
        const users = await readUsers();
        const user = users.find((u) => u.id === id);
        if (!user) {
          return sendJson(res, 404, { message: "User not found." });
        }
        return sendJson(res, 200, user);
      }
      // 2) PATCH /user/:id — Update name, age, or email by ID
      if (method === "PATCH") {
        const { name, age, email } = await parseJsonBody(req);
        const users = await readUsers();
        const user = users.find((u) => u.id === id);
        if (!user) {
          return sendJson(res, 404, { message: "User ID not found." });
        }
        if (email !== undefined && users.some((u) => u.email === email && u.id !== id)) {
          return sendJson(res, 409, { message: "Email already exists." });
        }
        const updatedFields = [];
        if (name !== undefined) {
          user.name = name;
          updatedFields.push("name");
        }
        if (age !== undefined) {
          user.age = age;
          updatedFields.push("age");
        }
        if (email !== undefined) {
          user.email = email;
          updatedFields.push("email");
        }
        await writeUsers(users);
        const fieldLabel = updatedFields.length ? ` ${updatedFields.join(", ")}` : "";
        return sendJson(res, 200, {
          message: `User${fieldLabel} updated successfully.`,
        });
      }
      // 3) DELETE /user/:id — Delete user by ID
      if (method === "DELETE") {
        const users = await readUsers();
        const index = users.findIndex((u) => u.id === id);
        if (index === -1) {
          return sendJson(res, 404, { message: "User ID not found." });
        }
        users.splice(index, 1);
        await writeUsers(users);
        return sendJson(res, 200, { message: "User deleted successfully." });
      }
    }
    // Fallback for any unknown route
    return sendJson(res, 404, { message: "Route not found." });
  } catch (err) {
    if (err.message === "INVALID_JSON") {
      return sendJson(res, 400, { message: "Invalid JSON body." });
    }
    console.error("Server error:", err);
    return sendJson(res, 500, { message: "Internal server error." });
  }
});
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});