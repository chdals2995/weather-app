import bookmark from "../../assets/icons/bookmark.png";
import fillMark from "../../assets/icons/fill_bookmark.png";

type BookmarkButtonProps = {
  city: string;
  bookmarked: boolean;
  onClick?: () => void;
};

export default function BookmarkButton({
  bookmarked,
  onClick,
}: BookmarkButtonProps) {
  const icon = bookmarked ? fillMark : bookmark;

  return (
    <button onClick={onClick}>
      <img
        src={icon}
        alt={bookmarked ? "즐겨찾기 해제" : "즐겨찾기 등록"}
        style={{ width: 24, height: 24 }}
      />
    </button>
  );
}
