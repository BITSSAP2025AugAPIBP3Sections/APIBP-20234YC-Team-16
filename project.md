# Badminton Court Booking Application Documentation

## 📌 About the Project
The **Badminton Court Booking Application** is a lightweight full‑stack project built using:
- **Frontend:** React  
- **Backend:** Node.js + Express  
- **Storage:** JSON files (instead of DB)  
- **Auth:** JWT-based authentication  

It enables users to register, log in, select a court, view available slots for a chosen date, add players, and calculate total and per‑player cost. Bookings are stored in a JSON file, making the project simple and easily portable.

---

## ✅ Features Covered (Completed Scope)

### 1. **User Authentication**
- Register with name, email, password  
- Login with email/password  
- Password hashing using bcrypt  
- Login returns JWT token  
- Protected APIs require `Authorization: Bearer <token>`

### 2. **Court Management**
- Courts loaded from `courts.json`  
- Each court has:
  - ID  
  - Name  
  - Hourly cost  

### 3. **Slot Availability**
- Static daily slots:
  - 06:00–07:00  
  - 07:00–08:00  
  - ...  
  - 20:00–21:00  
- Slots unavailable if already booked  
- Availability calculated dynamically from `bookings.json`

### 4. **Booking System**
- Select court  
- Select date  
- Select free slot  
- Add multiple players  
- Auto-calculates:
  - Total cost  
  - Per‑player cost (total ÷ number of players)  
- Stores booking in `bookings.json` with:
  - userId  
  - court details  
  - date & slot  
  - players  
  - cost summary  

### 5. **My Bookings Page**
- Users can view only their bookings  
- Sorted by creation time  

---

## ⚠️ Error Cases & How They Are Handled

### ❌ 1. Registration Errors
| Case | Handling |
|------|----------|
| Email already exists | Returns `400` + message |
| Missing fields | Returns `400` |
| JSON parse error in file | Auto-corrects file → rewrites default structure |
| Password undefined | Returns validation error before bcrypt |

### ❌ 2. Login Errors
| Case | Handling |
|------|----------|
| Email not found | `400 Invalid credentials` |
| Wrong password | `400 Invalid credentials` |
| Empty password | Field validation triggers error |

### ❌ 3. Authentication Errors
| Case | Handling |
|------|----------|
| No JWT token | `401 No token provided` |
| Invalid token | `401 Invalid token` |

### ❌ 4. Court & Slot Errors
| Case | Handling |
|------|----------|
| Invalid courtId | `400 Invalid court` |
| Missing date query | `400` |
| Slots not available | Returns empty slot list |

### ❌ 5. Booking Errors
| Case | Handling |
|------|----------|
| Slot already booked | `400 Slot already booked` |
| Missing fields | `400 Missing required fields` |
| Zero players | `400` |

### ❌ 6. JSON File Errors
Handled by custom safe JSON loader:
- If file is **empty** → auto-create default JSON  
- If file is **corrupted** → logs error + rebuilds fallback JSON  
- If file is **missing** → creates new file automatically  

---

## 🚀 Business Scope (Real-world Applications)

### **1. Sports Facility Management**
This can be expanded to support:
- Badminton  
- Tennis  
- Squash  
- Football turf  
- Indoor courts  

### **2. Payment Integration**
Add:
- Razorpay  
- Stripe  
- UPI Integration  
- Wallet system (Add money & deduct per booking)

### **3. Multi-Branch Support**
Extend courts.json:
```
{
  "branch": "Whitefield",
  "courts": [...]
}
```
Allow bookings per location.

### **4. Live Availability**
Implement real-time updates using:
- WebSockets  
- Firebase realtime DB  

### **5. Admin Console**
Admin features:
- Add/edit courts  
- Change pricing  
- Cancel bookings  
- View all user bookings  

### **6. User Analytics & Engagement**
- Weekly usage summary  
- Coupons  
- Loyalty points  

---

## 🔮 Future Scope (Technical Enhancements)

### **Frontend Enhancements**
- Convert pages to a polished UI (Tailwind/Material UI)
- Add calendar view for bookings
- Add QR code-based check‑in

### **Backend Enhancements**
- Replace JSON with a real DB (MongoDB or PostgreSQL)
- Add booking cancellation/refund logic
- Add recurring bookings & memberships

### **DevOps Enhancements**
- Dockerize backend & frontend  
- CI/CD pipelines  
- Deploy to AWS/Render/Vercel  

---

## 📂 Project Structure (Summary)
```
backend/
  data/
    users.json
    bookings.json
    courts.json
  routes/
    authRoutes.js
    courtRoutes.js
    bookingRoutes.js
  utils/
    fileHandler.js
  middleware/
    authMiddleware.js
  server.js

frontend/
  src/
    pages/
      LoginPage.jsx
      BookingPage.jsx
      MyBookingsPage.jsx
    components/
      Navbar.jsx
    api.js
    App.js
```

---

## 📝 Conclusion
This project provides a fully functioning **Court Booking System** with:
- Authentication  
- Booking flow  
- Cost calculation  
- JSON file storage  
- Slot-management rules  

It is structured cleanly enough to scale into a production-level app with only incremental upgrades.

---

Created by: **Yuvaraj(70003), Shivam(70010), Ganga(70019), Megha(70014)** 🚀  
Tech Stack: **Node.js, Express, JSON Storage, React**
