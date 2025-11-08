
## API Routes (rough)

/auth/register              -> register new user (hashed password)
/auth/login                 -> login, return JWT + refresh token
/auth/refresh               -> issue new access token
/auth/reset-password        -> reset password via token link

/users/                     -> [admin] list all users (paginated, filter by role)
/users/:id                  -> [admin] get/update/delete specific user
/users/me                   -> [user] get/update own profile

/rooms/                     -> list rooms (paginated, filter by availability, date range)
/rooms/:id                  -> get room details
/rooms/                     -> [admin] create room
/rooms/:id                  -> [admin] update/delete room

/reservations/              -> [admin] list all reservations (paginated, filter by user/date/room)
/reservations/me            -> [user] list own reservations
/reservations/              -> [user] create new reservation for a room
/reservations/:id           -> [user/admin] get reservation details
/reservations/:id/cancel    -> [user/admin] cancel reservation (validate ownership or admin)

