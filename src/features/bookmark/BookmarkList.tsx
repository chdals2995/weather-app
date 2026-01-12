// BookmarkList.tsx

import { useState } from "react";
import { getBookmarks, removeBookmark, updateBookmarkAlias } from "../bookmark/Bookmark";
import type { BookmarkItem } from "../bookmark/Bookmark";
import setting from "../../assets/icons/setting.png"

type BookmarkListProps = {
  onSelect: (city: string) => void;
};

export default function BookmarkList({ onSelect }: BookmarkListProps) {
  const [editingCity, setEditingCity] = useState<string | null>(null);
  const [editAlias, setEditAlias] = useState("");
  const [openMenuCity, setOpenMenuCity] = useState<string | null>(null);

  const bookmarks: BookmarkItem[] = getBookmarks();

  if (bookmarks.length === 0) return <div className="p-4 text-gray-500">즐겨찾기가 없습니다.</div>;

  const handleEdit = (b: BookmarkItem) => {
    setEditingCity(b.city);
    setEditAlias(b.alias || b.city);
    setOpenMenuCity(null);
  };

  const handleSave = (city: string) => {
    updateBookmarkAlias(city, editAlias.trim());
    setEditingCity(null);
  };

  const handleDelete = (city: string) => {
    removeBookmark(city);
    setOpenMenuCity(null);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {bookmarks.map((b) => (
        <div
          key={b.city}
          className="p-4 border rounded shadow cursor-pointer hover:bg-gray-100 flex justify-between items-center"
          onClick={() => onSelect(b.city)}
        >
            {/* 좌측 정보 */}
          <div
            className="cursor-pointer"
            onClick={() => editingCity !== b.city && onSelect(b.city)}
          >
            {editingCity === b.city ? (
              <input
                value={editAlias}
                onChange={(e) => setEditAlias(e.target.value)}
                onBlur={() => handleSave(b.city)}
                onKeyDown={(e) => e.key === "Enter" && handleSave(b.city)}
                className="border px-2 py-1 rounded w-full"
                autoFocus
              />
            ) : (
              <>
                <p className="font-bold">{b.alias}</p>
                <p className="text-sm text-gray-600">{b.weather}</p>
                <p className="text-sm">{b.city}</p>
              </>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm">{b.temp}°C</p>
            <p className="text-sm">{b.tempMin - 2}°C / {b.tempMax + 2}°C</p>
          </div>
          {/* 우측 메뉴 */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuCity(openMenuCity === b.city ? null : b.city);
              }}
              className="border w-8 h-8"
            >
              <img src={setting} alt="설정" 
              className="w-5"/>
            </button>

            {openMenuCity === b.city && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow z-10">
                <button
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(b);}}
                >
                  수정
                </button>
                <button
                  className="block px-4 py-2 hover:bg-red-100 text-red-500 w-full text-left"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(b.city);
                  }}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
