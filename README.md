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
