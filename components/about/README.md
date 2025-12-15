# About Page Components

A collection of reusable, customizable components for building rich about pages and other content sections throughout the application.

## Components Overview

### 1. HeroSection
Used for page headers with customizable backgrounds, sizes, and alignments.

**Props:**
- `title` (string): The main heading text
- `description` (string): The supporting text
- `background` ("light" | "gradient" | "pattern"): Background style
- `size` ("sm" | "md" | "lg"): Controls padding and typography size
- `alignment` ("left" | "center" | "right"): Text alignment
- `className`, `titleClassName`, `descriptionClassName`: Additional CSS classes

### 2. FeatureGrid
Displays features in a responsive grid layout with icons and descriptions.

**Props:**
- `title` (string): Section title
- `description` (string): Section description
- `features` (Array): List of feature objects with:
  - `title` (string): Feature title
  - `description` (string): Feature description
  - `icon` (ReactNode): Optional icon component
  - `iconText` (string): Alternative text icon
  - `iconColor` ("green" | "blue" | "orange" | "purple" | "red"): Icon color theme
- `columns` (1 | 2 | 3 | 4): Number of grid columns
- `variant` ("default" | "outline" | "gradient"): Card style
- `background` ("light" | "white" | "gradient"): Section background

### 3. FeatureCard
Individual feature card component (used internally by FeatureGrid).

### 4. TeamSection
Displays team members with photos/initials, roles, bios, and social links.

**Props:**
- `title` (string): Section title
- `description` (string): Section description
- `members` (Array): List of team member objects with:
  - `name` (string): Member name
  - `role` (string): Job title/role
  - `bio` (string): Short biography
  - `imageUrl` (string): Optional profile image URL
  - `initials` (string): Fallback initials for avatar
  - `socialLinks` (Array): Social media links
- `columns` (1 | 2 | 3 | 4): Grid columns
- `variant` ("default" | "compact" | "detailed"): Card style
- `showSocialLinks` (boolean): Toggle social links visibility

### 5. TeamMember
Individual team member component (used internally by TeamSection).

### 6. StatsSection
Showcases statistics/metrics with icons and animations.

**Props:**
- `title` (string): Section title
- `description` (string): Section description
- `stats` (Array): List of stat objects with:
  - `value` (string | number): The statistic value
  - `label` (string): Statistic label
  - `description` (string): Additional context
  - `icon` (ReactNode): Optional icon
  - `iconPosition` ("top" | "left" | "right"): Icon placement
- `columns` (2 | 3 | 4): Grid columns
- `animation` ("none" | "count" | "fade" | "slide"): Value animation
- `duration` (number): Animation duration in ms

### 7. TimelineSection
Displays chronological events with visual timeline.

**Props:**
- `title` (string): Section title
- `description` (string): Section description
- `items` (Array): List of timeline items with:
  - `year` (string): Year/date
  - `title` (string): Event title
  - `description` (string): Event description
  - `icon` (ReactNode): Optional icon
  - `iconText` (string): Alternative text icon
- `alignment` ("left" | "right" | "alternate"): Timeline alignment
- `maxWidth` ("sm" | "md" | "lg" | "full"): Content width limit

### 8. ValuesSection
Displays company values with icons and descriptions.

**Props:**
- `title` (string): Section title
- `description` (string): Section description
- `values` (Array): List of value objects with:
  - `title` (string): Value name
  - `description` (string): Value description
  - `icon` (ReactNode): Optional icon
  - `iconText` (string): Alternative text icon
  - `iconColor` ("green" | "blue" | "orange" | "purple" | "teal"): Icon color
- `columns` (2 | 3 | 4): Grid columns
- `showBorder` (boolean): Toggle card borders
- `borderColor` ("green" | "blue" | "gray"): Border color theme

### 9. CTASection
Call-to-action section with customizable buttons.

