# PsicoPlus

Software de gestión para consultorios de psicología: agenda de turnos, historia de pacientes, facturación y liquidaciones a los profesionales del consultorio.

**Demo:** https://psicoplus-iota.vercel.app

## Qué hace

- **Agenda de turnos** con portal para que el paciente reserve.
- **Ficha de pacientes** y seguimiento.
- **Facturación** con generación de comprobantes en PDF.
- **Finanzas** del consultorio y **liquidaciones** por profesional.
- **Dashboard** con la actividad del mes.
- Recordatorios por WhatsApp.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | React 19 + Vite 8 |
| Backend | Supabase (base de datos, auth y storage) |
| Estilos | Tailwind CSS 4 |
| PDFs | jsPDF |
| Iconos | lucide-react |
| Deploy | Vercel |

## Cómo correrlo

```bash
git clone https://github.com/nic0420/PsicoPlus.git
cd PsicoPlus
npm install
cp .env.example .env    # completar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
npm run dev
```
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
