export const toggleStoryBookmark = async (
  storyId: string,
  currentlySaved: boolean,
) => {
  const method = currentlySaved ? "DELETE" : "POST";

  const res = await fetch(`/api/stories/${storyId}/bookmark`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    let msg = `Не вдалося ${
      currentlySaved ? "видалити зі" : "додати до"
    } збережених`;
    try {
      const body = await res.json();
      msg = body?.message || msg;
    } catch {
      /* ігноруємо? */
    }
    throw new Error(msg);
  }

  try {
    const data = await res.json();
    return {
      saved: !currentlySaved,
      bookmarks:
        typeof data?.data?.bookmarks === "number"
          ? data.data.bookmarks
          : undefined,
    };
  } catch {
    return { saved: !currentlySaved, bookmarks: undefined };
  }
};