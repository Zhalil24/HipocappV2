interface ButtonProps {
  onClick?: () => void;
  text: string;
}

const Button = ({ onClick, text }: ButtonProps) => (
  <button onClick={onClick} className="bg-blue-600 text-white font-semibold">
    {text}
  </button>
);

export default Button;
