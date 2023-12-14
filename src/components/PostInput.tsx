import { useWallet } from "@txnlab/use-wallet";
import algosdk from "algosdk";
import AlgodClient from "algosdk/dist/types/client/v2/algod/algod";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { useOutletContext } from "react-router-dom";
import { NotePrefix } from "../enums/notePrefix";
import { PostProps } from "../services/Post";
import { Transaction } from "../services/Transaction";
import { UserInterface } from "../services/User";
import { getUserCountry } from "../utils/userUtils";
import Button from "./Button";

interface PostInputOutletContext {
  algod: AlgodClient;
  userData: UserInterface;
}

interface PostPropsInterface {
  setPosts(post: PostProps): void;
}

const placeholderPhrases = [
  "Craft a Coop Coin message on WeCoop, be timeless in Algorand!",
  "Compose on WeCoop, pay with Coop Coin, live on Algorand!",
  "Share on WeCoop, Coop Coin ensures it's eternal in Algorand.",
  "WeCoop message, Coop Coin pays, Algorand bound.",
  "Craft with Coop Coin on WeCoop, echo in Algorand.",
  "WeCoop awaits, unlock with Coop Coin, Algorand bound.",
  "Tell your WeCoop story, use Coop Coin, Algorand's history.",
  "Create on WeCoop, Coop Coin resonates in Algorand.",
  "Coop Coin: Key to WeCoop. Start writing, resonate in Algorand!",
  "Speak up on WeCoop! Coop Coin, part of Algorand's history.",
  "Compose on WeCoop, Coop Coin echoes in Algorand.",
  "Let your WeCoop message fly, Coop Coin immortalizes in Algorand.",
  "WeCoop's wall is yours. Coop Coin opens, your message in Algorand.",
  "Craft your WeCoop message, pay with Coop Coin, resonate in Algorand.",
  "Coop Coin is your ink, WeCoop's paper. Start creating, resonate in Algorand.",
  "WeCoop's arena awaits. Pay with Coop Coin, your message in Algorand forever.",
  "Create impact on WeCoop, Coop Coin your ticket to Algorand's eternity.",
  "WeCoop: Your platform, your messages. Coop Coin echoes in Algorand."
];

const PostInput = ({ setPosts }: PostPropsInterface) => {
  const { signTransactions, sendTransactions, activeAccount } = useWallet();
  const { algod, userData } = useOutletContext() as PostInputOutletContext;
  const [inputText, setInputText] = useState<string>("");
  const [placeholderSelected] = useState(placeholderPhrases[Math.floor(Math.random() * placeholderPhrases.length)]);

  const [placeholder, setPlaceholder] = useState(placeholderSelected.slice(0, 0));
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const intr = setInterval(() => {
      setPlaceholder((prevPlaceholder) => {
        const nextChar = placeholderSelected[prevPlaceholder.length];

        return nextChar !== undefined ? prevPlaceholder + nextChar : prevPlaceholder;
      });

      if (placeholderIndex + 1 > placeholderSelected.length) {
        clearInterval(intr);
      } else {
        setPlaceholderIndex((prevIndex) => prevIndex + 1);
      }
    }, 50);

    return () => {
      clearInterval(intr);
    };
  }, [placeholderIndex, placeholderSelected]);

  const transactionServices = new Transaction(algod);
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    setInputText(text);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPosts({ text: inputText, creator_address: userData.address, status: "loading", timestamp: null, transaction_id: null });
    const country = await getUserCountry();
    const note = `${NotePrefix.WeCoopPost}${country}:${inputText}`;


    try {
      const transaction = await transactionServices.createTransaction(
        userData.address,
        "GYET4OG2L3PIMYSEJV5GNACHFA6ZHFJXUOM7NFR2CDFWEPS2XJRTS45YMQ",
        100000,
        note
      );

      const encodedTransaction = algosdk.encodeUnsignedTransaction(transaction);
      const signedTransactions = await signTransactions([encodedTransaction]);
      const waitRoundsToConfirm = 4;
      const { id } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
      setPosts({
        creator_address: userData.address,
        text: inputText,
        status: "accepted",
        transaction_id: id,
        country,
        nfd: userData.nfd,
        timestamp: null
      });
    } catch (error) {
      console.error(error);
      setTimeout(
        () => setPosts({ text: inputText, creator_address: userData.address, status: "denied", timestamp: null, transaction_id: null }),
        1000
      );
    }
  };
  return (
    <form onSubmit={handleSubmit} action="">
      {" "}
      <div className="p-2 border-2 border-gray-900 flex flex-col gap-3 items-end border-b-4 dark:border-gray-500">
        <div className="w-full relative ">
          <textarea
            maxLength={300}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full border-2  align-top text-start break-all whitespace-normal h-32 p-2 resize-none  z-20 focus:scale-101 focus:border-b-4 border-gray-900 focus:outline-gray-500"
          />
          <div className="absolute right-5 bottom-2">{`${inputText.length}/300`}</div>
        </div>
        <div>
          <div className="flex items-center text-red-600 gap-1">
            <FaArrowRight />

            <p>Note: All posts and interactions are permanently recorded on the Algorand blockchain.</p>
          </div>
        </div>
        {activeAccount?.address && inputText !== "" && inputText.length <= 300 ? (
          <Button buttonText="Send your message" />
        ) : (
          <Button inactive={true} buttonText="Send your message" />
        )}
      </div>
    </form>
  );
};

export default PostInput;
