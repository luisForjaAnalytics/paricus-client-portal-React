# TicketText Component

Componente reutilizable de tipografía para texto relacionado con tickets. Proporciona estilos consistentes en todos los componentes de tickets.

## 📦 Ubicación

```
frontend/src/common/components/ui/TicketText/
├── TicketText.jsx  # Componente principal
├── index.js        # Export barrel
└── README.md       # Esta documentación
```

## 🎯 Propósito

- **Estandarización**: Garantiza estilos de texto consistentes en toda la aplicación
- **Mantenibilidad**: Cambios centralizados en `styles.js`
- **Reutilización**: Un componente, múltiples variantes
- **DRY**: Evita repetir estilos en cada componente

## 🔧 Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | *requerido* | Contenido a mostrar |
| `variant` | `"body"` \| `"label"` \| `"bold"` | `"body"` | Variante de estilo |
| `component` | `string` | `undefined` | Elemento HTML a renderizar (ej: "span", "div") |
| `sx` | `object` | `{}` | Estilos MUI adicionales para sobrescribir |

## 🎨 Variantes

### `body` (default)
Texto estándar para contenido general.

```javascript
<TicketText>
  This is regular body text
</TicketText>
```

**Estilos aplicados:**
- `fontSize`: Body size
- `fontFamily`: Inter
- `color`: Text primary

---

### `label`
Texto pequeño y negrita para etiquetas.

```javascript
<TicketText variant="label">
  Status:
</TicketText>
```

**Estilos aplicados:**
- `fontSize`: Small
- `fontFamily`: Inter
- `color`: Text secondary
- `fontWeight`: 600

---

### `bold`
Texto en negrita para énfasis.

```javascript
<TicketText variant="bold">
  Important information
</TicketText>
```

**Estilos aplicados:**
- `fontSize`: Body size
- `fontFamily`: Inter
- `color`: Text primary
- `fontWeight`: 600

## 📚 Ejemplos de Uso

### Uso básico

```jsx
import { TicketText } from "@/common/components/ui/TicketText";

function TicketDetail() {
  return (
    <Box>
      <TicketText variant="label">
        Subject:
      </TicketText>
      <TicketText>
        Error in payment processing
      </TicketText>
    </Box>
  );
}
```

### Con estilos personalizados

```jsx
<TicketText sx={{ color: "red", marginTop: 2 }}>
  Error message with custom color
</TicketText>
```

### Con componente personalizado

```jsx
<TicketText component="span" variant="bold">
  Inline bold text
</TicketText>
```

### Ejemplo completo (TicketHistoricalInfo)

```jsx
import { TicketText } from "@/common/components/ui/TicketText";

export const TicketHistoricalInfo = ({ ticketInfo }) => {
  const { t } = useTranslation();

  return (
    <Box sx={ticketStyle.historicalContainer}>
      <Box sx={ticketStyle.historicalDescriptionBox}>
        <Box display="flex" flexDirection="row" gap={1}>
          {/* Label en negrita */}
          <TicketText variant="bold">
            {`${t('tickets.ticketView.updatedAt')}:`}
          </TicketText>

          {/* Fecha (usando Typography normal) */}
          <Typography>
            {formatDateTime(ticketInfo.timestamp)}
          </Typography>
        </Box>

        {/* Descripción con padding personalizado */}
        <TicketText sx={{ paddingLeft: "6rem" }}>
          {ticketInfo.descriptionData}
        </TicketText>
      </Box>
    </Box>
  );
};
```

## 🔗 Relación con styles.js

Los estilos provienen de `ticketStyle` en `common/styles/styles.js`:

```javascript
export const ticketStyle = {
  typography: {          // variant="body"
    fontSize: typography.fontSize.body,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
  },
  typographyLabel: {     // variant="label"
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    fontWeight: 600,
  },
  typographyBold: {      // variant="bold"
    fontSize: typography.fontSize.body,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
    fontWeight: 600,
  },
};
```

## ✅ Ventajas sobre estilos inline

### ❌ Antes (No recomendado)

```jsx
<Typography sx={{
  fontSize: "14px",
  fontFamily: "'Inter', sans-serif",
  color: "#111827"
}}>
  Text
</Typography>
```

**Problemas:**
- ❌ No hay consistencia
- ❌ Difícil de mantener
- ❌ Repetición de código
- ❌ Sin control centralizado

### ✅ Ahora (Recomendado)

```jsx
<TicketText>
  Text
</TicketText>
```

**Beneficios:**
- ✅ Consistente en toda la app
- ✅ Fácil de mantener
- ✅ DRY (Don't Repeat Yourself)
- ✅ Cambios centralizados

## 🎯 Cuándo usar TicketText

### ✅ SÍ usar TicketText cuando:

- Mostrando información de tickets
- Necesitas texto con estilo consistente
- Quieres estandarización automática
- Trabajas en módulo de tickets

### ❌ NO usar TicketText cuando:

- Necesitas un componente Typography de MUI con props especiales
- Estás fuera del contexto de tickets (usa otros componentes)
- Necesitas una variante que no existe (considera agregar una nueva)

## 🚀 Agregar nuevas variantes

Para agregar una nueva variante:

1. **Agregar estilo en `styles.js`:**

```javascript
export const ticketStyle = {
  // ... estilos existentes
  typographyTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
    fontWeight: 700,
  },
};
```

2. **Actualizar `TicketText.jsx`:**

```javascript
const variantStyleMap = {
  body: "typography",
  label: "typographyLabel",
  bold: "typographyBold",
  title: "typographyTitle",  // ← Nueva variante
};
```

3. **Actualizar PropTypes:**

```javascript
variant: PropTypes.oneOf(["body", "label", "bold", "title"]),
```

## 📝 Notas

- El componente utiliza `Typography` de Material-UI internamente
- Los estilos se pueden sobrescribir con la prop `sx`
- La prop `component` permite cambiar el elemento HTML renderizado
- Todos los estilos están centralizados en `common/styles/styles.js`

## 🔄 Migración de código antiguo

### Antes:
```jsx
<Typography sx={ticketStyle.historicalDescription.textInfo.typography}>
  Text
</Typography>
```

### Después:
```jsx
<TicketText>
  Text
</TicketText>
```

---

**Creado por:** Equipo de desarrollo
**Última actualización:** 2025-12-30
