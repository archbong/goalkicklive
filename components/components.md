## **🧩 Components & Purpose**

### **Layout Components**

* **Navbar.tsx** – Main navigation with mobile menu; includes language switcher
* **Footer.tsx** – Company information, legal links, and social media
* **MainLayout.tsx** – Wrapper component combining Navbar and Footer
* **Container.tsx** – Consistent spacing and max-width container

### **UI Components**

* **Button.tsx** – Reusable button components with multiple variants (primary, secondary, outline)
* **LocaleSwitcher.tsx** – Language selection component for international users

### **Monitoring Components**

* **HealthCheck.tsx** – System health monitoring and status display
* **AnalyticsTracker.tsx** – User interaction and analytics tracking

### **Component Structure**

```
components/
├── layout-components/
│   ├── Navbar.tsx          # Main navigation
│   ├── Footer.tsx          # Page footer
│   ├── MainLayout.tsx      # Layout wrapper
│   └── Container.tsx       # Content container
├── ui/
│   └── Button.tsx          # Button components
├── monitoring/
│   ├── HealthCheck.tsx     # System monitoring
│   └── AnalyticsTracker.tsx # Analytics tracking
└── LocaleSwitcher.tsx      # Language switcher
```

### **Component Usage**

**Layout Components:**
- Used in all page layouts to provide consistent navigation and structure
- Responsive design for mobile, tablet, and desktop devices
- Internationalization support built-in

**UI Components:**
- Button component supports multiple sizes and variants
- Consistent styling across the application

**Specialized Components:**
- Monitoring components for system health and analytics
- Language switcher for multi-language support

### **Design Principles**

1. **Simplicity** – Components are focused and do one thing well
2. **Reusability** – Components are designed to be reused across the application
3. **Accessibility** – All components follow accessibility best practices
4. **Responsive** – Components work on all device sizes
5. **Maintainable** – Clean, documented code that's easy to update

### **Future Components**

The current component set is minimal and focused on the business website needs. Future components could include:
- Contact form components
- Download tracking components
- Newsletter subscription components
- Testimonial display components