export const ThinkingIcon = () => {
    return (
        <div>
            <svg className="animate-spin h-5 w-5 text-neutral-500" xmlns="http://www.w3.org/2000/svg"
                 fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                        strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    )
}

type Props = {
    className?: string
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