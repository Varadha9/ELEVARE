# Frontend Developer Quick Reference

## 🚀 Quick Start

```bash
# From project root — starts all services
./start.sh
```

Or manually:

```bash
cd frontend
npm install
npm run dev
```

Access at: http://localhost:3000 (may use 3001/3002 if port is busy)

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── layout/          # Layout components
│   │   └── charts/          # Chart components
│   ├── pages/               # Page components
│   ├── context/             # React Context
│   ├── services/            # API services
│   ├── lib/                 # Utilities
│   └── App.jsx              # Main app component
```

---

## 🎨 Using UI Components

### Button
```jsx
import { Button } from '../components/ui/Button';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

// Variants: primary, secondary, outline, ghost, success
// Sizes: sm, md, lg
```

### Card
```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Toast Notifications
```jsx
import { useToast } from '../components/ui/Toast';

const toast = useToast();

toast.success('Operation successful!');
toast.error('Something went wrong');
toast.warning('Please be careful');
toast.info('Here is some info');
```

### Loading
```jsx
import { Loading } from '../components/ui/Loading';

// Full screen
<Loading fullScreen message="Loading..." />

// Inline
<Loading message="Loading data..." />
```

### Badge
```jsx
import { Badge } from '../components/ui/Badge';

<Badge variant="success">Active</Badge>

// Variants: default, success, warning, error, secondary
```

### Progress
```jsx
import { Progress } from '../components/ui/Progress';

<Progress value={75} showLabel />
```

---

## 🔌 API Calls

### Basic Usage
```jsx
import api from '../services/api';

// GET request
const response = await api.get('/profile');
const data = response.data;

// POST request
const response = await api.post('/conversations/message', {
  message: 'Hello'
});

// PUT request
await api.put('/profile', { name: 'John' });

// DELETE request
await api.delete('/auth/account');
```

### With Error Handling
```jsx
try {
  const response = await api.get('/profile');
  setData(response.data);
} catch (error) {
  console.error('Error:', error);
  toast.error(error.response?.data?.message || 'Failed to load data');
}
```

---

## 🎭 Authentication

### Using Auth Context
```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, login, logout, loading } = useAuth();
  
  if (loading) return <Loading />;
  
  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes
```jsx
// Already implemented in App.jsx
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}
```

---

## 🎨 Styling

### Tailwind Classes
```jsx
// Common patterns
<div className="flex items-center justify-between">
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="p-4 bg-white rounded-xl shadow-lg">
<button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600">
```

### Dark Mode
```jsx
// Dark mode classes automatically applied
<div className="bg-white dark:bg-gray-800">
<p className="text-gray-900 dark:text-white">
```

### Responsive Design
```jsx
// Mobile first approach
<div className="text-sm md:text-base lg:text-lg">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

---

## 🎬 Animations

### Framer Motion
```jsx
import { motion } from 'framer-motion';

// Fade in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// Slide up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  Content
</motion.div>

// Stagger children
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.div variants={container} initial="hidden" animate="show">
  <motion.div variants={item}>Item 1</motion.div>
  <motion.div variants={item}>Item 2</motion.div>
</motion.div>
```

---

## 🧭 Navigation

### Using React Router
```jsx
import { useNavigate, Link } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  return (
    <>
      {/* Programmatic navigation */}
      <button onClick={() => navigate('/dashboard')}>
        Go to Dashboard
      </button>
      
      {/* Link component */}
      <Link to="/settings">Settings</Link>
    </>
  );
}
```

---

## 📝 Forms

### Form Handling
```jsx
const [formData, setFormData] = useState({
  name: '',
  email: ''
});

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validation
  if (!formData.name.trim()) {
    toast.error('Name is required');
    return;
  }
  
  // Submit
  try {
    await api.post('/endpoint', formData);
    toast.success('Saved successfully!');
  } catch (error) {
    toast.error('Failed to save');
  }
};

return (
  <form onSubmit={handleSubmit}>
    <input
      type="text"
      value={formData.name}
      onChange={(e) => setFormData({...formData, name: e.target.value})}
      className="w-full px-4 py-2 border rounded-lg"
    />
    <Button type="submit">Submit</Button>
  </form>
);
```

---

## 🎯 Common Patterns

### Loading State
```jsx
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);

useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await api.get('/data');
    setData(response.data);
  } catch (error) {
    toast.error('Failed to load');
  } finally {
    setLoading(false);
  }
};

if (loading) return <Loading />;
if (!data) return <div>No data</div>;

return <div>{/* Render data */}</div>;
```

### Error Boundary
```jsx
// Wrap your app or components
import { ErrorBoundary } from './components/ui/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

---

## 🎨 Color Reference

```jsx
// Primary
bg-primary          // #4F46E5
bg-primary-50       // #EEF2FF
bg-primary-600      // #4338CA

// Success
bg-green-500        // #22C55E
bg-green-50         // Light green

// Error
bg-red-500          // #EF4444
bg-red-50           // Light red

// Warning
bg-yellow-500       // #EAB308
bg-yellow-50        // Light yellow

// Info
bg-blue-500         // #3B82F6
bg-blue-50          // Light blue
```

---

## 🔍 Debugging

### React DevTools
- Install React DevTools extension
- Inspect component props and state
- Profile performance

### Console Logging
```jsx
console.log('Data:', data);
console.error('Error:', error);
console.table(arrayData);
```

### Network Tab
- Check API requests
- Verify request/response data
- Check status codes

---

## ⚡ Performance Tips

1. **Use React.memo for expensive components**
```jsx
const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});
```

2. **Debounce user input**
```jsx
import { useState, useEffect } from 'react';

const [searchTerm, setSearchTerm] = useState('');
const [debouncedTerm, setDebouncedTerm] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedTerm(searchTerm);
  }, 500);
  
  return () => clearTimeout(timer);
}, [searchTerm]);
```

3. **Lazy load routes**
```jsx
const Dashboard = lazy(() => import('./pages/Dashboard'));

<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

---

## 🐛 Common Issues

### Issue: Component not re-rendering
**Solution**: Check if state is being updated correctly

### Issue: API calls failing
**Solution**: Check backend is running, verify API URL

### Issue: Styles not applying
**Solution**: Check Tailwind config, rebuild if needed

### Issue: Dark mode not working
**Solution**: Check localStorage, verify dark class on html element

---

## 📚 Resources

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [React Router](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)

---

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

---

**Happy Coding! 🚀**
