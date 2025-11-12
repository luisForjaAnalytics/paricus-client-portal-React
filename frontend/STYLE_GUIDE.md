# Invoice Rover - Style Guide

This document outlines the design system and styling conventions for the Invoice Rover application. It's intended to help developers replicate the UI consistently. The entire UI is built using **Tailwind CSS**.

## 1. Color Palette

Colors are based on the default Tailwind CSS palette.

### Primary & Accent

| Color           | Usage                                   | Tailwind Class   | Hex       |
| --------------- | --------------------------------------- | ---------------- | --------- |
| Primary         | Main actions, logos, active states      | `bg-green-600`   | `#16A34A` |
| Primary Light   | Active backgrounds, badges              | `bg-green-100`   | `#D1FAE5` |
| Primary Dark    | Active text on light backgrounds        | `text-green-800` | `#065F46` |
| Focus Ring      | Focus states on inputs and buttons      | `ring-green-500` | `#22C55E` |

### Neutral (Grays)

| Usage              | Tailwind Class     | Hex       |
| ------------------ | ------------------ | --------- |
| Page Background    | `bg-gray-50`       | `#F9FAFB` |
| Card Background    | `bg-white`         | `#FFFFFF` |
| Primary Text       | `text-gray-900`    | `#111827` |
| Secondary Text     | `text-gray-700`    | `#374151` |
| Tertiary Text      | `text-gray-600`    | `#4B5563` |
| Muted/Placeholder  | `text-gray-500`    | `#6B7281` |
| Icon/Muted         | `text-gray-400`    | `#9CA3AF` |
| Border             | `border-gray-200`  | `#E5E7EB` |
| Input Border       | `border-gray-300`  | `#D1D5E0` |
| Selected Border    | `border-gray-700`  | `#374151` |

### Status Colors

Used for summary cards and status badges.

| Status    | Usage         | Background       | Text             | Border            |
| --------- | ------------- | ---------------- | ---------------- | ----------------- |
| **Info**  | Sent          | `bg-blue-100`    | `text-blue-800`  | `border-blue-500` |
| **Warning** | Pending       | `bg-yellow-100`  | `text-yellow-800`| `border-yellow-500`|
| **Success** | Paid, Revenue | `bg-green-100`   | `text-green-800` | `border-green-500`|
| **Danger**  | Overdue       | `bg-red-100`     | `text-red-800`   | `border-red-500`  |

---

## 2. Typography

- **Font Family**: Inter
- **Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

| Element             | Font Size     | Font Weight    | Tailwind Classes              |
| ------------------- | ------------- | -------------- | ----------------------------- |
| Page Title (H1)     | 1.5rem (24px) | Bold           | `text-2xl font-bold`          |
| Section Title (H2)  | 1.25rem (20px)| Semibold       | `text-xl font-semibold`       |
| Card Title          | 1.125rem (18px)| Bold          | `text-lg font-bold`           |
| Card Value          | 1.5rem (24px) | Semibold       | `text-2xl font-semibold`      |
| Body / Table Text   | 0.875rem (14px)| Medium/Regular | `text-sm font-medium`         |
| Subtext / Labels    | 0.75rem (12px)  | Regular/Medium | `text-xs`                     |
| Table Header        | 0.75rem (12px)  | Bold           | `text-xs font-bold uppercase` |

---

## 3. Layout & Spacing

The app uses Tailwind's default spacing scale (multiples of 0.25rem/4px).
- **Page Padding**: `p-6 md:p-8`
- **Section Spacing**: `space-y-8`
- **Grid Gaps**: `gap-5`, `gap-6`

---

## 4. Components

### Buttons

**Primary Action Button** (e.g., "Upload Invoice")
- **Base**: `flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-sm`
- **Hover**: `hover:bg-green-700`
- **Focus**: `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`

**Secondary Action Button** (e.g., "Refresh")
- **Base**: `flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm`
- **Hover**: `hover:bg-gray-50`
- **Focus**: `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`

**Icon Button**
- **Base**: `text-gray-400`
- **Hover**: Varies by context, e.g., `hover:text-blue-600`

### Cards

**Summary Card**
- **Container**: `overflow-hidden rounded-lg border-l-4 bg-white shadow-sm`
- **Border**: Status color, e.g., `border-green-500`
- **Hover**: `transition-shadow duration-300 hover:shadow-md`
- **Padding**: `p-5`

**Client Card**
- **Container**: `bg-white rounded-lg border shadow-sm p-5 cursor-pointer`
- **Border**: `border-gray-300`
- **Hover**: `transition-all duration-300 hover:shadow-md`
- **Selected State**: `border-gray-700 ring-2 ring-gray-200`

### Forms

**Search Input**
- **Container**: `relative w-full`
- **Input**: `block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900`
- **Focus**: `focus:border-green-500 focus:ring-green-500`

### Status Badges

- **Base**: `px-3 py-1 text-xs font-medium rounded-full inline-block`
- **Examples**:
    - **Sent**: `bg-blue-100 text-blue-800`
    - **Paid**: `bg-green-100 text-green-800`
    - **Overdue**: `bg-red-100 text-red-800`
    - **Pending Link**: `bg-yellow-100 text-yellow-800` (with icon)

### Table

- **Container**: `bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden`
- **Header (`<thead>`)**: `bg-gray-50`
- **Header Cell (`<th>`)**: `px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider`
- **Body (`<tbody>`)**: `bg-white divide-y divide-gray-200`
- **Row (`<tr>`)**: `hover:bg-gray-50 transition-colors`
- **Cell (`<td>`)**: `px-6 py-4 whitespace-nowrap text-sm`

---

## 5. Icons

- **Source**: Custom SVG components.
- **Default Size**: `h-6 w-6` for sidebar, `h-5 w-5` for smaller contexts.
- **Color**: `currentColor` is used, so color is inherited via `text-*` utility classes.

---

## 6. Borders & Shadows

- **Border Radius**: `rounded-lg` for most elements (cards, buttons, inputs). `rounded-full` for avatars and badges.
- **Shadows**:
    - **Default**: `shadow-sm`
    - **Hover**: `shadow-md`
