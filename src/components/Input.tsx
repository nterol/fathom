import { type ChangeEvent } from "react";

type InputProps = {
  value: string;
  setValue: (s: string) => void;
};

export function TitleInput({ value, setValue }: InputProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

  return (
    <input
      type="text"
      required
      value={value}
      placeholder="Your title"
      onChange={handleChange}
      className="border-1 mb-2 block w-full rounded-sm border-green-800 bg-neutral-100 px-4 py-2 focus:outline-none"
    />
  );
}

export function DescriptionInput({ value, setValue }: InputProps) {
  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setValue(event.target.value);
  }
  return (
    <textarea
      placeholder="Your description"
      value={value}
      onChange={handleChange}
      className="border-1 mb-2 block w-full rounded-sm border-green-800 bg-neutral-100 px-4 py-2 focus:outline-none"
    />
  );
}
