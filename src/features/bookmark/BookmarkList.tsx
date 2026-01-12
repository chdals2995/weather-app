// BookmarkList.tsx

import { useState } from "react";
import { getBookmarks, removeBookmark, updateBookmarkAlias } from "../bookmark/Bookmark";
import type { BookmarkItem } from "../bookmark/Bookmark";
import setting from "../../assets/icons/setting.png"

type BookmarkListProps = {
  onSelect: (city: string) => void;
};

export function mapWeatherMainToKorean(main: string): string {
  switch (main) {
    case "Clear":
      return "맑음";
    case "Clouds":
    case "Haze":
      return "흐림";
    case "Rain":
    case "Drizzle":
      return "비";
    case "Snow":
      return "눈";
    case "Thunderstorm":
      return "천둥번개";
    case "Mist":
    case "Fog":
      return "안개";
    default:
      return "알 수 없음";
  }
}

export default function BookmarkList({ onSelect }: BookmarkListProps) {
  const [editingCity, setEditingCity] = useState<string | null>(null);
  const [editAlias, setEditAlias] = useState("");
  const [openMenuCity, setOpenMenuCity] = useState<string | null>(null);

  const bookmarks: BookmarkItem[] = getBookmarks();

  if (bookmarks.length === 0) return <div className="p-4 text-gray-500">즐겨찾기가 없습니다.</div>;

  const handleEdit = (b: BookmarkItem) => {
    setEditingCity(b.city);
    setEditAlias(b.alias && b.alias !== b.city ? b.alias : "");
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
          onClick={() => {
            const fallbackLocation = b.location ?? b.city.replace(" ", "-");
            onSelect(fallbackLocation);
          }}
        >
            {/* 좌측 정보 */}
          <div
            className="cursor-pointer"
            onClick={() => {
              if (editingCity === b.city) return;
              const fallbackLocation = b.location ?? b.city.replace(" ", "-");
              onSelect(fallbackLocation);
            }}
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
                <p className="font-bold">
                  {b.alias && b.alias !== b.city ? b.alias : b.city}
                </p>

                <p className="text-sm text-gray-600">
                  {mapWeatherMainToKorean(b.weather)}
                </p>

                {b.alias && b.alias !== b.city && (
                  <p className="text-sm text-gray-500">{b.city}</p>
                )}
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
