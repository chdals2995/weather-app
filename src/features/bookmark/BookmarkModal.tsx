import { useState } from "react";

type BookmarkModalProps = {
  initialName: string;           // 기본 위치 이름
  onClose: () => void;           // 모달 닫기
  onSave: (alias: string) => void; // 저장
};

export default function BookmarkModal({ initialName, onClose, onSave }: BookmarkModalProps) {
  const [alias, setAlias] = useState(initialName);

  const handleSave = () => {
    onSave(alias.trim() || initialName); // 빈 문자열이면 기본 이름
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">즐겨찾기 저장</h2>
        <input
          type="text"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">취소</button>
          <button onClick={handleSave} className="px-3 py-1 bg-blue-500 text-white rounded">저장</button>
        </div>
      </div>
    </div>
  );
}
