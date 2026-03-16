import { useState, useEffect, useRef, useReducer } from "react";
import { exportFEN } from "../engine/exportFEN";
import { gameReducer } from "../engine/game/gameReducer";
import { initialGameState } from "../engine/game/initialGameState";
import { files, ranks } from "../constant";
import { isLegalMove } from "../engine/validation/isLegalMove";
import { applyPlayerMove } from "../engine/applyPlayerMove";
import { playAIMove } from "../engine/playAIMove";
import gsap from "gsap";

export function useGameControls() {
  const [dragFrom, setDragFrom] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [fenInput, setFenInput] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [viewingIndex, setViewingIndex] = useState(-1);
  const [lastMove, setLastMove] = useState({});
  const [isNewGame, setIsNewGame] = useState(true);
  const [stopAi, setStopAi] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [aiDepth, setAiDepth] = useState(12);

  const renderRanks = isFlipped ? [...ranks].reverse() : ranks;
  const renderFiles = isFlipped ? [...files].reverse() : files;

  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const { board, turn, aiTurn, enPassantSquare, history, promotion } = state;

  const fen = exportFEN(state);

  const displayBoard =
    viewingIndex >= 0 && viewingIndex < history.length
      ? history[viewingIndex].board
      : board;

  const isBrowsing = viewingIndex >= 0 && viewingIndex < history.length - 1;

  /* ================= REQUEST MOVE ================= */

  async function requestMove({ from, to, animate = false }) {
    setViewingIndex(-1);
    setSelectedSquare(null);
    setLegalMoves([]);
    setDragFrom(null);
    setLastMove({});

    if (state.gameResult) return;
    if (turn === aiTurn && !stopAi) return;

    const result = applyPlayerMove({ from, to, state });
    if (!result) return;

    const piece = state.board[from];
    if (animate) await animateMove(from, to, piece);

    dispatch({ type: "COMMIT_MOVE", result });
    setLastMove({ from, to });
    setIsNewGame(false);

    if (result.gameResult) return;
    if (stopAi) return;

    if (result.turn === aiTurn) {
      startSpin();
      const aiResult = await playAIMove(result, aiDepth);
      stopSpin();
      const piece = result.board[aiResult.move.from];
      await animateMove(aiResult.move.from, aiResult.move.to, piece);
      dispatch({ type: "COMMIT_MOVE", result: aiResult });
      if (aiResult)
        setLastMove({ from: aiResult.move.from, to: aiResult.move.to });
      return;
    }
  }

  /* ================= AI FIRST MOVE ================= */

  useEffect(() => {
    if (history.length !== 0) return;
    if (turn !== aiTurn) return;
    if (stopAi) return;

    playAIMove(state, aiDepth).then((result) => {
      if (result) dispatch({ type: "COMMIT_MOVE", result });
      setIsNewGame(false);
    });
  }, [aiTurn]);

  /* ================= GAME RESULT TIMEOUT ================= */

  useEffect(() => {
    if (!state.gameResult) {
      return;
    }
    const timer = setTimeout(() => setShowResult(true), 500);
    return () => clearTimeout(timer);
  }, [state.gameResult]);

  /* ================= DRAG ================= */

  const handleDragStart = (from) => {
    if (isBrowsing) return;
    if (turn === aiTurn && !stopAi) return;
    const piece = board[from];
    if (!piece || piece.color !== turn || promotion) return;
    setDragFrom(from);
    setLegalMoves(computeLegalMoves(from));
  };

  /* ================= DROP ================= */

  const handleOnDrop = (to) => {
    if (isBrowsing) return;
    if (!dragFrom) return;
    requestMove({ from: dragFrom, to });
  };

  /* ================= CLICK ================= */

  const handleSquareClick = (square) => {
    if (isBrowsing) return;
    if (promotion) return;
    if (turn === aiTurn && !stopAi) return;

    if (!selectedSquare) {
      const piece = board[square];
      if (!piece || piece.color !== turn) return;
      setSelectedSquare(square);
      pieceBounce(square);
      setLegalMoves(computeLegalMoves(square));
      return;
    }

    if (square === selectedSquare) {
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    const piece = board[square];
    if (piece && piece.color === turn) {
      setSelectedSquare(square);
      pieceBounce(square);
      setLegalMoves(computeLegalMoves(square));
      return;
    }

    requestMove({ from: selectedSquare, to: square, animate: true });
  };

  const computeLegalMoves = (from) => {
    const moves = [];
    for (const r of ranks) {
      for (const f of files) {
        const to = f + r;
        if (
          isLegalMove(
            from,
            to,
            board,
            turn,
            enPassantSquare,
            state.castlingRights,
          )
        ) {
          moves.push(to);
        }
      }
    }
    return moves;
  };

  /* ================= IMPORT FEN ================= */

  const handleImportFEN = () => {
    try {
      dispatch({ type: "IMPORT_FEN", fen: fenInput });
      setFenInput("");
      setDragFrom(null);
      setSelectedSquare(null);
      setLegalMoves([]);
    } catch {
      alert("Invalid FEN");
    }
  };

  /* ================= EXPORT FEN ================= */

  const handleCopyFEN = async () => {
    try {
      await navigator.clipboard.writeText(fen);
      alert("FEN copied to clipboard");
    } catch {
      alert("Failed to copy FEN");
    }
  };

  const handleStart = ({ mode, difficulty, side }) => {
    const random = Math.random();
    const shouldFlip = side === "Black" || (side === "Random" && random > 0.5);

    setIsFlipped(shouldFlip);
    setStopAi(mode === "local");
    setAiDepth(difficulty);
    setShowSetup(false);
    dispatch({ type: "RESET", aiTurn: shouldFlip ? "white" : "black" });
  };

  /* ================= jumpToPosition ================= */

  const jumpToPosition = (i) => {
    setViewingIndex(i);
  };

  /* ================= AUTO SCROLL ================= */

  const sanRefMobile = useRef(null);
  const sanRefDesktop = useRef(null);

  useEffect(() => {
    const elMobile = sanRefMobile.current;
    if (elMobile) elMobile.scrollLeft = elMobile.scrollWidth;

    const elDesktop = sanRefDesktop.current;
    if (elDesktop) elDesktop.scrollTop = elDesktop.scrollHeight;
  }, [history.length]);

  /* ================= ANIMATION ================= */

  const robotRef = useRef(null);
  const spinRef = useRef(null);

  const startSpin = () => {
    spinRef.current = gsap.to(robotRef.current, {
      rotation: 360,
      repeat: -1,
      duration: 1,
      ease: "none",
      transformOrigin: "50% 50%",
    });
  };

  const stopSpin = () => {
    if (spinRef.current) {
      spinRef.current.kill();
      gsap.to(robotRef.current, { rotation: 0, duration: 0.3 });
    }
  };

  const animateMove = (from, to, piece) => {
    return new Promise((resolve) => {
      const rectFrom = document.getElementById(from).getBoundingClientRect();
      const rectTo = document.getElementById(to).getBoundingClientRect();

      const clone = document.createElement("img");
      clone.src = piece.img;
      clone.style.position = "fixed";
      clone.style.top = rectFrom.top + "px";
      clone.style.left = rectFrom.left + "px";
      clone.style.width = rectFrom.width + "px";
      clone.style.height = rectFrom.height + "px";
      document.body.appendChild(clone);

      const fromPieceEl = document.getElementById(from).querySelector("img");
      const toPieceEl = document.getElementById(to).querySelector("img");
      if (fromPieceEl) fromPieceEl.style.opacity = "0";
      if (toPieceEl) toPieceEl.style.opacity = "0";

      gsap.to(clone, {
        left: rectTo.left,
        top: rectTo.top,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          clone.remove();
          const toEl = document.getElementById(to).querySelector("img");
          if (toEl) toEl.style.opacity = "1";
          resolve();
        },
      });
    });
  };

  const pieceBounce = (square) => {
    const el = document.getElementById(square).querySelector("img");
    gsap.to(el, {
      scale: 0.85,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });
  };

  useEffect(() => {
    if (stopAi) {
      gsap.to(robotRef.current, {
        y: -40,
        duration: 0.3,
        opacity: 0,
        ease: "power2.in",
      });
    } else {
      gsap.to(robotRef.current, {
        y: 0,
        duration: 0.3,
        opacity: 1,
        ease: "power2.out",
      });
    }
  }, [stopAi]);

  const aniHuman = () => {
    gsap.to("#human", {
      scale: 0.85,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });
  };

  const handleToggleAi = () => {
    setStopAi((prev) => {
      if (prev === true && turn === aiTurn) {
        playAIMove(state, aiDepth).then((result) => {
          if (result) dispatch({ type: "COMMIT_MOVE", result });
        });
      }
      return !prev;
    });
  };

  return {
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
  };
}
