import type { ReactNode } from "react";

interface CardInformationProps {
    children: ReactNode;
}

const CardInformation = ({ children }: CardInformationProps) => {
    return (
        <div className="card text-center">
            {children}
        </div>
    );
};

export default CardInformation;