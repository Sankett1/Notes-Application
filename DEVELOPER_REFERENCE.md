# 🔧 Developer's Quick Reference

## 📂 New Architecture

```
App.jsx (Main)
├─ Navbar.jsx (Always visible)
└─ Router Logic
   ├─ If NOT logged in → Hero.jsx
   │  ├─ UserLogin.jsx (Modal-like via state)
   │  ├─ UserSignup.jsx (Modal-like via state)
   │  ├─ AdminLogin.jsx (Modal-like via state)
   │  └─ AdminSignup.jsx (Modal-like via state)
   │
   ├─ If logged in as USER → UserDashboard.jsx
   └─ If logged in as ADMIN → AdminDashboard.jsx
```

**Key Insight:** No React Router! Uses simple conditional rendering with `useAuth()` hook.

---

## 🎯 Core Methods (useAuth Hook)

```javascript
import { useAuth } from './AuthContext';

const MyComponent = () => {
  const { user, login, logout, isLoggedIn, isAdmin, isUser } = useAuth();

  // user object structure:
  // {
  //   username: string,
  //   role: 'user' | 'admin',
  //   loginTime: string,
  //   id: string
  // }

  return (
    <>
      {isLoggedIn() && <p>Hi {user.username}!</p>}
      {isAdmin() && <p>Admin features available</p>}
      {isUser() && <p>Standard user features</p>}
    </>
  );
};
```

---

## 📋 Component APIs

### **Navbar.jsx**
No props needed. Use `useAuth()` hook internally.

```javascript
<Navbar />
// Shows login/logout buttons based on auth state
```

### **Hero.jsx**
No props needed. Manages its own `activeTab` state.

```javascript
const [activeTab, setActiveTab] = useState(null);
// null = hero view
// 'user-login' = UserLogin component
// 'admin-login' = AdminLogin component
// 'user-signup' = UserSignup component
// 'admin-signup' = AdminSignup component
```

### **UserLogin.jsx**
```javascript
<UserLogin onBack={() => setActiveTab(null)} />
// onBack: callback to return to hero
// onClick: Gets username/password and calls auth.login()
```

### **UserSignup.jsx**
```javascript
<UserSignup onBack={() => setActiveTab(null)} />
// onBack: callback to return to hero
// Validates: username, email, password 6+, password match
// Auto-logs in on success
```

### **AdminLogin.jsx**
```javascript
<AdminLogin onBack={() => setActiveTab(null)} />
// onBack: callback to return to hero
// Validates against hardcoded demo credentials
// Calls auth.login() with role='admin'
```

### **AdminSignup.jsx**
```javascript
<AdminSignup onBack={() => setActiveTab(null)} />
// onBack: callback to return to hero
// Validates: adminId 4+, email, password 8+, department, password match
// Auto-logs in on success
```

---

## 🔐 Authentication Flow

### Login Process
```javascript
const handleLogin = (username, role) => {
  const newUser = {
    username: username,
    role: role,  // 'user' or 'admin'
    loginTime: new Date().toLocaleString(),
    id: Math.random().toString(36).substr(2, 9)
  };
  
  setUser(newUser);
  
  // Automatically logs CRUD operations
  logger.log('LOGIN', `${username} (${role}) logged in`);
};
```

### State Update in App.jsx
```javascript
const { isLoggedIn, isAdmin, user } = useAuth();

return (
  <>
    <Navbar />
    {!isLoggedIn() && <Hero />}
    {isLoggedIn() && isAdmin() && <AdminDashboard />}
    {isLoggedIn() && !isAdmin() && <UserDashboard />}
  </>
);
```

---

## 🎨 Tailwind Color Reference

### From `tailwind.config.js`:

**Primary (User Interface)**
- `bg-primary-50` → Light blue background
- `bg-primary-500` → Main blue (`#0ea5e9`)
- `bg-primary-600` → Hover blue (`#0284c7`)
- `bg-primary-700` → Active blue (`#0369a1`)

**Admin (Admin Interface)**
- `bg-admin-600` → Main red (`#dc2626`)
- `bg-admin-700` → Hover red (`#b91c1c`)
- Text classes: `text-admin-600`, `text-admin-700`

**Usage:**
```jsx
{/* User Button */}
<button className="bg-primary-500 hover:bg-primary-600">
  User Login
</button>

{/* Admin Button */}
<button className="bg-admin-600 hover:bg-admin-700">
  Admin Login
</button>
```

---

## 🔄 Adding New Components

### Step 1: Create Component File
```javascript
// src/MyNewComponent.jsx
import { useAuth } from './AuthContext';

export default function MyNewComponent() {
  const { user, isAdmin } = useAuth();
  
  return (
    <div className="p-4">
      Hello {user.username}!
    </div>
  );
}
```

### Step 2: Import and Use in App.jsx
```javascript
import MyNewComponent from './MyNewComponent';

// Add to routing logic
{isLoggedIn() && isAdmin() && <MyNewComponent />}
```

---

## 📝 Form Validation Pattern

All auth forms follow this pattern:

```javascript
import { useState } from 'react';
import { useAuth } from './AuthContext';

export default function MyAuthForm({ onBack }) {
  const auth = useAuth();
  const [formData, setFormData] = useState({
    field1: '',
    field2: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate
    const newErrors = {};
    if (!formData.field1) newErrors.field1 = 'Required';
    if (formData.field2.length < 6) newErrors.field2 = 'Min 6 chars';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Login/Signup
    auth.login(formData.field1, 'role');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="field1"
        value={formData.field1}
        onChange={handleChange}
      />
      {errors.field1 && <p className="text-red-500">{errors.field1}</p>}
      
      <button type="submit">Submit</button>
      <button type="button" onClick={onBack}>Back</button>
    </form>
  );
}
```

