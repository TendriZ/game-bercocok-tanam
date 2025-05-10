import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const TILE_SIZE = 40;
const MAP_WIDTH = 10;
const MAP_HEIGHT = 6;

const initialMap = Array(MAP_HEIGHT)
  .fill(null)
  .map(() =>
    Array(MAP_WIDTH).fill({ type: "grass", growth: 0 })
  );

export default function FarmingGame() {
  const [map, setMap] = useState(initialMap);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [day, setDay] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      setPlayerPos((prev) => {
        let { x, y } = prev;
        if (e.key === "ArrowUp" && y > 0) y--;
        else if (e.key === "ArrowDown" && y < MAP_HEIGHT - 1) y++;
        else if (e.key === "ArrowLeft" && x > 0) x--;
        else if (e.key === "ArrowRight" && x < MAP_WIDTH - 1) x++;
        return { x, y };
      });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const plantCrop = () => {
    const newMap = map.map((row, y) =>
      row.map((tile, x) => {
        if (x === playerPos.x && y === playerPos.y && tile.type === "grass") {
          return { type: "crop", growth: 1 };
        }
        return tile;
      })
    );
    setMap(newMap);
  };

  const advanceDay = () => {
    const newMap = map.map((row) =>
      row.map((tile) => {
        if (tile.type === "crop") {
          if (tile.growth < 3) {
            return { ...tile, growth: tile.growth + 1 };
          } else {
            return { type: "readyToHarvest", growth: 0 };
          }
        }
        return tile;
      })
    );
    setMap(newMap);
    setDay((d) => d + 1);
  };

  const harvestCrop = () => {
    const newMap = map.map((row, y) =>
      row.map((tile, x) => {
        if (x === playerPos.x && y === playerPos.y && tile.type === "readyToHarvest") {
          return { type: "grass", growth: 0 };
        }
        return tile;
      })
    );
    setMap(newMap);
  };

  return (
    <div className="p-4 space-y-4 max-w-[420px] mx-auto" style={{ userSelect: "none" }}>
      <h1 className="text-2xl font-bold text-center">🌾 Mini Farming RPG</h1>
      <p className="text-lg text-center">📅 Day {day}</p>
      <div
        className="grid mx-auto"
        style={{
          gridTemplateColumns: `repeat(${MAP_WIDTH}, ${TILE_SIZE}px)`,
          width: TILE_SIZE * MAP_WIDTH,
          height: TILE_SIZE * MAP_HEIGHT,
          border: "2px solid #ccc",
          borderRadius: 8,
          touchAction: "none",
        }}
      >
        {map.map((row, y) =>
          row.map((tile, x) => {
            const isPlayer = playerPos.x === x && playerPos.y === y;
            let bg = "bg-green-500";
            let content = "";
            if (tile.type === "crop") {
              bg = "bg-yellow-500";
              if (tile.growth === 1) content = "🌱";
              else if (tile.growth === 2) content = "🌿";
              else content = "🌾";
            }
            if (tile.type === "readyToHarvest") {
              bg = "bg-amber-600";
              content = "🌻";
            }
            if (isPlayer) {
              bg = "bg-blue-600 border-2 border-white";
              content = "👨‍🌾";
            }
            return (
              <div
                key={`${x}-${y}`}
                className={`${bg} w-10 h-10 flex items-center justify-center text-white select-none`}
                style={{ fontSize: "20px", lineHeight: "1" }}
              >
                {content}
              </div>
            );
          })
        )}
      </div>
      <div className="flex justify-center space-x-2">
        <Button onClick={plantCrop} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded">
          Tanam 🌱
        </Button>
        <Button onClick={advanceDay} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded">
          Lewati Hari ⏭️
        </Button>
        <Button onClick={harvestCrop} className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded">
          Panen 🌻
        </Button>
      </div>
      <p className="text-center text-sm text-gray-600 mt-2">
        Gunakan tombol panah untuk bergerak. Tanam di posisi pemain.
      </p>
    </div>
  );
}

