import {Link} from "react-router-dom";

interface OutlineLinkButtonProps {
    link: string,
    text: string
}

const OutlineLinkButton = ({link, text}: OutlineLinkButtonProps) =>
    (
        <Link to={link}
              className="hidden sm:inline-flex items-center gap-2 bg-white text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">
            <span>{text}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
        </Link>
    )

export default OutlineLinkButton;