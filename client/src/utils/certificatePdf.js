
import { getCertificateText } from "../data/certificates";

const PAGE_WIDTH = 297;
const PAGE_HEIGHT = 210;

function safeText(value, fallback = "—") {
  const result = String(value ?? "").trim();
  return result || fallback;
}

function safeFilePart(value) {
  return String(value ?? "certificate")
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "certificate";
}

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function drawCenteredText(pdf, text, y, options = {}) {
  const {
    fontSize = 12,
    color = [34, 54, 43],
    fontStyle = "normal",
    maxWidth = 235,
  } = options;

  pdf.setFont("helvetica", fontStyle);
  pdf.setFontSize(fontSize);
  pdf.setTextColor(...color);

  const lines = pdf.splitTextToSize(text, maxWidth);
  const lineHeight = fontSize * 0.45;

  lines.forEach((line, index) => {
    pdf.text(line, PAGE_WIDTH / 2, y + index * lineHeight, {
      align: "center",
    });
  });

  return y + (lines.length - 1) * lineHeight;
}

export async function generateCertificatePdf({
  certificate,
  studentName = "BEHAR Student",
  language = "en",
}) {
  if (!certificate || certificate.status !== "earned") {
    throw new Error(
      "Only earned certificates can be downloaded."
    );
  }

  if (!certificate.certificateId) {
    throw new Error("Certificate ID is missing.");
  }

  // Built-in Helvetica does not support Arabic glyph shaping.
  // Reject unsupported text instead of creating an unreadable PDF.
  const courseTitle = getCertificateText(
    certificate.title,
    language
  );

  const instructor = getCertificateText(
    certificate.instructor,
    language
  );

  const containsNonLatin = (text) =>
    /[^\u0000-\u00FF]/.test(String(text));

  if (
    containsNonLatin(studentName) ||
    containsNonLatin(courseTitle) ||
    containsNonLatin(instructor)
  ) {
    throw new Error(
      "Arabic and other non-Latin certificate text requires an embedded Unicode font. PDF export is not available for this text yet."
    );
  }

  const { jsPDF } = await import("jspdf");

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const green = [32, 82, 61];
  const gold = [158, 123, 65];
  const muted = [112, 121, 112];

  // Background
  pdf.setFillColor(250, 249, 244);
  pdf.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");

  // Outer frame
  pdf.setDrawColor(...green);
  pdf.setLineWidth(0.8);
  pdf.rect(9, 9, PAGE_WIDTH - 18, PAGE_HEIGHT - 18);

  // Inner frame
  pdf.setDrawColor(210, 198, 169);
  pdf.setLineWidth(0.3);
  pdf.rect(13, 13, PAGE_WIDTH - 26, PAGE_HEIGHT - 26);

  // Decorative corners
  pdf.setDrawColor(...gold);
  pdf.setLineWidth(1.2);

  const corners = [
    [18, 18, 1, 1],
    [279, 18, -1, 1],
    [18, 192, 1, -1],
    [279, 192, -1, -1],
  ];

  corners.forEach(([x, y, dx, dy]) => {
    pdf.line(x, y, x + dx * 12, y);
    pdf.line(x, y, x, y + dy * 12);
  });

  // Brand
  drawCenteredText(pdf, "BEHAR", 34, {
    fontSize: 22,
    fontStyle: "bold",
    color: green,
  });

  drawCenteredText(pdf, "BEHAR ACADEMY", 43, {
    fontSize: 9,
    color: gold,
  });

  // Heading
  drawCenteredText(pdf, "CERTIFICATE OF COMPLETION", 62, {
    fontSize: 19,
    fontStyle: "bold",
    color: green,
  });

  drawCenteredText(
    pdf,
    "This demo certificate is presented to",
    75,
    {
      fontSize: 10,
      color: muted,
    }
  );

  // Student
  const nameEnd = drawCenteredText(
    pdf,
    safeText(studentName),
    91,
    {
      fontSize: 23,
      fontStyle: "bold",
      color: green,
    }
  );

  pdf.setDrawColor(...gold);
  pdf.setLineWidth(0.4);
  pdf.line(93, nameEnd + 5, 204, nameEnd + 5);

  // Course
  drawCenteredText(
    pdf,
    "For completing the learning requirements of",
    114,
    {
      fontSize: 10,
      color: muted,
    }
  );

  drawCenteredText(pdf, safeText(courseTitle), 127, {
    fontSize: 17,
    fontStyle: "bold",
    color: green,
  });

  // Instructor
  drawCenteredText(
    pdf,
    `Instructor: ${safeText(instructor)}`,
    145,
    {
      fontSize: 10,
      color: muted,
    }
  );

  // Footer separator
  pdf.setDrawColor(220, 218, 207);
  pdf.setLineWidth(0.3);
  pdf.line(28, 159, 269, 159);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(...muted);

  pdf.text("ISSUED ON", 32, 169);
  pdf.text("CERTIFICATE ID", 265, 169, {
    align: "right",
  });

  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...green);

  pdf.text(formatDate(certificate.issuedAt), 32, 177);

  pdf.text(
    safeText(certificate.certificateId),
    265,
    177,
    { align: "right" }
  );

  // Explicitly mark the exported credential as a demo.
  drawCenteredText(
    pdf,
    "DEMO CERTIFICATE - NOT OFFICIALLY VERIFIED",
    190,
    {
      fontSize: 8,
      color: gold,
      fontStyle: "bold",
    }
  );

  const filename =
    `BEHAR-${safeFilePart(courseTitle)}-${safeFilePart(
      certificate.certificateId
    )}.pdf`;

  pdf.save(filename);

  return filename;
}
