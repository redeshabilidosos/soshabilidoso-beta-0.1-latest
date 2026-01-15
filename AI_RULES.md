# AI Rules for SOS-HABILIDOSO Application

This document outlines the technical stack and specific library usage guidelines for developing the SOS-HABILIDOSO application. Adhering to these rules ensures consistency, maintainability, and leverages the strengths of our chosen technologies.

## Tech Stack Overview

The SOS-HABILIDOSO application is built using a modern and robust web development stack:

*   **React**: The core library for building interactive user interfaces.
*   **Next.js**: A full-stack React framework providing server-side rendering, routing, and API routes for a performant and scalable application.
*   **TypeScript**: Utilized throughout the codebase for type safety, improved developer experience, and fewer runtime errors.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs directly in your markup, ensuring responsive and consistent styling.
*   **shadcn/ui**: A collection of beautifully designed, accessible, and customizable UI components built with Radix UI and Tailwind CSS.
*   **Radix UI**: A low-level, unstyled component library providing accessible primitives for building robust UI components, which `shadcn/ui` is based upon.
*   **Lucide React**: A library providing a comprehensive set of customizable SVG icons for a modern visual appeal.
*   **React Hook Form & Zod**: Used together for efficient form management, validation, and schema definition.
*   **Sonner**: A modern toast library for displaying elegant and accessible notifications to users.
*   **Embla Carousel React**: A lightweight, dependency-free carousel library for creating fluid and touch-friendly carousels.
*   **Recharts**: A composable charting library built with React and D3 for data visualization.
*   **Vaul**: A drawer component for React that provides a highly customizable and accessible bottom sheet experience.
*   **Next-themes**: A library for managing dark mode and other themes in Next.js applications.

## Library Usage Rules

To maintain consistency and leverage the benefits of our tech stack, please follow these guidelines when implementing features:

*   **UI Components**:
    *   Always prioritize `shadcn/ui` components for all UI elements (buttons, inputs, dialogs, etc.).
    *   If a required component is not available in `shadcn/ui`, create a new component in `src/components/ui/` following the `shadcn/ui` pattern (using Radix UI primitives and styling with Tailwind CSS). Do not modify existing `shadcn/ui` files directly.
*   **Styling**:
    *   All styling must be done using **Tailwind CSS** utility classes. Avoid writing custom CSS files or inline styles unless absolutely necessary for unique, non-reusable cases.
    *   Ensure designs are responsive across different screen sizes.
*   **Icons**:
    *   Use icons from the `lucide-react` library for all graphical symbols.
*   **Forms and Validation**:
    *   For any form creation and validation, use `react-hook-form` in conjunction with `zod` for schema definition.
*   **Navigation**:
    *   Use `next/link` for client-side navigation between pages.
    *   For programmatic navigation or accessing route information, use `next/navigation` hooks like `useRouter` and `usePathname`.
*   **State Management**:
    *   For local component state, use React's `useState` and `useReducer` hooks.
    *   For global authentication state, utilize the `AuthContext` provided in `components/providers/providers.tsx`.
*   **Notifications**:
    *   Implement all toast notifications using the `sonner` library.
*   **Carousels**:
    *   For any carousel or image/content slider functionality, use `embla-carousel-react`.
*   **Charts**:
    *   For data visualization and charting, use `recharts`.
*   **Drawers/Sheets**:
    *   For bottom sheet or drawer-like UI elements, use `vaul`.
*   **Date Pickers**:
    *   For date selection inputs, use `react-day-picker`.