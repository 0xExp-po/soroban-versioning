import { useState } from "react";

interface AnonymousVoteToggleProps {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function AnonymousVoteToggle({
  defaultChecked = true,
  onChange,
}: AnonymousVoteToggleProps) {
  const [isAnonymous, setIsAnonymous] = useState(defaultChecked);

  const handleToggleChange = (checked: boolean) => {
    setIsAnonymous(checked);
    onChange?.(checked);
  };

  return (
    <div className="flex-col space-y-2">
      <div className="flex items-start space-x-3">
        <div className="flex items-center">
          <button
            type="button"
            role="switch"
            aria-checked={isAnonymous}
            onClick={() => handleToggleChange(!isAnonymous)}
            className={`relative inline-flex h-[18px] w-[30px] shrink-0 cursor-pointer items-center border-2 rounded-sm p-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 border-secondary ${isAnonymous ? "bg-zinc-500" : "bg-white"}`}
          >
            <span
              className={`pointer-events-none block h-2.5 w-2.5 transform transition-transform rounded-xs bg-primary ${isAnonymous ? "translate-x-3.5" : "translate-x-0.5"}`}
            />
          </button>
        </div>
        <h4 className="text-base leading-4 text-primary">Anonymous Vote</h4>
      </div>
      <p className="text-base text-secondary">
        Only the final results are visible. Participants are listed, but their
        choices remain private.
      </p>
    </div>
  );
}
