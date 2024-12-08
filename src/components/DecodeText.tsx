import { useEffect, useState } from "react";
interface IDecodingText {
    initialText: string | undefined;
    speed: number;
    className: string;
    finalText: string;
}
const DecodingText = ({ initialText, speed = 50, className = "", finalText }: IDecodingText) => {
    const [displayedText, setDisplayedText] = useState(finalText);
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    useEffect(() => {
        let currentIndex = 0;
        let interval: NodeJS.Timeout;

        const decodeEffect = () => {
            if (!initialText) return
            if (currentIndex <= initialText.length) {
                const nextText = initialText.split("").map((char, index) => {
                    if (index < currentIndex) return char;
                    return characters[Math.floor(Math.random() * characters.length)];
                });

                setDisplayedText(nextText.join(""));
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        };

        interval = setInterval(decodeEffect, speed);

        return () => clearInterval(interval); // Cleanup
    }, [initialText, speed]);

    return (
        <span className={`${className}`}>
            {displayedText}
        </span>
    );
};

export default DecodingText;