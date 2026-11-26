import { MessageCircle, UserRound } from "lucide-react";
import { useMessages } from "../../../hooks/useMessages";
import { useStudentLanguage } from "../../../context/StudentLanguageContext";
import ConversationList from "./ConversationList";
import ConversationHeader from "./ConversationHeader";
import ConversationInfo from "./ConversationInfo";
import MessageTimeline from "./MessageTimeline";
import MessageComposer from "./MessageComposer";
import NewConversationModal from "./NewConversationModal";

const copy = { en: { eyebrow: "BEHAR / STUDENT", title: "Messages", description: "Stay connected with your instructors and support team.", newMessage: "New message", select: "Select a conversation", empty: "Choose a conversation from your inbox to continue." }, ar: { eyebrow: "BEHAR / الطالب", title: "الرسائل", description: "ابقَ على تواصل مع المدربين وفريق الدعم.", newMessage: "رسالة جديدة", select: "اختر محادثة", empty: "اختر محادثة من صندوق الوارد للمتابعة." } };

export default function MessagesLayout({ language: languageProp }) {
  const { language: contextLanguage } = useStudentLanguage();
  const language = languageProp === "ar" || languageProp === "en" ? languageProp : contextLanguage;
  const t = copy[language];
  const { activeConversation, selectConversation, setIsNewConversationOpen } = useMessages();
  const listCopy = { conversations: language === "ar" ? "المحادثات" : "Conversations", unreadCount: language === "ar" ? "غير مقروءة" : "unread", all: language === "ar" ? "الكل" : "All", unread: language === "ar" ? "غير المقروءة" : "Unread", instructors: language === "ar" ? "المدربون" : "Instructors", support: language === "ar" ? "الدعم" : "Support", search: language === "ar" ? "ابحث في المحادثات..." : "Search conversations...", noMessages: language === "ar" ? "لا توجد محادثات" : "No conversations found" };
  return <section className="messages-page" dir={language === "ar" ? "rtl" : "ltr"} lang={language}>
    <header className="messages-page__heading"><div className="messages-page__heading-content"><div className="messages-page__eyebrow"><MessageCircle size={15} /><span>{t.eyebrow}</span></div><h1>{t.title}</h1><p>{t.description}</p></div><button type="button" className="messages-page__new-button" onClick={() => setIsNewConversationOpen(true)}><MessageCircle size={18} /><span>{t.newMessage}</span></button></header>
    <div className={`messages-layout ${activeConversation ? "messages-layout--conversation-open" : "messages-layout--list-open"}`}><aside className="messages-layout__sidebar"><ConversationList language={language} copy={listCopy} /></aside><main className="messages-layout__conversation">{activeConversation ? <><ConversationHeader conversation={activeConversation} language={language} onBack={() => selectConversation(null)} /><MessageTimeline conversation={activeConversation} language={language} /><MessageComposer language={language} /></> : <div className="messages-layout__empty"><div className="messages-layout__empty-icon"><UserRound size={32} /></div><h2>{t.select}</h2><p>{t.empty}</p></div>}</main></div>
    <ConversationInfo conversation={activeConversation} language={language} />
    <NewConversationModal language={language} />
  </section>;
}
