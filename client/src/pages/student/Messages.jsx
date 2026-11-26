import MessagesLayout from "../../components/student/messages/MessagesLayout";
import { MessagesProvider } from "../../context/MessagesContext";

import "../../styles/student/messages/messages.css";
import "../../styles/student/messages/message-composer.css";
import "../../styles/student/messages/message-modal.css";
import "../../styles/student/messages/conversation-list.css";
import "../../styles/student/messages/conversation-detail.css";
import "../../styles/student/messages/messages-responsive.css";

export default function Messages({ language }) {
  return (
    <MessagesProvider>
      <MessagesLayout language={language} />
    </MessagesProvider>
  );
}
