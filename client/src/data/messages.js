export const initialConversations = [
  {
    id: "conversation-001",
    participant: {
      id: "instructor-001",
      name: "Nora Alharbi",
      nameAr: "نورة الحربي",
      role: "instructor",
      avatar: null,
    },
    course: {
      id: "course-001",
      title: "UI/UX Design Foundations",
      titleAr: "أساسيات تصميم واجهات وتجربة المستخدم",
    },
    unreadCount: 1,
    updatedAt: "2026-11-25T10:30:00Z",
    messages: [
      {
        id: "message-001",
        senderId: "instructor-001",
        type: "text",
        content: "Welcome to the course!",
        createdAt: "2026-11-25T10:30:00Z",
        read: false,
      },
    ],
  },
];

export const CURRENT_STUDENT_ID = "student";

export const messageParticipants = [
  {
    id: "instructor-001",
    name: "Nora Alharbi",
    nameAr: "نورة الحربي",
    role: "instructor",
    avatar: null,
    online: true,
  },
  {
    id: "support-001",
    name: "BEHAR Support",
    nameAr: "دعم BEHAR",
    role: "support",
    avatar: null,
    online: true,
  },
];

export function getParticipantById(participantId) {
  for (const conversation of initialConversations) {
    if (conversation.participant?.id === participantId) {
      return conversation.participant;
    }
  }

  return null;
}

export function getUnreadCount(conversation) {
  if (!conversation || !Array.isArray(conversation.messages)) return 0;
  return conversation.messages.filter(
    (message) => !message.read && message.senderId !== CURRENT_STUDENT_ID
  ).length;
}

export function getLastMessage(conversation) {
  if (!conversation || !Array.isArray(conversation.messages)) return null;
  return conversation.messages.at(-1) || null;
}
