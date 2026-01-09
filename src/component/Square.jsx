
const Square = ({ piece, color, id, onDrop, onDragStart, onClick, isSelected, isLegalMove, }) => {
  const isTouch = "ontouchstart" in window;
  return (
    <div
      className={`relative flex justify-center items-center
    w-10 h-10 md:h-15 md:w-15 2xl:h-18 2xl:w-18
    ${color}
    ${isSelected ? "" : ""}
  `}
      id={id}
      onClick={() => {onClick(id)}}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(id)}
    >
  {isLegalMove && !piece && (
    <div className="absolute w-3 h-3 md:w-5 md:h-5 rounded-full shadow-md opacity-80 bg-grey-color" />
  )}

  {isLegalMove && piece && (
    <div className="absolute inset-1 rounded-full border-2 md:border-4 piece-attack " />
  )}
      
      {piece && (
        <img
          src={piece.img}
          alt={piece.type}
          draggable = {!isTouch}
          onDragStart={() => onDragStart(id)}
          className="cursor-grab w-9 h-9 md:w-16 md:h-16 "
        />
      )}
    </div>
  );
};

export default Square;
