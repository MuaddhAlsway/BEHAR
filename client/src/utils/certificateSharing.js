
export function canShareCertificate(certificate) {
  return Boolean(
    certificate &&
    certificate.status === "earned" &&
    typeof certificate.certificateId === "string" &&
    certificate.certificateId.trim()
  );
}

export function getCertificateShareUrl(certificate) {
  if (!canShareCertificate(certificate)) return "";

  const url = new URL(
    "/verify-certificate",
    window.location.origin
  );

  url.searchParams.set("id", certificate.certificateId);

  return url.toString();
}

export async function copyCertificateLink(url) {
  if (!url || !navigator.clipboard?.writeText) {
    throw new Error("Clipboard API unavailable");
  }

  await navigator.clipboard.writeText(url);
}

export async function shareCertificateNative({
  title,
  text,
  url,
}) {
  if (typeof navigator.share !== "function") {
    return { status: "unsupported" };
  }

  try {
    await navigator.share({ title, text, url });

    return { status: "shared" };
  } catch (error) {
    if (error?.name === "AbortError") {
      return { status: "cancelled" };
    }

    return { status: "error" };
  }
}

export function getCertificateSocialLinks({
  title,
  url,
}) {
  const message = `${title}\n${url}`;

  return {
    linkedin:
      `https://www.linkedin.com/sharing/share-offsite/?url=${
        encodeURIComponent(url)
      }`,

    whatsapp:
      `https://wa.me/?text=${
        encodeURIComponent(message)
      }`,

    email:
      `mailto:?subject=${
        encodeURIComponent(title)
      }&body=${
        encodeURIComponent(message)
      }`,
  };
}
