# Contact Components

A collection of reusable, customizable components for building rich contact pages and forms throughout the application.

## Components Overview

### 1. ContactForm
A fully-featured contact form with validation, loading states, and success feedback.

**Props:**
- `nameLabel`, `emailLabel`, `messageLabel` (string): Input field labels/placeholders
- `submitLabel` (string): Submit button text
- `successMessage` (string): Success toast message
- `variant` ("default" | "outline" | "gradient" | "card"): Form styling
- `size` ("sm" | "md" | "lg"): Controls padding and typography size
- `onSubmit` (function): Callback when form is submitted
- `showLabels` (boolean): Show labels instead of placeholders
- `showSuccessToast` (boolean): Toggle success notification
- `autoFocus` (boolean): Auto-focus first input

**Features:**
- Real-time form validation
- Loading states with spinner
- Success/error feedback
- Character counter for messages
- Accessible form controls

### 2. ContactInfo
Displays contact information in various layouts with icons and descriptions.

**Props:**
- `items` (Array): List of contact info items with:
  - `icon` (ReactNode): Icon component
  - `title` (string): Item title
  - `content` (string | ReactNode): Main content (can be link)
  - `description` (string): Additional info
  - `href` (string): Optional link URL
  - `color` ("green" | "blue" | "orange" | "purple" | "teal"): Icon color theme
- `variant` ("default" | "grid" | "list" | "card"): Layout style
- `columns` (1 | 2 | 3 | 4): Grid columns for grid/card variants
- `background` ("light" | "white" | "gradient"): Section background
- `interactive` (boolean): Add hover effects and transitions

**Pre-configured Presets:**
- `contactInfoPresets.basic()`: Basic contact info (email, phone, location)
- `contactInfoPresets.detailed()`: Detailed contact channels
- `contactInfoPresets.social()`: Social media links

### 3. MapSection
Interactive Google Maps integration with controls and location info.

**Props:**
- `location` (Object): Map coordinates and address
- `variant` ("default" | "minimal" | "interactive" | "card"): Map styling
- `showControls` (boolean): Toggle map controls
- `showAddress` (boolean): Show address overlay
- `interactive` (boolean): Enable map interactions
- `zoom` (number): Map zoom level
- `height` (string): Map height (e.g., "400px")
- `fadeIn` (boolean): Animate map on scroll
- `fullscreen` (boolean): Enable fullscreen mode

**Pre-configured Locations:**
- `mapLocations.sanFrancisco`: Headquarters
- `mapLocations.london`: Europe office
- `mapLocations.dubai`: Middle East office
- `mapLocations.singapore`: Asia office
- `mapLocations.newYork`: East Coast office

### 4. FAQSection
Interactive FAQ section with search, filtering, and accordion functionality.

**Props:**
- `faqs` (Array): List of FAQ items with:
  - `question` (string): FAQ question
  - `answer` (string | ReactNode): Detailed answer
  - `category` (string): Optional category for filtering
  - `tags` (string[]): Optional tags
- `variant` ("default" | "accordion" | "grid" | "minimal"): Layout style
- `showSearch` (boolean): Enable search functionality
- `showCategories` (boolean): Show category filters
- `collapsible` (boolean): Enable accordion functionality
- `defaultOpen` (number | null): Default open FAQ index

**Pre-configured FAQ Sets:**
- `faqPresets.general()`: General questions about the service
- `faqPresets.technical()`: Technical support questions
- `faqPresets.account()`: Account-related questions

## Installation

All components are exported from the main index file:

```typescript
import {
  ContactForm,
  ContactInfo,
  contactInfoPresets,
  MapSection,
  mapLocations,
  FAQSection,
  faqPresets,
} from "@/components/contact";
```

## Usage Examples

### Basic Contact Form
```typescript
<ContactForm
  nameLabel="Your Name"
  emailLabel="Your Email"
  messageLabel="Your Message"
  submitLabel="Send Message"
  successMessage="Message sent successfully!"
  variant="card"
  size="md"
  onSubmit={handleFormSubmit}
/>
```

