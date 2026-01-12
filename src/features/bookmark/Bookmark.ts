// Bookmark.ts

export type BookmarkItem = {
  city: string;
  alias?: string;
  lat: number;
  lon: number;
  temp: number;
  tempMin: number;
  tempMax: number;
  weather: string;
};

// 로컬스토리지 키
const STORAGE_KEY = "bookmarks";

// 내부 배열
let bookmarks: BookmarkItem[] = [];

// 앱 시작 시 로컬스토리지에서 자동 불러오기
function initBookmarks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      bookmarks = JSON.parse(saved) as BookmarkItem[];
    } catch {
      bookmarks = [];
    }
  }
}

// 초기화
initBookmarks();

// 전체 즐겨찾기 반환
export function getBookmarks(): BookmarkItem[] {
  return bookmarks;
}

// 특정 도시가 즐겨찾기인지 확인
export function isBookmarked(city: string): boolean {
  return bookmarks.some(b => b.city === city);
}

// 즐겨찾기 추가
export function addBookmark(item: BookmarkItem) {
  if (!isBookmarked(item.city)) {
    bookmarks.push(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }
}

// 별칭 수정
export function updateBookmarkAlias(city: string, alias: string) {
  bookmarks = bookmarks.map(b =>
    b.city === city ? { ...b, alias } : b
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

// 즐겨찾기 삭제
export function removeBookmark(city: string) {
  bookmarks = bookmarks.filter(b => b.city !== city);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

// 즐겨찾기 토글
export function toggleBookmark(item: BookmarkItem) {
  if (isBookmarked(item.city)) {
    removeBookmark(item.city);
  } else {
    addBookmark(item);
  }
}