import Code from "../assets/code.svg";

export default function Logo() {
  return (
    <div className="logo" style={{ display: "flex", gap: "10px"}}>
      <img src={Code} alt="" />
      <p>Translate Typing</p>
    </div>
  );
}
