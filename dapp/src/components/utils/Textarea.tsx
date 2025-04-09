import type { ChangeEventHandler, FC } from "react";

interface Props {
  className?: string;
  placeholder?: string;
  value?: string | number | readonly string[];
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
}

const Textarea: FC<Props> = ({ className, placeholder, value, onChange }) => {
  return (
    <textarea
      className={`p-[18px] border border-border outline-none ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default Textarea;
