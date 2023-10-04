import React, {CSSProperties} from "react";

type Props = {
    className?: string
    onClick?: (event: React.MouseEvent<SVGElement>) => void
    style?: CSSProperties | undefined
}

export const MySpin: React.FC<Props> = ({className = ""}) => {
    return (
        <div className={className}>
            <svg viewBox="78.457 148.86 227.409 220.371" xmlns="http://www.w3.org/2000/svg"
                 className="animate-spin-slow"
            >
                <ellipse stroke="currentColor" cx="131.638" cy="178.703" rx="11.885" ry="11.365"
                         transform="matrix(1, 0, 0, 1, 0, 7.105427357601002e-15)"/>
                <ellipse stroke="currentColor" cx="175.45" cy="162.231" rx="11.885" ry="11.365"
                         transform="matrix(1, 0, 0, 1, 0, 7.105427357601002e-15)"/>
                <ellipse stroke="currentColor" cx="225.896" cy="163.467" rx="11.885" ry="11.365"
                         transform="matrix(1, 0, 0, 1, 0, 7.105427357601002e-15)"/>
                <ellipse stroke="currentColor" cx="267.806" cy="190.811" rx="11.885" ry="11.365"
                         transform="matrix(1, 0, 0, 1, 0, 7.105427357601002e-15)"/>
                <ellipse stroke="currentColor" cx="287.306" cy="227.708" rx="11.885" ry="11.365"
                         transform="matrix(1, 0, 0, 1, 0, 7.105427357601002e-15)"/>
                <ellipse stroke="currentColor" cx="291.27" cy="274.141" rx="11.885" ry="11.365"
                         transform="matrix(1, 0, 0, 1, 0, 7.105427357601002e-15)"/>
                <ellipse stroke="currentColor" cx="273.789" cy="315.057" rx="11.885" ry="11.365"
                         transform="matrix(1, 0, 0, 1, 0, 7.105427357601002e-15)"/>
                <ellipse stroke="currentColor" cx="236.308" cy="344.307" rx="11.885" ry="11.365"
                         transform="matrix(1, 0, 0, 1, 0, 7.105427357601002e-15)"/>
                <ellipse stroke="currentColor" cx="185.854" cy="353.416" rx="11.885" ry="11.365"
                         transform="matrix(1, 0, 0, 1, 0, 7.105427357601002e-15)"/>
                <ellipse stroke="currentColor" cx="136.186" cy="337.512" rx="11.885" ry="11.365"
                         transform="matrix(1, 0, 0, 1, 0, 7.105427357601002e-15)"/>
                <ellipse stroke="currentColor" cx="104.655" cy="303.404" rx="11.885" ry="11.365"
                         transform="matrix(1, 0, 0, 1, 0, 7.105427357601002e-15)"/>
                <ellipse stroke="currentColor" cx="91.996" cy="257.137" rx="11.885" ry="11.365"
                         transform="matrix(1, 0, 0, 1, 0, 7.105427357601002e-15)"/>
                <ellipse stroke="currentColor" cx="100.976" cy="215.071" rx="11.885" ry="11.365"
                         transform="matrix(1, 0, 0, 1, 0, 7.105427357601002e-15)"/>
            </svg>
        </div>
    )
}

export const CloseIcon: React.FC<Props> = ({className = "", onClick = undefined, style = undefined}) => {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} style={style}
                stroke="currentColor" className={className}
                onClick={onClick}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
    </svg>
}