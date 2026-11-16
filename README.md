# InstaNotes – Instagram Notes to PDF Converter

InstaNotes is a production-quality, responsive web application that turns Instagram notes, educational carousels, and study infographics into clean, printable A4 PDF documents.

Built with a high-performance **Java 21 Spring Boot 3** backend and a responsive **React (Vite) + Tailwind CSS** frontend.

---

## Features

- **Instagram URL Verification & Guidance**: Detects Instagram post & carousel URLs, explains official Meta Graph API boundaries, and guides users with an instant fallback workflow.
- **Multiple Image Upload**: Upload multiple slides (JPEG, PNG, WebP) with client-side and server-side magic byte validation.
- **Interactive Workspace**: Reorder pages via touch-friendly drag-and-drop (`@dnd-kit`), rotate slides 90° clockwise, delete slides, and view real-time page numbering.
- **Customizable PDF Options**:
  - Custom output filename.
  - Page orientation (Portrait & Landscape A4).
  - Proportional aspect fitting (`FIT_ASPECT`) or full bleed (`FILL_PAGE`).
  - Adjustable margin slider (0 to 72 pt).
- **Streaming Backend Generation**: Generates PDFs on-the-fly using Apache PDFBox 3.x and TwelveMonkeys ImageIO without retaining uploaded files on disk.

---

## Technology Stack

- **Backend**:
  - Java 21 LTS
  - Spring Boot 3.3.5 (Spring Web, Spring Validation)
  - Apache PDFBox 3.0.3
  - TwelveMonkeys ImageIO 3.11.0 (WebP, JPEG)
  - Maven 3.9.9 (via included `mvnw.cmd` wrapper)
- **Frontend**:
  - React (JavaScript) + Vite
  - Tailwind CSS v4 + `@tailwindcss/vite`
  - `@dnd-kit/core` & `@dnd-kit/sortable`
  - `lucide-react`
  - `canvas-confetti`

---

## Getting Started

### Prerequisites
- Java 21+ installed (`java -version`)
- Node.js 18+ and npm (`node -v`)

### 1. Run the Spring Boot Backend
Navigate to the `backend/` directory:
```bash
cd backend
.\mvnw.cmd spring-boot:run
```
The backend starts on `http://localhost:8080`.

### 2. Run the React Frontend
In a separate terminal, navigate to the `frontend/` directory:
```bash
cd frontend
npm install
npm run dev
```
The application opens at `http://localhost:5173`.

---

## REST API Reference

### `POST /api/pdf/generate`
Generates and downloads an A4 PDF document from uploaded image files.

**Request**: `multipart/form-data`
- `images` (required): Array of image files (`image/jpeg`, `image/png`, `image/webp`).
- `config` (optional): JSON blob adhering to `PdfGenerateRequest`:
```json
{
  "filename": "my-study-notes",
  "orientation": "PORTRAIT",
  "fitMode": "FIT_ASPECT",
  "margin": 18.0,
  "pageRotations": [0, 90, 0]
}
```

**Response**:
- Status: `200 OK`
- Header: `Content-Type: application/pdf`
- Header: `Content-Disposition: attachment; filename="my-study-notes.pdf"`

### `POST /api/images/validate`
Validates an image file's binary header, dimensions, and size.

**Request**: `multipart/form-data` with parameter `image`.

---

## Instagram API & Policy Compliance Note

Meta/Instagram strictly forbids unauthorized scraping, automated session-cookie replay, and reverse-engineered endpoints. To guarantee 100% compliance with Meta policies and platform stability:
1. InstaNotes verifies carousel link formatting.
2. Explains the requirement for Meta App Review and Graph API access tokens.
3. Provides a zero-latency manual image upload workspace to ensure user privacy and reliable operation.
