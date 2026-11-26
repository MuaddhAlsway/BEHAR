
import { useEffect, useState } from "react";
import {
  File as FileIcon,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  Download,
  ExternalLink,
  X,
  AlertCircle,
} from "lucide-react";

/**
 * BEHAR LMS — AttachmentPreview
 *
 * Props:
 * attachments: Array of attachment objects
 * onRemove: Optional callback receiving attachment id
 * language: "en" | "ar"
 * variant: "composer" | "message"
 *
 * Attachment shape:
 * {
 *   id: string,
 *   name: string,
 *   size: number,
 *   type: string,
 *   file?: File,
 *   url?: string
 * }
 *
 * Composer mode:
 * - Local file previews
 * - Remove attachments
 *
 * Message mode:
 * - Display attachment metadata
 * - Open or download when a valid URL exists
 */

const translations = {
  en: {
    attachment: "Attachment",
    attachments: "Attachments",
    remove: "Remove attachment",
    download: "Download attachment",
    open: "Open attachment",
    previewUnavailable: "Preview unavailable",
    fileUnavailable: "File unavailable",
    imagePreview: "Image preview",
  },
  ar: {
    attachment: "مرفق",
    attachments: "المرفقات",
    remove: "إزالة المرفق",
    download: "تنزيل المرفق",
    open: "فتح المرفق",
    previewUnavailable: "المعاينة غير متاحة",
    fileUnavailable: "الملف غير متاح",
    imagePreview: "معاينة الصورة",
  },
};

function formatFileSize(bytes, language = "en") {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "—";
  }

  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const value = bytes / Math.pow(1024, index);

  return `${new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US",
    { maximumFractionDigits: 1 }
  ).format(value)} ${units[index]}`;
}

function getAttachmentCategory(attachment) {
  const safeAttachment = attachment && typeof attachment === "object"
    ? attachment
    : {};
  const type = typeof safeAttachment.type === "string"
    ? safeAttachment.type
    : "";
  const name = typeof safeAttachment.name === "string"
    ? safeAttachment.name.toLowerCase()
    : "";

  if (
    type.startsWith("image/") ||
    /\.(png|jpe?g|webp|gif|avif)$/i.test(name)
  ) {
    return "image";
  }

  if (
    type === "application/pdf" ||
    name.endsWith(".pdf")
  ) {
    return "pdf";
  }

  if (
    type.startsWith("video/") ||
    /\.(mp4|webm|mov)$/i.test(name)
  ) {
    return "video";
  }

  if (
    type.startsWith("audio/") ||
    /\.(mp3|wav|ogg|m4a)$/i.test(name)
  ) {
    return "audio";
  }

  if (
    /\.(zip|rar|7z|tar|gz)$/i.test(name)
  ) {
    return "archive";
  }

  if (
    /\.(docx?|xlsx?|pptx?|txt|csv)$/i.test(name)
  ) {
    return "document";
  }

  return "file";
}

function getAttachmentIcon(category) {
  switch (category) {
    case "image":
      return FileImage;
    case "pdf":
    case "document":
      return FileText;
    case "video":
      return FileVideo;
    case "audio":
      return FileAudio;
    case "archive":
      return FileArchive;
    default:
      return FileIcon;
  }
}

function getSafeUrl(url) {
  if (typeof url !== "string" || !url.trim()) {
    return null;
  }

  try {
    const parsed = new URL(
      url,
      typeof window !== "undefined"
        ? window.location.origin
        : "https://example.com"
    );

    if (
      parsed.protocol === "https:" ||
      parsed.protocol === "http:" ||
      parsed.protocol === "blob:"
    ) {
      return parsed.href;
    }
  } catch {
    return null;
  }

  return null;
}

function AttachmentCard({
  attachment,
  onRemove,
  language,
  variant,
}) {
  const safeAttachment = attachment && typeof attachment === "object"
    ? attachment
    : {};
  const [objectUrl, setObjectUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  const t = translations[language] || translations.en;

  const category = getAttachmentCategory(safeAttachment);
  const Icon = getAttachmentIcon(category);

  const file =
    typeof File !== "undefined" &&
    safeAttachment.file instanceof File
      ? safeAttachment.file
      : null;

  useEffect(() => {
    if (!file) {
      setObjectUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setObjectUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const url = objectUrl || getSafeUrl(safeAttachment.url);

  const canPreviewImage =
    category === "image" &&
    Boolean(url) &&
    !imageError;

  const isComposer = variant === "composer";
  const canRemove =
    isComposer && typeof onRemove === "function";

  return (
    <div
      className={[
        "attachment-preview__item",
        `attachment-preview__item--${category}`,
        `attachment-preview__item--${variant}`,
      ].join(" ")}
    >
      <div className="attachment-preview__thumbnail">
        {canPreviewImage ? (
          <img
            src={url}
            alt={`${t.imagePreview}: ${safeAttachment.name || t.attachment}`}
            loading="lazy"
            onError={() => setImageError(true)}
            className="attachment-preview__image"
          />
        ) : (
          <Icon
            size={22}
            strokeWidth={1.7}
            aria-hidden="true"
          />
        )}
      </div>

      <div className="attachment-preview__details">
        <span
          className="attachment-preview__name"
          title={safeAttachment.name || t.attachment}
        >
          {safeAttachment.name || t.attachment}
        </span>

        <span className="attachment-preview__meta">
          {formatFileSize(Number(safeAttachment.size), language)}
          {" · "}
          {category.toUpperCase()}
        </span>
      </div>

      <div className="attachment-preview__actions">
        {canRemove && (
          <button
            type="button"
            className="attachment-preview__action attachment-preview__action--remove"
            onClick={() => onRemove(safeAttachment.id)}
            aria-label={`${t.remove}: ${safeAttachment.name || t.attachment}`}
            title={t.remove}
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}

        {!isComposer && url && (
          <>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="attachment-preview__action"
              aria-label={`${t.open}: ${safeAttachment.name || t.attachment}`}
              title={t.open}
            >
              <ExternalLink
                size={16}
                aria-hidden="true"
              />
            </a>

            <a
              href={url}
              download={safeAttachment.name || "attachment"}
              className="attachment-preview__action"
              aria-label={`${t.download}: ${safeAttachment.name || t.attachment}`}
              title={t.download}
            >
              <Download
                size={16}
                aria-hidden="true"
              />
            </a>
          </>
        )}

        {!isComposer && !url && (
          <span
            className="attachment-preview__unavailable"
            title={t.fileUnavailable}
            aria-label={t.fileUnavailable}
          >
            <AlertCircle
              size={16}
              aria-hidden="true"
            />
          </span>
        )}
      </div>
    </div>
  );
}

export default function AttachmentPreview({
  attachments = [],
  onRemove,
  language = "en",
  variant = "composer",
}) {
  if (!Array.isArray(attachments) || !attachments.length) {
    return null;
  }

  const currentLanguage =
    language === "ar" ? "ar" : "en";

  const t = translations[currentLanguage];

  return (
    <section
      className={[
        "attachment-preview",
        `attachment-preview--${variant}`,
      ].join(" ")}
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
      aria-label={t.attachments}
    >
      <div className="attachment-preview__list">
        {attachments.map((attachment, index) => (
          <AttachmentCard
            key={attachment?.id ?? `attachment-${index}`}
            attachment={attachment}
            onRemove={onRemove}
            language={currentLanguage}
            variant={variant}
          />
        ))}
      </div>
    </section>
  );
}