---

## 🚀 Common Tasks

### Task: Add new demo admin credential
**File:** `src/AdminLogin.jsx`

```javascript
const validAdmins = {
  'admin': 'admin123',
  'admin001': 'admin@123',
  'superadmin': 'super@2024',
  'newadmin': 'newpassword'  // ← Add here
};
```

### Task: Change password requirements for users
**File:** `src/UserSignup.jsx`

```javascript
// Find this:
if (formData.password.length < 6) {
  newErrors.password = 'Password must be at least 6 characters';
}

// Change to:
if (formData.password.length < 8) {  // ← Changed from 6 to 8
  newErrors.password = 'Password must be at least 8 characters';
}
```

### Task: Add new department for admin registration
**File:** `src/AdminSignup.jsx`

```javascript
// Find this:
<select name="department" value={formData.department} onChange={handleChange}>
  <option value="">Select Department</option>
  <option value="IT & System Admin">IT & System Admin</option>
  <option value="Operations">Operations</option>
  <option value="Support">Support</option>
  <option value="Management">Management</option>
  <option value="Security">Security</option>
  <option value="New Department">New Department</option>  {/* ← Add here */}
</select>
```

### Task: Change Hero page heading
**File:** `src/Hero.jsx`

```javascript
// Find this:
<h1 className="text-5xl font-bold mb-4">Welcome to NotesApp</h1>

// Change to:
<h1 className="text-5xl font-bold mb-4">Your New Heading</h1>
```

### Task: Modify Navbar link
**File:** `src/Navbar.jsx`

```javascript
// Find this (in menu):
<a href="#features" className="text-gray-600 hover:text-gray-900">
  Features
</a>

// Change to:
<a href="#mynewlink" className="text-gray-600 hover:text-gray-900">
  My New Link
</a>
```

---

## 🐛 Debugging Tips

### Check Auth State
```javascript
// In any component
const { user, isLoggedIn, isAdmin } = useAuth();
console.log('User:', user);
console.log('Logged in:', isLoggedIn());
console.log('Is admin:', isAdmin());
```

### Check Form Data
```javascript
const [formData, setFormData] = useState({...});
console.log('Form data:', formData);
```

### Check Tailwind Classes
- Open DevTools (F12)
- Inspect element
- Look for generated class names in HTML
- Verify `style` attribute has correct CSS

### Check Logger
```javascript
// In browser console
import { logger } from './logger.js';
console.log(logger.getLogs());
```

---

## 📊 File Dependencies

```
App.jsx
├─ Navbar.jsx
│  └─ AuthContext (useAuth)
│
├─ Hero.jsx
│  ├─ UserLogin.jsx
│  ├─ UserSignup.jsx
│  ├─ AdminLogin.jsx
│  ├─ AdminSignup.jsx
│  └─ AuthContext (useAuth)
│
├─ UserDashboard.jsx
│  ├─ AuthContext (useAuth)
│  ├─ api.js
│  └─ logger.js
│
└─ AdminDashboard.jsx
   ├─ AuthContext (useAuth)
   ├─ AdminLogs.jsx
   ├─ api.js
   └─ logger.js

AuthContext.jsx
└─ All auth-related components

logger.js
└─ AdminDashboard, AdminLogs

api.js
└─ UserDashboard, AdminDashboard (for backend)
```

---

## 🎯 Decision Points

### Should I use useAuth()?
✅ **YES** if you need: user data, login/logout, role checking, auth state

### Should I add new auth form?
✅ **YES** - Follow UserSignup.jsx pattern, add to Hero.jsx, import component

### Should I change routing?
✅ **Consider** - Current conditional rendering is simpler than React Router
❌ **NO** - Don't add React Router unless absolutely necessary for scale

### Should I add backend?
✅ **YES** - Modify api.js, update login() call in AuthContext
- Example: `const res = await api.post('/login', {...})`

### Should I persist auth state?
✅ **YES** - Add localStorage in AuthContext:
```javascript
useEffect(() => {
  localStorage.setItem('user', JSON.stringify(user));
}, [user]);

// On mount:
const savedUser = localStorage.getItem('user');
if (savedUser) setUser(JSON.parse(savedUser));
```

---

## 🎓 Best Practices

1. **Always use useAuth()** instead of prop drilling
2. **Keep forms stateless** until they need to validate
3. **Use Tailwind classes** instead of inline styles
4. **Always add onBack callback** to auth forms
5. **Validate on client** before sending data
6. **Log important actions** using logger.log()
7. **Use consistent color themes** (blue for user, red for admin)
8. **Test on mobile** before committing
9. **Check console errors** (F12) regularly
10. **Update both signup AND login** if changing validation

---

## 📚 File Sizes Reference

| File | Size | Lines |
|------|------|-------|
| Navbar.jsx | ~2 KB | 85 |
| Hero.jsx | ~8 KB | 280 |
| UserLogin.jsx | ~2 KB | 75 |
| UserSignup.jsx | ~4 KB | 130 |
| AdminLogin.jsx | ~3 KB | 110 |
| AdminSignup.jsx | ~5 KB | 180 |
| Total New Components | ~24 KB | 860 |

---

## ✅ Pre-Launch Checklist

- [ ] All components created
- [ ] Navbar shows on all pages
- [ ] Hero page loads first
- [ ] User and admin flows separate
- [ ] Forms validate correctly
- [ ] Logout returns to Hero
- [ ] Mobile responsive
- [ ] Colors consistent
- [ ] No console errors
- [ ] npm run dev works

---

**Happy coding!** 🎉

For detailed usage, see `LANDING_PAGE_SETUP.md`  
For testing procedures, see `TESTING_GUIDE.md`
