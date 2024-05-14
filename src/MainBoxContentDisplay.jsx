function MainBoxContentDisplay({ content }) {
    return (
        <div className="messages-container">
            {content.map((item, index) => (
                <div key={index} className={item.props.className}>
                    {item.props.children}
                </div>
            ))}
        </div>
    );
}

export default MainBoxContentDisplay;