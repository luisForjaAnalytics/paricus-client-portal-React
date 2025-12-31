# AppText Component

Componente universal de tipografía para **TODA la aplicación**. Proporciona estilos consistentes en todos los módulos (tickets, financials, audio recordings, knowledge base, etc.).

## 📦 Ubicación

```
frontend/src/common/components/ui/AppText/
├── AppText.jsx    # Componente principal
├── index.js       # Export barrel
└── README.md      # Esta documentación
```

## 🎯 Propósito

- **Universalidad**: Un solo componente para TODOS los módulos
- **Estandarización**: Estilos consistentes basados en `typography` de `styles.js`
- **Mantenibilidad**: Cambios centralizados afectan toda la app
- **Escalabilidad**: Fácil agregar nuevas variantes
- **DRY**: Elimina repetición de estilos

## 🔧 Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | *requerido* | Contenido a mostrar |
| `variant` | `string` | `"body"` | Variante de tipografía (ver tabla abajo) |
| `color` | `string` | `"primary"` | Variante de color (ver tabla abajo) |
| `component` | `string` | `undefined` | Elemento HTML a renderizar |
| `sx` | `object` | `{}` | Estilos MUI adicionales |

## 🎨 Variantes de Tipografía

### Headings

| Variant | Tamaño | Peso | Uso |
|---------|--------|------|-----|
| `h1` | 24px | Bold | Títulos de página principales |
| `h2` | 20px | Semibold | Títulos de sección |
| `h3` | 18px | Semibold | Títulos de tarjetas |

### Body Text

| Variant | Tamaño | Peso | Uso |
|---------|--------|------|-----|
| `body` | 14px | Regular | Texto estándar (default) |
| `bodyMedium` | 14px | Medium | Texto con énfasis medio |
| `bodySemibold` | 14px | Semibold | Texto semi-negrita |
| `bodyBold` | 14px | Bold | Texto en negrita |

### Small Text

| Variant | Tamaño | Peso | Uso |
|---------|--------|------|-----|
| `small` | 12px | Regular | Etiquetas, subtextos |
| `smallMedium` | 12px | Medium | Etiquetas con énfasis |
| `smallBold` | 12px | Bold | Etiquetas destacadas |

### Special

| Variant | Tamaño | Peso | Uso |
|---------|--------|------|-----|
| `cardValue` | 24px | Bold | Valores numéricos en tarjetas |
| `tableHeader` | 12px | Bold | Encabezados de tablas (uppercase) |

## 🌈 Variantes de Color

| Color | CSS Color | Uso |
|-------|-----------|-----|
| `primary` | `#111827` | Texto principal (default) |
| `secondary` | `#374151` | Texto secundario |
| `tertiary` | `#4B5563` | Texto terciario |
| `muted` | `#6B7281` | Texto apagado/deshabilitado |
| `white` | `#FFFFFF` | Texto blanco |
| `success` | `#065F46` | Mensajes de éxito |
| `error` | `#991B1B` | Mensajes de error |
| `warning` | `#92400E` | Mensajes de advertencia |
| `info` | `#1E40AF` | Mensajes informativos |

## 📚 Ejemplos de Uso

### Uso Básico

```jsx
import { AppText } from "@/common/components/ui/AppText";

function MyComponent() {
  return <AppText>This is regular body text</AppText>;
}
```

### Headings

```jsx
<AppText variant="h1">Page Title</AppText>
<AppText variant="h2">Section Title</AppText>
<AppText variant="h3">Card Title</AppText>
```

### Body Variants

```jsx
<AppText variant="body">Regular text</AppText>
<AppText variant="bodyMedium">Medium weight text</AppText>
<AppText variant="bodySemibold">Semi-bold text</AppText>
<AppText variant="bodyBold">Bold text</AppText>
```

### Small Text

```jsx
<AppText variant="small">Small label</AppText>
<AppText variant="smallBold">Bold small label</AppText>
```

### Colors

```jsx
<AppText color="primary">Primary text</AppText>
<AppText color="secondary">Secondary text</AppText>
<AppText color="muted">Muted text</AppText>
<AppText color="error">Error message</AppText>
<AppText color="success">Success message</AppText>
```

### Combined

```jsx
<AppText variant="bodyBold" color="error">
  Bold error message
</AppText>

<AppText variant="h2" color="primary" sx={{ mb: 3 }}>
  Section with margin
</AppText>
```

### Custom Component

```jsx
<AppText component="span" variant="bodyBold">
  Inline bold text
</AppText>

<AppText component="p" variant="body">
  Paragraph text
</AppText>
```

## 🏢 Uso por Módulo

### 1. Tickets Module

```jsx
import { AppText } from "@/common/components/ui/AppText";

// Ticket details
<AppText variant="bodyBold">Subject:</AppText>
<AppText>Payment processing error</AppText>

// Ticket status
<AppText variant="small" color="muted">
  Created: {formatDate(ticket.createdAt)}
</AppText>

// Priority indicator
<AppText variant="bodyBold" color="error">
  High Priority
</AppText>
```

### 2. Financials Module

```jsx
import { AppText } from "@/common/components/ui/AppText";

// Invoice card
<AppText variant="h3">Invoice #{invoice.number}</AppText>
<AppText variant="cardValue" color="primary">
  ${invoice.amount}
</AppText>

// Status badge
<AppText variant="smallBold" color="success">
  PAID
</AppText>

// Client name
<AppText variant="bodySemibold">{client.name}</AppText>

// Invoice details
<AppText variant="small" color="secondary">
  Due: {invoice.dueDate}
</AppText>
```

