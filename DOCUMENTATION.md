## 📁 Folder Structure
``` bash
frontend/
│
├── node_modules/
│
├── public/
│   ├── _redirects         
│   ├── favicon.ico
│
│── Screenshots/     
│
├── src/
│   │
│   ├── api/
│   │   ├── axios.js        
│   │   └── food.js        
│   │
│   ├── assets/           
│   │
│   ├── components/
│   │   ├── ClaimedCard.jsx
│   │   ├── CookieConsent.jsx
│   │   ├── CountUp.jsx
│   │   ├── CreateFood.jsx
│   │   ├── DeleteModal.jsx
│   │   ├── EditFood.jsx
│   │   ├── Features.jsx
│   │   ├── FoodCard.jsx
│   │   ├── Footer.jsx
│   │   ├── HeroSection.jsx
│   │   ├── MapFoodModal.jsx
│   │   ├── Menu.jsx
│   │   ├── Navbar.jsx
│   │   ├── Spinner.jsx
│   │   └── Testimonials.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx 
│   │
│   ├── lib/
│   │   └── utils.js      
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── MapView.jsx
│   │   ├── NgoDashboard.jsx
│   │   ├── RestaurantDashboard.jsx
│   │   ├── SignUp.jsx
│   │   └── UpdateProfile.jsx
│   │
│   ├── route/
│   │   ├── AuthRoute.jsx       
│   │   └── ProtectedRoute.jsx  
│   │
│   ├── socket/
│   │   └── socket.js       
│   │
│   ├── App.jsx             
│   ├── index.css           
│   └── main.jsx            
│
├── .env                   
├── .gitignore
├── .nvmrc
├── components.json
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package.json
├── package-lock.json
├── postcss.config.js
├── README.md
├── render.yaml
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```

## 🔐 Environment Variables
#### Create a .env file in the root of frontend :
``` env
REACT_APP_API_URL = 
VITE_API_URL = https://resqfood-backend.fly.dev
VITE_SOCKET_URL = https://resqfood-backend.fly.dev
VITE_MAPBOX_TOKEN = 
```
#### 👉 For local backend testing :
``` env
REACT_APP_API_URL = 
VITE_API_URL = http://localhost:3000
VITE_SOCKET_URL = http://localhost:3000
VITE_MAPBOX_TOKEN = 
```

## ⚙️ Run Frontend Locally
``` bash
git clone https://github.com/Sreejib-Nandy/ResQFood_Frontend.git
```
``` bash
cd ResQFood_Frontend
```
``` bash
npm install
```
``` bash
npm run dev
```
#### Frontend will run at :
``` bash
http://localhost:5173
```


## 📜 License
This project is licensed under the **MIT License**.

## 👨‍💻 Author
### Sreejib Nandy
🔗 GitHub : https://github.com/Sreejib-Nandy

#### ⭐ If you like this project, don’t forget to star the repo!
