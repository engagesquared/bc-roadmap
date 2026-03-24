import { useEffect, useState } from "react";
import { Check, Copy, Link2, Share2 } from "lucide-react";
import { Popover, PopoverAnchor, PopoverContent } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface ModalShareActionsProps {
  permalink: string;
  shareHref: string;
  itemLabel: string;
}

export function ModalShareActions({ permalink, shareHref, itemLabel }: ModalShareActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (!isOpen && copyState !== "idle") {
      setCopyState("idle");
    }
  }, [copyState, isOpen]);

  useEffect(() => {
    setCopyState("idle");
    setIsOpen(false);
  }, [permalink]);

  useEffect(() => {
    if (!isOpen) return;

    const timeoutId = window.setTimeout(() => {
      setIsOpen(false);
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [copyState, isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(permalink);
      setCopyState("copied");
      setIsOpen(true);
    } catch {
      setCopyState("error");
      setIsOpen(true);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverAnchor asChild>
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={`Copy permalink for ${itemLabel}`}
                onClick={handleCopy}
                className="text-gray-400 hover:text-[#1A1A1A] transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <Link2 className="w-5 h-5" />
              </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={8}>
                Copy permalink
              </TooltipContent>
            </Tooltip>
          </div>
        </PopoverAnchor>
        <PopoverContent align="end" className="w-fit border-gray-200 px-3 py-2">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-[#334155]">
            {copyState === "copied" ? <Check className="w-4 h-4 text-[#2E7FE5]" /> : <Copy className="w-4 h-4 text-[#2E7FE5]" />}
            {copyState === "copied" ? "Copied link to clipboard" : "Could not copy link"}
          </div>
        </PopoverContent>
      </Popover>

      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={shareHref}
            target="_blank"
            rel="noreferrer"
            aria-label={`Share ${itemLabel} by email`}
            className="text-gray-400 hover:text-[#1A1A1A] transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <Share2 className="w-5 h-5" />
          </a>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={8}>
          Share by email
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
