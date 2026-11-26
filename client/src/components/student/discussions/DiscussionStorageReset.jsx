import { useState } from "react";
import { RotateCcw } from "lucide-react";

import { useDiscussions } from "../../../context/DiscussionsContext";
import "../../../styles/student/discussions/discussion-storage.css";

const copy = {
  en: { trigger: "Reset demo discussions", warning: "This removes locally saved discussions, replies, votes, bookmarks, and solved-status changes.", cancel: "Cancel", confirm: "Confirm reset" },
  ar: { trigger: "إعادة ضبط المناقشات التجريبية", warning: "سيؤدي هذا إلى حذف المناقشات والردود والتصويتات والحفظ والتغييرات المحلية.", cancel: "إلغاء", confirm: "تأكيد إعادة الضبط" },
};

export default function DiscussionStorageReset({ language = "en" }) {
  const [confirming, setConfirming] = useState(false);
  const { resetDiscussions } = useDiscussions();
  const t = copy[language] ?? copy.en;
  const direction = language === "ar" ? "rtl" : "ltr";

  if (confirming) return (
    <div className="behar-discussion-storage-reset" dir={direction}>
      <div className="behar-discussion-reset-confirmation" role="alert">
        <p>{t.warning}</p>
        <div>
          <button type="button" onClick={() => setConfirming(false)}>{t.cancel}</button>
          <button type="button" className="is-danger" onClick={() => { resetDiscussions(); setConfirming(false); }}>{t.confirm}</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="behar-discussion-storage-reset" dir={direction}>
      <button type="button" className="behar-discussion-reset-trigger" onClick={() => setConfirming(true)}>
        <RotateCcw size={15} aria-hidden="true" />
        {t.trigger}
      </button>
    </div>
  );
}
