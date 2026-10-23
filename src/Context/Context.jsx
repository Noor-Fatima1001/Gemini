import { createContext, useState } from "react";
import run from "../Config/Gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord);
        }, 75 * index);
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setInput("");
        setResultData("");
    };

    const onSent = async (prompt) => {
        try {
            setResultData("");
            setLoading(true);
            setShowResult(true);

            let result;
            const activePrompt = prompt || input;
            if (!activePrompt.trim()) {
                setLoading(false);
                return;
            }

            // Update recentPrompt and previous prompts
            setPrevPrompts((prev) => [...prev, activePrompt]);
            setRecentPrompt(activePrompt);

            // Call the external function
            result = await run(activePrompt);

            // Format the result
            let resultArray = result.split("**");
            let formattedResult = resultArray.map((chunk, i) =>
                i % 2 === 1 ? `<b>${chunk}</b>` : chunk
            ).join("");

            formattedResult = formattedResult.split("*").join("<br>");
            const wordArray = formattedResult.split(" ");

            // Gradually display the result
            wordArray.forEach((word, i) => {
                delayPara(i, word + " ");
            });

        } catch (error) {
            console.error("Error fetching data:", error);
            setResultData("An error occurred. Please try again.");
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    const contextValue = {
        setInput,
        setPrevPrompts,
        setRecentPrompt,
        loading,
        input,
        prevPrompts,
        recentPrompt,
        resultData,
        showResult,
        onSent,
        newChat,
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
