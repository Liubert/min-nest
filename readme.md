# API Test URLs

## Health check
GET http://localhost:8080/health

---

## Create user (no auth)
POST http://localhost:8080/users/999?name=Liybomyr&id=12&age=12

---

## Get current user (auth required)
GET http://localhost:8080/users/me
Authorization: Bearer <token>

---

## Get user by id (auth required)
GET http://localhost:8080/users/123?name=Liybomyr&id=12&age=12
Authorization: Bearer <token>

---

## Create user with status (auth required)
POST http://localhost:8080/users/status/pending?name=Liybomyr&id=12&age=12
Authorization: Bearer <token>
