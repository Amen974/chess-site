import Square from "./Square";
import PromotionModal from "./PromotionModal";
import { isLightSquare } from "../engine/validation/isLightSquare";
import GameResult from "./GameResult";
import GameSetup from "./GameSetup";
import { useGameControls } from "../hooks/useGameControls";

const Board = () => {
  const {
    legalMoves,
    selectedSquare,
    fenInput,
    setFenInput,
    setIsFlipped,
    showResult,
    setShowResult,
    lastMove,
    isNewGame,
    showSetup,
    setShowSetup,
    renderRanks,
    renderFiles,
    state,
    dispatch,
    history,
    promotion,
    displayBoard,
    handleDragStart,
    handleOnDrop,
    handleSquareClick,
    handleImportFEN,
    handleCopyFEN,
    handleStart,
    jumpToPosition,
    aniHuman,
    robotRef,
    sanRefMobile,
    sanRefDesktop,
    handleToggleAi,
  } = useGameControls();

  /* ================= RENDER ================= */

  return (
    <div className="flex justify-center items-center h-screen w-screen overflow-hidden">
      {showSetup && (
        <GameSetup
          onStart={handleStart}
          handelClose={() => setShowSetup(false)}
        />
      )}

      {showResult && (
        <GameResult
          gameResult={state.gameResult}
          handelClose={() => setShowResult(false)}
          onNewGame={() => {
            (dispatch({ type: "RESET" }), setShowSetup(true));
          }}
        />
      )}
      <div className="flex flex-wrap gap-2 justify-center items-center lg:items-end">
        <div className="flex-col relative">
          <div className="flex h-8 md:h-12 pl-1 mb-0. relative">
            <div
              onClick={handleToggleAi}
              className="flex items-center justify-center h-full w-8 md:w-12 bg-grey-color rounded-full border-3 border-blue-700 cursor-pointer"
            >
              <img src="SVG/ai-blue.svg" alt="ai" ref={robotRef} />
            </div>

            <img
              src="SVG/gear.svg"
              alt="gear"
              className="absolute right-1 bottom-1 cursor-pointer"
              onClick={() => {
                dispatch({ type: "RESET" });
                setShowSetup(true);
              }}
            />
          </div>

          <div className="grid grid-cols-8 border-4 border-grey-color rounded-2xl overflow-hidden">
            {renderRanks.map((rank) =>
              renderFiles.map((file) => {
                const squareId = file + rank;
                const light = isLightSquare(squareId);

                return (
                  <Square
                    key={squareId}
                    id={squareId}
                    color={light ? "blackSquare" : "whiteSquare"}
                    piece={displayBoard[squareId]}
                    onClick={handleSquareClick}
                    onDragStart={handleDragStart}
                    onDrop={handleOnDrop}
                    isSelected={squareId === selectedSquare}
                    isLegalMove={legalMoves.includes(squareId)}
                    isLastMove={
                      squareId === lastMove.from || squareId === lastMove.to
                    }
                    isNewGame={isNewGame}
                  />
                );
              }),
            )}
          </div>
          <div
            onClick={aniHuman}
            className="flex items-center justify-center absolute right-1 h-8 w-8 md:h-12 md:w-12 bg-grey-color rounded-full border-3 border-blue-700 cursor-pointer"
          >
            <img src="SVG/human.svg" alt="human" id="human" />
          </div>
        </div>

        {promotion && (
          <PromotionModal
            color={promotion.color}
            onSelect={(type) =>
              dispatch({
                type: "PROMOTE",
                square: promotion.square,
                piece: type,
                color: promotion.color,
              })
            }
          />
        )}

        <div className="flex flex-col gap-2">
          <div
            className="flex lg:hidden max-w-70 text-slate-400 whitespace-nowrap overflow-x-auto no-scrollbar"
            ref={sanRefMobile}
          >
            {history.map((move, index) => {
              const moveNumber = Math.floor(index / 2) + 1;
              const isWhite = index % 2 === 0;
              return (
                <div key={index} className="flex items-center">
                  {isWhite && (
                    <span className="text-slate-400 w-6 text-right">
                      {moveNumber}.
                    </span>
                  )}
                  <button
                    onClick={() => jumpToPosition(index)}
                    className="text-white mr-4"
                  >
                    {move.san}
                  </button>
                </div>
              );
            })}
          </div>

          <div
            className="hidden lg:block max-w-100 h-110 2xl:h-125 bg-[#1e232e] border border-slate-700 rounded-lg overflow-y-auto no-scrollbar"
            ref={sanRefDesktop}
          >
            {Array.from({ length: Math.ceil(history.length / 2) }).map(
              (_, i) => {
                const whiteMove = history[i * 2];
                const blackMove = history[i * 2 + 1];
                return (
                  <div key={i} className="flex items-center gap-2 text-sm p-2">
                    <span className="text-slate-400 text-right mr-1">
                      {i + 1}.
                    </span>
                    {whiteMove && (
                      <div
                        onClick={() => jumpToPosition(i * 2)}
                        className="text-white flex-1 hover:bg-[#101622] hover:text-blue-700 rounded-lg p-2 cursor-pointer"
                      >
                        {whiteMove.san}
                      </div>
                    )}
                    {blackMove && (
                      <div
                        onClick={() => jumpToPosition(i * 2 + 1)}
                        className="text-white flex-1 hover:bg-[#101622] hover:text-blue-700 rounded-lg p-2 cursor-pointer"
                      >
                        {blackMove.san}
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>

          <div className="w-full flex justify-center gap-1">
            <button
              onClick={() => dispatch({ type: "UNDO" })}
              disabled={!!state.gameResult}
              className="button-style transition-all active:scale-95 shadow-sm"
            >
              <img src="/SVG/undo.svg" alt="Undo" className="w-5 h-5" />
              <span className="text-xs font-bold uppercase">UNDO</span>
            </button>

            <button
              onClick={() => dispatch({ type: "REDO" })}
              disabled={!!state.gameResult}
              className="button-style transition-all active:scale-95 shadow-sm"
            >
              <img src="/SVG/redo.svg" alt="Redo" className="w-5 h-5" />
              <span className="text-xs font-bold uppercase">REDO</span>
            </button>

            <button
              onClick={() => dispatch({ type: "resign" })}
              className="button-style transition-all active:scale-95 shadow-sm"
            >
              <img src="/SVG/resign.svg" alt="Resign" className="w-5 h-5" />
              <span className="text-xs font-bold uppercase">RESIGN</span>
            </button>

            <button
              onClick={() => {
                setIsFlipped((f) => !f);
                dispatch({ type: "FLIP_BOARD" });
              }}
              className="button-style transition-all active:scale-95 shadow-sm"
            >
              <img src="/SVG/flip.svg" alt="Flip" className="w-5 h-5" />
              <span className="text-xs font-bold uppercase">FLIP</span>
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-lg bg-[#1e232e] border border-slate-700 shadow-sm">
            <div className="flex-1 relative">
              <img
                src="/SVG/input.svg"
                alt="Input"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 sm:w-4 h-3 sm:h-4 text-slate-400"
              />
              <input
                className="w-full pl-7 sm:pl-8 pr-2 sm:pr-3 py-1 sm:py-1.5 text-xs rounded border border-slate-700 bg-[#111318] text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
                value={fenInput}
                onChange={(e) => setFenInput(e.target.value)}
                placeholder="Import FEN..."
                onKeyDown={(e) => e.key === "Enter" && handleImportFEN()}
                disabled={!!state.gameResult}
              />
            </div>
            <button
              className="flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded bg-[#282e39] text-xs font-semibold text-slate-300 hover:bg-[#343a46] transition-colors border border-slate-600 cursor-pointer"
              onClick={handleCopyFEN}
            >
              <img
                src="/SVG/copy.svg"
                alt="Copy"
                className="w-3.5 sm:w-4 h-3.5 sm:h-4"
              />
              Export FEN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