**Props:**
- `title` (string): CTA title
- `description` (string): CTA description
- `primaryButton`, `secondaryButton` (Object): Button configurations with:
  - `text` (string): Button label
  - `href` (string): Link URL
  - `variant` ("default" | "secondary" | "ghost"): Button style
  - `size` ("default" | "sm" | "lg"): Button size
  - `icon` (ReactNode): Optional icon
  - `iconPosition` ("left" | "right"): Icon placement
- `buttons` (Array): Alternative array of buttons
- `variant` ("default" | "gradient" | "outline" | "card"): Section style
- `alignment` ("left" | "center" | "right"): Content alignment

## Installation

All components are exported from the main index file:

```typescript
import {
  HeroSection,
  FeatureGrid,
  TeamSection,
  CTASection,
  StatsSection,
  TimelineSection,
  ValuesSection,
} from "@/components/about";
```

## Usage Examples

### Basic Hero Section
```typescript
<HeroSection
  title="About Our Company"
  description="Learn about our mission, vision, and team."
  background="gradient"
  size="lg"
  alignment="center"
/>
```

### Feature Grid
```typescript
<FeatureGrid
  title="What We Offer"
  description="Our key features and services"
  features={[
    {
      title: "Live Streaming",
      description: "Watch matches in real-time",
      icon: <Video className="w-6 h-6" />,
      iconColor: "green",
    },
    // ... more features
  ]}
  columns={3}
  variant="gradient"
  background="white"
/>
```

### Team Section
```typescript
<TeamSection
  title="Our Leadership"
  description="Meet the team behind our success"
  members={[
    {
      name: "John Doe",
      role: "CEO",
      bio: "Visionary leader with 10+ years experience",
      initials: "JD",
    },
    // ... more team members
  ]}
  columns={3}
  variant="default"
  showSocialLinks={true}
/>
```

### Statistics Section
```typescript
<StatsSection
  title="Our Impact"
  description="Key metrics that tell our story"
  stats={[
    {
      value: "500K+",
      label: "Users",
      description: "Active monthly users",
      icon: <Users className="w-6 h-6" />,
    },
    // ... more stats
  ]}
  columns={4}
  variant="gradient"
  animation="fade"
/>
```

## Design System Integration

### Colors
Components use the existing color system:
- Primary: Green (`green-500` to `green-700`)
- Secondary: Blue (`blue-500` to `blue-700`)
- Backgrounds: Gray scales (`gray-50` to `gray-900`)
- Status colors: Orange, Purple, Teal, Red for icons

### Typography
- Headings: `font-bold` or `font-extrabold`
- Body text: `font-normal` with appropriate line heights
- Responsive text sizes using Tailwind's breakpoint system

### Spacing
- Consistent padding: `p-4` (sm), `p-6` (md), `p-8` (lg)
- Grid gaps: `gap-6` (mobile), `gap-8` (desktop)
- Section spacing: `py-12` (standard), `py-16` (hero)

### Responsive Design
All components are fully responsive:
- Mobile: Single column layouts
- Tablet: 2-column grids
- Desktop: 3-4 column grids as specified
- Breakpoints: `sm:`, `md:`, `lg:` prefixes

## Accessibility Features

- Semantic HTML elements (`section`, `h1`-`h3`, `p`)
- ARIA labels for interactive elements
- Proper heading hierarchy
- Sufficient color contrast
- Focus indicators for keyboard navigation
- Screen reader friendly icon descriptions

## Performance Considerations

- Lazy loading for images
- Optimized re-renders with React.memo where appropriate
- Efficient CSS with Tailwind's utility classes
- Minimal JavaScript bundle size
- Proper image sizing and formats

## Testing

Components should be tested for:
- Responsive behavior across screen sizes
- Accessibility compliance
- Internationalization support
- Interactive states (hover, focus, active)
- Prop validation and error handling

## Demo

Visit `/components-demo` to see all components in action with different configurations.

## Contributing

When adding new components or modifying existing ones:
1. Follow the established prop naming conventions
2. Maintain TypeScript type safety
3. Include comprehensive documentation
4. Add to the demo page for visual testing
5. Ensure backward compatibility when possible