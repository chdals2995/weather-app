// BookmarkList.tsx

import { getBookmarks } from "../bookmark/Bookmark";
import type { BookmarkItem } from "../bookmark/Bookmark";

type BookmarkListProps = {
  onSelect: (city: string) => void;
};

export default function BookmarkList({ onSelect }: BookmarkListProps) {
  const bookmarks: BookmarkItem[] = getBookmarks();

  if (bookmarks.length === 0) return <div className="p-4 text-gray-500">즐겨찾기가 없습니다.</div>;

  return (
    <div className="grid grid-cols-1 gap-4">
      {bookmarks.map((b) => (
        <div
          key={b.city}
          className="p-4 border rounded shadow cursor-pointer hover:bg-gray-100 flex justify-between items-center"
          onClick={() => onSelect(b.city)}
        >
          <div>
            <div>
              <p className="font-bold">{b.alias}</p>
              <p className="text-sm text-gray-600">{b.weather}</p>
            </div>
            <p className="">{b.city}</p>
          </div>
          <div className="text-right">
            <p className="text-sm">{b.temp}°C</p>
            <p className="text-sm">{b.tempMin - 2}°C / {b.tempMax + 2}°C</p>
          </div>
        </div>
      ))}
    </div>
  );
}
