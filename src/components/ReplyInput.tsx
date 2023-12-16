import Button from "./Button";
import { useWallet } from "@txnlab/use-wallet";

type ReplyInputProps = {
  handleChange(event: React.ChangeEvent<HTMLTextAreaElement>): void
  placeholder: string
  handleSubmit: () => void
  value: string
}

export const ReplyInput = ({ handleChange, placeholder, value, handleSubmit }: ReplyInputProps) => {
  const { activeAccount } = useWallet();
  return (
    <div className="w-full relative ">
          <textarea
            maxLength={250}
            onChange={handleChange}
            value={value}
            placeholder={placeholder}
            className="w-full border-2  align-top text-start break-all whitespace-normal h-32 p-2 resize-none  z-20 focus:scale-101 focus:border-b-4 border-gray-900 focus:outline-gray-500"
          />
      <div className={"flex justify-between mt-4"}>
        {activeAccount?.address && value !== "" && value.length <= 300 ? (
          <Button buttonText="Send your message" buttonFunction={handleSubmit} />
        ) : (
          <Button inactive={true} buttonText="Send your message" />
        )}
        <div className="">{`${value.length}/250`}</div>

      </div>
    </div>
  );
};
