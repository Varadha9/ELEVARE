# ELEVARE Frontend - Modern AI Platform UI

## 🎨 Design System

### Colors
- **Primary**: `#4F46E5` (Indigo)
- **Secondary**: `#0F172A` (Dark Navy)
- **Accent**: `#22C55E` (Green)
- **Background**: `#F8FAFC` (Light Gray)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

### Components
- Modern glassmorphism effects
- Smooth animations with Framer Motion
- Responsive design (mobile, tablet, desktop)
- Dark mode support (toggle in settings)

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Card.jsx
│   │   ├── Button.jsx
│   │   ├── Progress.jsx
│   │   └── Badge.jsx
│   ├── layout/          # Layout components
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── DashboardLayout.jsx
│   ├── charts/          # Chart components
│   │   ├── PersonalityRadarChart.jsx
│   │   ├── TraitsRadarChart.jsx
│   │   └── ProgressLineChart.jsx
│   └── FloatingChat.jsx # Floating AI assistant
├── pages/               # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Reflection.jsx
│   ├── Personality.jsx
│   ├── Careers.jsx
│   ├── Ikigai.jsx
│   ├── ProgressTracking.jsx
│   └── Settings.jsx
├── context/
│   └── AuthContext.jsx  # Authentication state
├── services/
│   └── api.js           # API client
├── lib/
│   └── utils.js         # Utility functions
└── App.jsx              # Main app component
```

## 🚀 Features

### Pages
1. **Dashboard** - Overview with stats, charts, and quick actions
2. **AI Reflection** - ChatGPT-style conversation interface
3. **Personality Profile** - Big Five traits with radar charts
4. **Career Insights** - AI-recommended careers with match scores
5. **Ikigai Analysis** - Visual Ikigai diagram with four circles
6. **Progress Tracking** - Behavioral trends and activity calendar
7. **Settings** - Theme toggle, notifications, privacy settings

### UI Components
- **Card** - Flexible card component with glassmorphism
- **Button** - Multiple variants (primary, secondary, outline, ghost)
- **Progress** - Animated progress bars
- **Badge** - Color-coded labels
- **Charts** - Radar and line charts using Recharts

### Animations
- Page transitions with Framer Motion
- Smooth hover effects
- Staggered list animations
- Loading states

## 🛠️ Technologies

- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **Recharts** - Chart library
- **Lucide React** - Icon library
- **React Router** - Routing

## 📦 Installation

```bash
cd frontend
npm install
```

## ▶️ Run Development Server

```bash
npm run dev
```

Access at: http://localhost:3000

## 🏗️ Build for Production

```bash
npm run build
```

## 🎯 Key Features

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on small screens
- Touch-friendly interactions

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus states

### Performance
- Code splitting
- Lazy loading
- Optimized images
- Minimal bundle size

## 🎨 Customization

### Colors
Edit `tailwind.config.js`:
```js
colors: {
  primary: '#4F46E5',
  secondary: '#0F172A',
  accent: '#22C55E',
}
```

### Fonts
Edit `src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
```

## 📱 Screenshots

### Dashboard
Modern overview with stats, charts, and career recommendations

### AI Reflection
ChatGPT-style interface with smooth animations

### Personality Profile
Big Five traits visualization with radar charts

### Career Insights
AI-powered career matches with confidence scores

### Ikigai Analysis
Visual four-circle Ikigai diagram

## 🔐 Authentication

Protected routes require authentication. Login/Register pages have modern gradient backgrounds.

## 🌙 Dark Mode

Toggle dark mode in Settings page (implementation ready).

## 📊 Charts

- **Radar Charts** - Personality and behavioral traits
- **Line Charts** - Progress tracking over time
- **Activity Calendar** - Reflection consistency heatmap

## 🎭 Animations

All animations use Framer Motion:
- Fade in/out
- Slide transitions
- Stagger children
- Hover effects

## 🚀 Deployment

Build and deploy to:
- Vercel
- Netlify
- AWS Amplify
- GitHub Pages

```bash
npm run build
# Deploy dist/ folder
```

---

**Built with modern design principles for a professional AI SaaS experience**
