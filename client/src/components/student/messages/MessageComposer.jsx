
import { useRef, useState } from "react";
import { Paperclip, Send, AlertCircle } from "lucide-react";

import { useMessages } from "../../../hooks/useMessages";
import AttachmentPreview from "./AttachmentPreview";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_ATTACHMENTS = 5;
const MAX_MESSAGE_LENGTH = 5000;

const ALLOWED_FILES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
  "text/plain": [".txt"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    [".docx"],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    [".xlsx"],
};

const ACCEPTED_TYPES = Object.entries(ALLOWED_FILES)
  .flatMap(([type, extensions]) => [type, ...extensions])
  .join(",");

const translations = {
  en: {
    placeholder: "Write your message...",
    attach: "Attach files",
    send: "Send message",
    noConversation: "Select a conversation to send a message.",
    tooLarge: "Files must not exceed 10 MB each.",
    empty: "Empty files cannot be attached.",
    tooMany: "You can attach up to 5 files.",
    unsupported: "This file format is not supported.",
    duplicate: "This file has already been selected.",
    tooLong: "Messages cannot exceed 5,000 characters.",
    sendFailed: "Unable to send your message.",
    attachmentFailed: "Unable to read the selected file.",
  },
  ar: {
    placeholder: "اكتب رسالتك...",
    attach: "إرفاق ملفات",
    send: "إرسال الرسالة",
    noConversation: "اختر محادثة لإرسال رسالة.",
    tooLarge: "يجب ألا يتجاوز حجم الملف 10 ميجابايت.",
    empty: "لا يمكن إرفاق الملفات الفارغة.",
    tooMany: "يمكنك إرفاق 5 ملفات كحد أقصى.",
    unsupported: "صيغة الملف غير مدعومة.",
    duplicate: "تم اختيار هذا الملف مسبقًا.",
    tooLong: "يجب ألا تتجاوز الرسالة 5000 حرف.",
    sendFailed: "تعذر إرسال الرسالة.",
    attachmentFailed: "تعذر قراءة الملف المحدد.",
  },
};

function createAttachmentId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `attachment-${crypto.randomUUID()}`;
  }

  return `attachment-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function isAllowedFile(file) {
  const extensions = ALLOWED_FILES[file.type];

  if (!extensions) return false;

  return extensions.some((extension) =>
    file.name.toLowerCase().endsWith(extension)
  );
}

function isDuplicate(existing, file) {
  return existing.some(
    (attachment) =>
      attachment.name === file.name &&
      attachment.size === file.size &&
      attachment.type === file.type &&
      attachment.file?.lastModified === file.lastModified
  );
}

export default function MessageComposer({
  language = "en",
}) {
  const {
    activeConversation,
    sendMessage,
  } = useMessages();

  const currentLanguage =
    language === "ar" ? "ar" : "en";

  const t = translations[currentLanguage];

  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const hasContent =
    message.trim().length > 0 ||
    attachments.length > 0;

  const canSend =
    Boolean(activeConversation) &&
    hasContent &&
    message.length <= MAX_MESSAGE_LENGTH &&
    !isSending;

  function handleFileSelection(event) {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    setError("");

    const accepted = [...attachments];
    let validationError = "";

    for (const file of files) {
      if (accepted.length >= MAX_ATTACHMENTS) {
        validationError ||= t.tooMany;
        break;
      }

      if (!isAllowedFile(file)) {
        validationError ||= t.unsupported;
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        validationError ||= t.tooLarge;
        continue;
      }

      if (file.size === 0) {
        validationError ||= t.empty;
        continue;
      }

      if (isDuplicate(accepted, file)) {
        validationError ||= t.duplicate;
        continue;
      }

      accepted.push({
        id: createAttachmentId(),
        name: file.name,
        size: file.size,
        type: file.type,
        file,
      });
    }

    setAttachments(accepted);
    setError(validationError);

    // Allow selecting the same file again after removal.
    event.target.value = "";
  }

  function removeAttachment(attachmentId) {
    setAttachments((previous) =>
      previous.filter(
        (attachment) => attachment.id !== attachmentId
      )
    );

    setError("");
  }

  function handleSend(event) {
    event?.preventDefault();

    if (!canSend) return;

    if (message.length > MAX_MESSAGE_LENGTH) {
      setError(t.tooLong);
      return;
    }

    setIsSending(true);
    setError("");

    try {
      // MessagesContext stores serializable metadata only.
      const attachmentMetadata = attachments.map(
        ({ name, size, type }) => ({
          name,
          size,
          type,
        })
      );

      const result = sendMessage(
        message.trim(),
        attachmentMetadata
      );

      if (!result) {
        setError(t.sendFailed);
        return;
      }

      setMessage("");
      setAttachments([]);

      textareaRef.current?.focus();
    } catch (sendError) {
      console.error("Message send failed:", sendError);
      setError(t.sendFailed);
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(event) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <form
      className="message-composer"
      onSubmit={handleSend}
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
    >
      {attachments.length > 0 && (
        <div className="message-composer__attachments">
          <AttachmentPreview
            attachments={attachments}
            onRemove={removeAttachment}
            language={currentLanguage}
            variant="composer"
          />
        </div>
      )}

      {error && (
        <div
          className="message-composer__error"
          role="alert"
        >
          <AlertCircle size={16} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <div className="message-composer__controls">
        <input
          ref={fileInputRef}
          type="file"
          className="message-composer__file-input"
          accept={ACCEPTED_TYPES}
          multiple
          disabled={!activeConversation || isSending}
          onChange={handleFileSelection}
          aria-label={t.attach}
        />

        <button
          type="button"
          className="message-composer__attach"
          onClick={() => fileInputRef.current?.click()}
          disabled={!activeConversation || isSending}
          title={t.attach}
          aria-label={t.attach}
        >
          <Paperclip size={19} aria-hidden="true" />
        </button>

        <textarea
          ref={textareaRef}
          className="message-composer__input"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            if (error) setError("");
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            activeConversation
              ? t.placeholder
              : t.noConversation
          }
          aria-label={t.placeholder}
          rows={1}
          maxLength={MAX_MESSAGE_LENGTH}
          disabled={!activeConversation || isSending}
        />

        <button
          type="submit"
          className="message-composer__send"
          disabled={!canSend}
          title={t.send}
          aria-label={t.send}
        >
          <Send size={18} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
