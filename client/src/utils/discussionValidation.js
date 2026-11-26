
export const DISCUSSION_LIMITS = {
  titleMin: 10,
  titleMax: 120,
  bodyMin: 30,
  bodyMax: 3000,
  maxTags: 5,
  maxTagLength: 24,
};

const messages = {
  en: {
    course: "Please select a course.",
    titleRequired: "Discussion title is required.",
    titleMin: "Title must contain at least 10 characters.",
    titleMax: "Title cannot exceed 120 characters.",
    bodyRequired: "Please describe your discussion.",
    bodyMin: "Description must contain at least 30 characters.",
    bodyMax: "Description cannot exceed 3000 characters.",
    tags: "You can add up to 5 tags.",
    tagLength: "Each tag must be 24 characters or fewer.",
  },
  ar: {
    course: "يرجى اختيار الدورة.",
    titleRequired: "عنوان المناقشة مطلوب.",
    titleMin: "يجب أن يحتوي العنوان على 10 أحرف على الأقل.",
    titleMax: "لا يمكن أن يتجاوز العنوان 120 حرفًا.",
    bodyRequired: "يرجى كتابة وصف للمناقشة.",
    bodyMin: "يجب أن يحتوي الوصف على 30 حرفًا على الأقل.",
    bodyMax: "لا يمكن أن يتجاوز الوصف 3000 حرف.",
    tags: "يمكنك إضافة 5 وسوم كحد أقصى.",
    tagLength: "يجب ألا يتجاوز كل وسم 24 حرفًا.",
  },
};

export function parseDiscussionTags(value) {
  return [...new Set(
    value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
  )];
}

export function validateDiscussion(
  values,
  language = "en"
) {
  const t = messages[language] ?? messages.en;
  const errors = {};

  const title = values.title.trim();
  const body = values.body.trim();
  const tags = parseDiscussionTags(values.tags);

  if (!values.courseId) {
    errors.courseId = t.course;
  }

  if (!title) {
    errors.title = t.titleRequired;
  } else if (title.length < DISCUSSION_LIMITS.titleMin) {
    errors.title = t.titleMin;
  } else if (title.length > DISCUSSION_LIMITS.titleMax) {
    errors.title = t.titleMax;
  }

  if (!body) {
    errors.body = t.bodyRequired;
  } else if (body.length < DISCUSSION_LIMITS.bodyMin) {
    errors.body = t.bodyMin;
  } else if (body.length > DISCUSSION_LIMITS.bodyMax) {
    errors.body = t.bodyMax;
  }

  if (tags.length > DISCUSSION_LIMITS.maxTags) {
    errors.tags = t.tags;
  } else if (
    tags.some(
      (tag) =>
        tag.length > DISCUSSION_LIMITS.maxTagLength
    )
  ) {
    errors.tags = t.tagLength;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    normalized: {
      courseId: values.courseId,
      title,
      body,
      tags,
    },
  };
}
