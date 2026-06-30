interface PropsTitle extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const TitleFuturistic = ({ children, as: Tag = "h2", className, ...props }: PropsTitle) => (
    <Tag
        className={`text-4xl font-extrabold text-teal-600 drop-shadow-lg dark:text-dark-primary ${className || ""}`}
        {...props}
    >
        {children}
    </Tag>
);

export default TitleFuturistic;
