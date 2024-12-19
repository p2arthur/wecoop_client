import { FaQuestionCircle } from "react-icons/fa"

interface TooltipProps {
    tooltipText: string
}

export default function Tooltip({ tooltipText }: TooltipProps) {
    return (
        <>
            <div className="group z-50"><FaQuestionCircle /><div className="group-hover:flex hidden absolute p-1 bg-white text-md w-64 text-gray-900">{tooltipText}</div> </div>
        </>
    )
}