### Contact Information Grid
```typescript
<ContactInfo
  title="Contact Us"
  description="Get in touch through any channel"
  items={contactInfoPresets.detailed(locale)}
  columns={3}
  variant="card"
  background="light"
  alignment="center"
/>
```

### Interactive Map
```typescript
<MapSection
  title="Our Location"
  description="Visit our headquarters"
  location={mapLocations.sanFrancisco}
  variant="interactive"
  height="500px"
  showControls={true}
  fadeIn={true}
/>
```

### FAQ with Search
```typescript
<FAQSection
  title="Frequently Asked Questions"
  description="Find answers to common questions"
  faqs={faqPresets.general(locale)}
  variant="accordion"
  showSearch={true}
  showCategories={true}
  collapsible={true}
/>
```

## Design System Integration

### Colors
- Primary: Green (`green-500` to `green-700`)
- Secondary: Blue (`blue-500` to `blue-700`)
- Status: Red (errors), Orange (warnings), Teal (info)
- Backgrounds: Gray scales (`gray-50` to `gray-900`)

### Typography
- Form labels: `font-medium` with appropriate contrast
- Input text: `font-normal` with good readability
- Headings: Consistent hierarchy with `font-bold` or `font-semibold`

### Spacing
- Form padding: `p-6` (md), `p-8` (lg)
- Input spacing: `gap-4` between fields
- Section spacing: `py-12` (standard), `py-16` (hero)

### Responsive Design
- Mobile: Single column layouts
- Tablet: 2-column grids
- Desktop: 3-4 column grids as specified
- Breakpoints: `sm:`, `md:`, `lg:` prefixes

## Accessibility Features

- Semantic HTML elements (`form`, `section`, `label`)
- ARIA labels for all interactive elements
- Proper focus management
- Screen reader friendly form validation
- Keyboard navigation support
- Sufficient color contrast ratios

## Performance Considerations

- Lazy loading for maps
- Optimized re-renders with React state management
- Efficient CSS with Tailwind's utility classes
- Minimal JavaScript bundle size
- Proper image sizing and formats for icons

## Form Handling

### Validation
- Required field validation
- Email format validation
- Minimum message length
- Real-time error display
- Clear error messages

### Submission
- Loading states with visual feedback
- Success/error notifications
- Form reset after submission
- Network error handling
- Retry mechanisms

## Testing

Components should be tested for:
- Form validation and submission
- Responsive behavior across screen sizes
- Accessibility compliance (WCAG 2.1)
- Internationalization support
- Interactive states (hover, focus, active)
- Error handling and edge cases

## Integration with Backend

### Form Submission
```typescript
const handleFormSubmit = async (data) => {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Submission failed');
    return await response.json();
  } catch (error) {
    throw error;
  }
};
```

### Error Handling
- Network errors
- Validation errors
- Server errors
- Timeout handling
- User feedback

## Best Practices

### Form Design
1. Keep forms simple and intuitive
2. Use appropriate input types
3. Provide clear labels and placeholders
4. Group related fields
5. Use progressive disclosure for complex forms

### User Experience
1. Provide immediate feedback
2. Show loading states
3. Handle errors gracefully
4. Confirm successful submissions
5. Allow form reset or edit

### Security
1. Implement CSRF protection
2. Sanitize user input
3. Rate limiting for submissions
4. Email validation
5. Bot detection

## Demo

Visit `/contact` to see all components in action with different configurations.

## Contributing

When adding new components or modifying existing ones:
1. Follow the established prop naming conventions
2. Maintain TypeScript type safety
3. Include comprehensive documentation
4. Add to the demo page for visual testing
5. Ensure backward compatibility when possible
6. Add accessibility features
7. Test responsive behavior
8. Include error handling

## License

These components are part of the Goalkick Live project and follow the same licensing terms.