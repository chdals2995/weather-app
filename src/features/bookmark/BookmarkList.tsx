// BookmarkList.tsx

import { getBookmarks } from "../bookmark/Bookmark";

type BookmarkListProps = {
  onSelect: (city: string, lat: number, lon: number) => void;
};

export default function BookmarkList({ onSelect }: BookmarkListProps) {
  const bookmarks = getBookmarks();

  if (bookmarks.length === 0) return <div>즐겨찾기가 없습니다.</div>;

  return (
    <ul>
      {bookmarks.map(b => (
        <li key={b.city} onClick={() => onSelect(b.city, b.lat, b.lon)}>
          {b.city}
        </li>
      ))}
    </ul>
  );
}
