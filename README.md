# Emergency Alert System

A full-stack real-time emergency response platform where users can send emergency alerts and responders/admins can track, manage, and update request statuses.

---

## Features

### User Side

* Register and login (USER / DRIVER / ADMIN roles)
* Create emergency requests
* Add location manually or via coordinates
* Track request status (Pending → Accepted → Completed)
* View nearest emergency (simulation)

### Admin Dashboard

* View all emergency requests
* Filter by Priority (Normal / Critical) and Status
* Accept or complete requests
* Auto-refresh dashboard (real-time behavior)
* View user details and request history

### Emergency Tracking

* Location-based request handling
* Coordinates support (latitude and longitude)
* Map integration (basic link support)

---

## Technology Stack

### Frontend

* React.js
* CSS (Custom UI)
* Fetch API

### Backend

* Spring Boot
* REST APIs
* JPA / Hibernate

### Database

* MySQL

---

## Project Structure

```
backend/
   ├── Spring Boot Backend
   └── emergency-frontend (React App)
```

---

## How to Run

### Backend

```
cd backend
mvn spring-boot:run
```

Runs on:

```
http://localhost:8080
```

---

### Frontend

```
cd backend/emergency-frontend
npm install
npm start
```

Runs on:

```
http://localhost:3000
```

---

## API Endpoints

* POST `/api/emergency/create` → Create request
* GET `/api/emergency/all` → Get all requests
* PUT `/api/emergency/update/{id}` → Update status

---

## Screenshots

### Admin Dashboard
<img width="1586" height="722" alt="image" src="https://github.com/user-attachments/assets/2767a700-6582-4d12-a6d5-09312a45eb4b" />


### User Dashboard
<img width="1596" height="726" alt="image" src="https://github.com/user-attachments/assets/36049e50-82a7-4af9-b293-05c352baedf3" />


### Register Page
<img width="1743" height="965" alt="image" src="https://github.com/user-attachments/assets/6eff01db-aa4f-46f6-a4f7-e6e98088d247" />
<img width="1702" height="969" alt="image" src="https://github.com/user-attachments/assets/42950ba6-10a1-4b87-aa96-0830e750b5dd" />
<img width="738" height="691" alt="image" src="https://github.com/user-attachments/assets/4c253a8f-486a-462f-87a8-f3c78e6a12f4" />


---

## Future Improvements

* Real-time notifications using WebSockets
* Google Maps live tracking
* Mobile application
* JWT authentication and security
* Intelligent responder matching

---

## Conclusion

This project demonstrates a real-world emergency response workflow with role-based access, request tracking, and dashboard monitoring. It highlights full-stack development using modern web technologies.

---

## Author

Bindu Pasam
