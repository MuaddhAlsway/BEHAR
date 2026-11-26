
import { certificates } from "../data/certificates";

// Adjust the named import only if your existing
// certificates.js uses a different export name.

const CERTIFICATE_ID_PATTERN =
  /^BEHAR-(?:CERT|DEMO)-\d{4}-[A-Z0-9-]{3,40}$/;

export function normalizeCertificateId(value) {
  if (typeof value !== "string") return "";

  return value.trim().toUpperCase();
}

export function validateCertificateId(value) {
  const id = normalizeCertificateId(value);

  if (!id) {
    return {
      valid: false,
      reason: "required",
      id,
    };
  }

  if (!CERTIFICATE_ID_PATTERN.test(id)) {
    return {
      valid: false,
      reason: "invalid-format",
      id,
    };
  }

  return {
    valid: true,
    reason: null,
    id,
  };
}

export function lookupDemoCertificate(value) {
  const validation = validateCertificateId(value);

  if (!validation.valid) {
    return {
      status: "invalid",
      reason: validation.reason,
      certificate: null,
      id: validation.id,
    };
  }

  const certificate = certificates.find(
    (item) =>
      item.status === "earned" &&
      normalizeCertificateId(item.certificateId) ===
        validation.id
  );

  if (!certificate) {
    return {
      status: "not-found",
      reason: null,
      certificate: null,
      id: validation.id,
    };
  }

  return {
    status: "demo-found",
    reason: null,
    certificate,
    id: validation.id,
  };
}

export function getCertificateVerificationUrl(
  certificateId,
  origin = window.location.origin
) {
  const validation = validateCertificateId(certificateId);

  if (!validation.valid) return null;

  const url = new URL("/verify-certificate", origin);
  url.searchParams.set("id", validation.id);

  return url.toString();
}
