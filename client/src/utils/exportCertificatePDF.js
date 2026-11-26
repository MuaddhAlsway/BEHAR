
export async function exportCertificatePDF(element, certificate) {
  if (!element) {
    throw new Error("Certificate element not found.");
  }

  if (
    !certificate ||
    certificate.status !== "earned" ||
    !certificate.certificateId
  ) {
    throw new Error("Certificate is not eligible for download.");
  }

  const [{ default: html2canvas }, { jsPDF }] =
    await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  await new Promise((resolve) => requestAnimationFrame(resolve));

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#f9f8f3",
    useCORS: true,
    logging: false,
    width: 1123,
    height: 794,
    windowWidth: 1200,
  });

  const image = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.addImage(
    image,
    "PNG",
    0,
    0,
    pageWidth,
    pageHeight
  );

  const safeId = certificate.certificateId
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .slice(0, 100);

  pdf.save(`BEHAR-Certificate-${safeId}.pdf`);
}
