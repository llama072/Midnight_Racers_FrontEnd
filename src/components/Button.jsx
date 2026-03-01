export default function Button({ content, color, onClick }) {
    // Ha a color "dark", akkor a class "btn btn-dark" lesz
    return (
        <button 
            className={`btn btn-${color} w-100`} 
            onClick={onClick}
            style={{ cursor: 'pointer' }}
        >
            {content}
        </button>
    );
}