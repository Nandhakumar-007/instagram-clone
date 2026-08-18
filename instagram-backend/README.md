# Instagram Clone — Spring Boot Backend

This backend is scaffolded to match your React (Vite) frontend: auth, posts, comments,
likes, follow/unfollow, user search, and file uploads. Messages, notifications,
stories, and reels are stubbed out as a roadmap at the bottom — build those next
using the same pattern.

## 1. Prerequisites

Install these on your machine (not in this sandbox):

- **JDK 17+** — `java -version` to check
- **Maven 3.9+** — `mvn -version` to check (or use the included `mvnw` if you add one via `mvn wrapper:wrapper`)
- **MySQL 8+** running locally, with a user/password you know
- **IntelliJ IDEA** (Community is fine) or VS Code with the Java extension pack

## 2. Create the database

```sql
CREATE DATABASE instagram_db;
```

(The app is also configured with `createDatabaseIfNotExist=true`, so this step is optional but recommended.)

## 3. Configure `application.properties`

Open `src/main/resources/application.properties` and set:

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_ACTUAL_MYSQL_PASSWORD
app.jwt.secret=REPLACE_WITH_A_LONG_RANDOM_STRING
```

Generate a JWT secret quickly with:
```bash
openssl rand -base64 48
```

## 4. Open and run the project

**IntelliJ:** File → Open → select the `instagram-backend` folder → let Maven download
dependencies → run `InstagramBackendApplication.java`.

**Command line:**
```bash
cd instagram-backend
mvn spring-boot:run
```

On first run, Hibernate (`spring.jpa.hibernate.ddl-auto=update`) will auto-create all
tables (`users`, `posts`, `comments`, `post_likes`, `follows`) in `instagram_db`.

The API will be live at `http://localhost:8080`.

## 5. Test it works

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alex","email":"alex@example.com","password":"password123","fullName":"Alex Doe"}'

# Response includes a JWT token — save it
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"alex","password":"password123"}'

# Use the token for protected routes
curl http://localhost:8080/api/posts/feed \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Or import into Postman/Insomnia — every route except `/api/auth/**` requires the
`Authorization: Bearer <token>` header.

## 6. API reference (what's built)

| Method | Endpoint | Auth? | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create account, returns JWT |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/posts/feed` | Yes | All posts, newest first |
| POST | `/api/posts` | Yes | Create a post `{imageUrl, caption}` |
| POST | `/api/posts/{id}/like` | Yes | Toggle like on a post |
| GET | `/api/posts/{postId}/comments` | Yes | List comments on a post |
| POST | `/api/posts/{postId}/comments` | Yes | Add a comment `{text}` |
| GET | `/api/users/{username}` | Yes | Profile + counts + follow status |
| POST | `/api/users/{username}/follow` | Yes | Toggle follow/unfollow |
| GET | `/api/users/search?query=` | Yes | Search users by username |
| POST | `/api/files/upload` | Yes | Multipart upload, returns `{url}` |

## 7. Connect the React frontend

Your `src/Services/*.jsx` files are currently empty — that's where the fetch/axios
calls go. Example for `authService.jsx`:

```javascript
const BASE_URL = "http://localhost:8080/api";

export async function login(usernameOrEmail, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usernameOrEmail, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json(); // { token, userId, username }
}
```

Store the returned `token` (e.g. in your `AuthContext`, backed by `localStorage`),
and attach it to every subsequent request:

```javascript
headers: { Authorization: `Bearer ${token}` }
```

CORS is already configured in `SecurityConfig.java` for `http://localhost:5173`
(Vite's default dev port) — if your frontend runs on a different port, update the
`setAllowedOrigins(...)` list there.

## 8. Roadmap — features not yet built

Follow the same layered pattern (`entity` → `repository` → `service` → `controller`)
for each:

- **Notifications** — a `Notification` entity (recipient, actor, type: LIKE/COMMENT/FOLLOW,
  targetPostId, read boolean, createdAt). Fire-and-forget: create one inside
  `PostService.toggleLike`, `CommentController.addComment`, and `UserService.toggleFollow`.
- **Direct messages** — `Conversation` and `Message` entities. For real-time delivery,
  add `spring-boot-starter-websocket` and expose a `/ws` STOMP endpoint; the REST
  endpoints can handle history/pagination while WebSocket pushes new messages live.
- **Stories** — a `Story` entity (userId, mediaUrl, createdAt, expiresAt = createdAt + 24h).
  A scheduled job (`@Scheduled`) or a simple `WHERE expiresAt > now()` filter in the
  repository query keeps only active stories visible.
- **Reels** — essentially `Post` with a `type` discriminator (`IMAGE` vs `VIDEO`), or
  a separate `Reel` entity if you want different fields (e.g. duration, music).

## 9. Common gotchas

- **`mvn: command not found`** → install Maven, or generate a wrapper once you have
  Maven available: `mvn -N wrapper:wrapper`, then commit `mvnw`/`mvnw.cmd`.
- **`Communications link failure`** → MySQL isn't running, or the port/credentials
  in `application.properties` are wrong.
- **401 on every request** → you forgot the `Authorization: Bearer <token>` header,
  or the token expired (default: 24h, see `app.jwt.expiration-ms`).
- **CORS error in browser console** → the frontend's origin doesn't match
  `setAllowedOrigins(...)` in `SecurityConfig.java`.