### 3. Audio Recordings Module

```jsx
import { AppText } from "@/common/components/ui/AppText";

// Recording info
<AppText variant="bodyBold">Call ID:</AppText>
<AppText>{recording.id}</AppText>

// Duration
<AppText variant="smallBold" color="muted">
  Duration: {recording.duration}
</AppText>

// Agent name
<AppText variant="body">{recording.agentName}</AppText>
```

### 4. Knowledge Base Module

```jsx
import { AppText } from "@/common/components/ui/AppText";

// Article title
<AppText variant="h2">{article.title}</AppText>

// Category
<AppText variant="smallBold" color="info">
  {article.category}
</AppText>

// Content
<AppText variant="body">{article.content}</AppText>

// Metadata
<AppText variant="small" color="muted">
  Last updated: {article.updatedAt}
</AppText>
```

### 5. User Management Module

```jsx
import { AppText } from "@/common/components/ui/AppText";

// User name
<AppText variant="bodySemibold">{user.fullName}</AppText>

// Role
<AppText variant="small" color="secondary">
  {user.role.name}
</AppText>

// Status
<AppText variant="smallBold" color={user.isActive ? "success" : "error"}>
  {user.isActive ? "ACTIVE" : "INACTIVE"}
</AppText>
```

### 6. Dashboard Module

```jsx
import { AppText } from "@/common/components/ui/AppText";

// Card title
<AppText variant="h3">Total Revenue</AppText>

// Card value
<AppText variant="cardValue" color="success">
  $125,430
</AppText>

// Card subtitle
<AppText variant="small" color="muted">
  +12% from last month
</AppText>
```

### 7. Reports Module

```jsx
import { AppText } from "@/common/components/ui/AppText";

// Report name
<AppText variant="bodyBold">{report.name}</AppText>

// Generated date
<AppText variant="small" color="secondary">
  Generated: {report.generatedAt}
</AppText>

// File size
<AppText variant="small" color="muted">
  {formatFileSize(report.fileSize)}
</AppText>
```

## 🔄 Migration Examples

### Before (Not Standardized)

```jsx
// Different styles everywhere 😢
<Typography sx={{ fontSize: "14px", fontFamily: "'Inter', sans-serif", color: "#111827" }}>
  Text
</Typography>

<Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>
  Label
</Typography>

<Typography sx={ticketStyle.historicalDescription.textInfo.typography}>
  Nested style path
</Typography>
```

### After (Standardized) ✨

```jsx
// Consistent and clean 😊
<AppText>Text</AppText>

<AppText variant="smallBold" color="secondary">
  Label
</AppText>

<AppText variant="bodyBold">
  Simple and clear
</AppText>
```

## 📊 Benefits

| Aspect | Before | After |
|--------|--------|-------|
| **Code Length** | 80+ chars | 20-30 chars |
| **Consistency** | ❌ Manual | ✅ Automatic |
| **Maintainability** | ❌ Low | ✅ High |
| **Reusability** | ❌ None | ✅ 100% |
| **Type Safety** | ⚠️ Weak | ✅ PropTypes |
| **Cross-module** | ❌ No | ✅ Yes |

## 🚀 Adding New Variants

### 1. Add to `variantStyles` in AppText.jsx:

```javascript
variantStyles: {
  // ... existing variants
  caption: {
    fontSize: typography.fontSize.caption,
    fontWeight: typography.fontWeight.regular,
    fontStyle: "italic",
  },
}
```

### 2. Update PropTypes:

```javascript
variant: PropTypes.oneOf([
  // ... existing
  "caption",
]),
```

### 3. Use it:

```jsx
<AppText variant="caption">Caption text</AppText>
```

## 💡 Best Practices

### ✅ DO

```jsx
// Use AppText for all text
<AppText variant="h2">Title</AppText>

// Combine variants and colors
<AppText variant="bodyBold" color="error">Error</AppText>

// Use sx for one-off overrides
<AppText sx={{ mb: 2 }}>Text with margin</AppText>

// Use appropriate variants
<AppText variant="cardValue">$1,234</AppText>
```

### ❌ DON'T

```jsx
// Don't use inline Typography
<Typography sx={{ fontSize: "14px", ... }}>Text</Typography>

// Don't create custom typography components per module
<FinancialText>Text</FinancialText>
<AudioText>Text</AudioText>

// Don't override core styles
<AppText sx={{ fontFamily: "Arial" }}>Bad</AppText>

// Don't use wrong variants
<AppText variant="h1">Small label</AppText> // Should be "small"
```

## 🎯 Module-Specific Wrappers (Optional)

If a module needs specific defaults, create a thin wrapper:

```jsx
// frontend/src/modules/financials/components/FinancialText.jsx
import { AppText } from "@/common/components/ui/AppText";

export const FinancialText = ({ color = "primary", ...props }) => {
  return <AppText color={color} {...props} />;
};

// Usage
<FinancialText variant="cardValue">$1,234</FinancialText>
```

## 🔗 Related Components

- **TicketText**: Wrapper around AppText for tickets module (legacy compatibility)
- All future module-specific text components should use AppText

## 📝 Notes

- Based on centralized `typography` system in `styles.js`
- Uses Material-UI Typography internally
- Fully compatible with MUI's `sx` prop
- Font family is always Inter (from typography.fontFamily)
- Line height defaults to 1.6 for readability

---

**Created by:** Development Team
**Last Updated:** 2025-12-30
**Status:** ✅ Production Ready
