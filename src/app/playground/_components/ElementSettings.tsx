// import { SwatchBook } from "lucide-react";
// import {
// 	Select,
// 	SelectContent,
// 	SelectGroup,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from "@/components/ui/select";

// type Props = {
// 	selectedEl: HTMLElement;
// 	clearSelection: () => void;
// };

// const ElementSettings = ({ selectedEl, clearSelection }: Props) => {
//   const applyStyles = (property: string, value: string) => {
//     if (!selectedEl) return;
//     selectedEl.style[property as any] = value;
//   }
// 	return (
// 		<div className="w-96 shadow p-2">
// 			<h2 className="flex gap-2 items-center font-medium">
// 				<SwatchBook /> Settings
// 			</h2>
// 			<label htmlFor="" className="text-sm">
// 				Font Size
// 			</label>
// 			<Select defaultValue={selectedEl?.style?.fontSize || "24px"} onValueChange={(value) => applyStyles("fontSize",value)}>
// 				<SelectTrigger className="w-full">
// 					<SelectValue placeholder="Select font size" />
// 				</SelectTrigger>
// 				<SelectContent>
// 					<SelectGroup>
// 						{[...Array(53)].map((item, idx) => (
// 							<SelectItem
// 								key={idx}
// 								value={idx + 12 + "px"}
// 							>{`${idx + 12}px`}</SelectItem>
// 						))}
// 					</SelectGroup>
// 				</SelectContent>
// 			</Select>

//       <label className="text-sm mt-3">Text Color</label>
//       <div>
//         <input
//           type="color"
//           defaultValue={selectedEl?.style?.color || "#000000"}
//           className="w-10 h-10 rounded-xl"
//           onChange={(event) => applyStyles("color", event.target.value)}
//         />
//       </div>
// 		</div>
// 	);
// };
// export default ElementSettings;
"use client";

import { SwatchBook, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";

type Props = {
  selectedEl: HTMLElement;
  clearSelection: () => void;
};

const ElementSettings = ({ selectedEl, clearSelection }: Props) => {
  const [classes, setClasses] = useState<string[]>([]);
  const [newClass, setNewClass] = useState("");
  const [align, setAlign] = useState<string | undefined>(
    selectedEl?.style?.textAlign
  );

  const applyStyles = (property: string, value: string) => {
    if (!selectedEl) return;
    selectedEl.style[property as any] = value;
  };

  // ✅ sync alignment
  useEffect(() => {
    if (selectedEl && align) {
      selectedEl.style.textAlign = align;
    }
  }, [align, selectedEl]);

  // ✅ watch class changes
  useEffect(() => {
    if (!selectedEl) return;

    const current = selectedEl.className
      .split(" ")
      .filter((c) => c.trim() !== "");
    setClasses(current);

    const observer = new MutationObserver(() => {
      const updated = selectedEl.className
        .split(" ")
        .filter((c) => c.trim() !== "");
      setClasses(updated);
    });

    observer.observe(selectedEl, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [selectedEl]);

  const removeClass = (cls: string) => {
    const updated = classes.filter((c) => c !== cls);
    setClasses(updated);
    selectedEl.className = updated.join(" ");
  };

  const addClass = () => {
    const trimmed = newClass.trim();
    if (!trimmed) return;

    if (!classes.includes(trimmed)) {
      const updated = [...classes, trimmed];
      setClasses(updated);
      selectedEl.className = updated.join(" ");
    }

    setNewClass("");
  };

  return (
    <div className="w-96 shadow p-4 space-y-4 overflow-auto h-[90vh] rounded-xl mt-2 mr-2">
      <h2 className="flex gap-2 items-center font-bold">
        <SwatchBook /> Settings
      </h2>

      {/* 🔹 Font + Color */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-sm">Font Size</label>
          <Select
            defaultValue={selectedEl?.style?.fontSize || "24px"}
            onValueChange={(value) => applyStyles("fontSize", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select font size" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[...Array(53)].map((_, idx) => (
                  <SelectItem key={idx} value={idx + 12 + "px"}>
                    {idx + 12}px
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm block">Text Color</label>
          <input
            type="color"
            className="w-10 h-10 rounded-lg mt-1"
            defaultValue={selectedEl?.style?.color || "#000000"}
            onChange={(e) => applyStyles("color", e.target.value)}
          />
        </div>
      </div>

      {/* 🔹 Alignment */}
      <div>
        <label className="text-sm mb-1 block">Text Alignment</label>
        <ToggleGroup
          type="single"
          value={align}
          onValueChange={setAlign}
          className="bg-gray-100 rounded-lg p-1 flex w-full"
        >
          <ToggleGroupItem value="left" className="flex-1">
            <AlignLeft size={18} />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" className="flex-1">
            <AlignCenter size={18} />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" className="flex-1">
            <AlignRight size={18} />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* 🔹 Background + Radius */}
      <div className="flex items-center gap-4">
        <div>
          <label className="text-sm block">Background</label>
          <input
            type="color"
            className="w-10 h-10 rounded-lg mt-1"
            defaultValue={selectedEl?.style?.backgroundColor || "#ffffff"}
            onChange={(e) =>
              applyStyles("backgroundColor", e.target.value)
            }
          />
        </div>

        <div className="flex-1">
          <label className="text-sm">Border Radius</label>
          <Input
            type="text"
            placeholder="e.g. 8px"
            defaultValue={selectedEl?.style?.borderRadius || ""}
            onChange={(e) =>
              applyStyles("borderRadius", e.target.value)
            }
          />
        </div>
      </div>

      {/* 🔹 Padding */}
      <div>
        <label className="text-sm">Padding</label>
        <Input
          type="text"
          placeholder="e.g. 10px 15px"
          defaultValue={selectedEl?.style?.padding || ""}
          onChange={(e) => applyStyles("padding", e.target.value)}
        />
      </div>

      {/* 🔹 Margin */}
      <div>
        <label className="text-sm">Margin</label>
        <Input
          type="text"
          placeholder="e.g. 10px 15px"
          defaultValue={selectedEl?.style?.margin || ""}
          onChange={(e) => applyStyles("margin", e.target.value)}
        />
      </div>

      {/* 🔹 Class Manager */}
      <div>
        <label className="text-sm font-medium">Classes</label>

        <div className="flex flex-wrap gap-2 mt-2">
          {classes.length > 0 ? (
            classes.map((cls) => (
              <span
                key={cls}
                className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-gray-100 border"
              >
                {cls}
                <button
                  onClick={() => removeClass(cls)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">
              No classes applied
            </span>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          <Input
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
            placeholder="Add class..."
          />
          <Button type="button" onClick={addClass}>
            Add
          </Button>
        </div>
      </div>

      {/* 🔹 Clear selection */}
      <Button variant="destructive" onClick={clearSelection}>
        Clear Selection
      </Button>
    </div>
  );
};

export default ElementSettings;