
const Square = ({ piece, color, id, onDrop, onDragStart }) => {
  return (
    <div
      className={`flex justify-center items-center w-20 h-20 ${color}`}
      id={id}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(id)}
    >
      {piece && (
        <img
          src={piece.img}
          alt=""
          draggable
          onDragStart={() => onDragStart(id)}
          className="cursor-grab w-16 h-16"
        />
      )}
    </div>
  );
};

export default Square;
