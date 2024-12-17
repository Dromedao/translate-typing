import { useState, SetStateAction, Dispatch, useRef } from "react";
import ModalListCss from "../styles/ModalList.module.css";

interface ModalProps {
  title: string;
  items: string[];
  setVar: Dispatch<SetStateAction<string>>;
  image: string;
  uniqueId: string;
}

export default function ModalList({
  title,
  items,
  setVar,
  image,
  uniqueId,
}: ModalProps) {
  const [modal, setModal] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const toggleModal = () => {
    setModal(!modal);
  };

  const handleDivClick = () => {
    if (buttonRef.current) {
      buttonRef.current.click();
    }
  };

  return (
    <>
      <div className={ModalListCss["container-btn"]} onClick={handleDivClick}>
        <label htmlFor={`button-${uniqueId}`}>
          <img src={image} alt="" />
        </label>
        <button
          ref={buttonRef}
          id={`button-${uniqueId}`}
          onClick={toggleModal}
          className={ModalListCss["btn-modal"]}
        >
          {title}
        </button>
      </div>

      {modal && (
        <div className={ModalListCss["modal"]}>
          <div
            onClick={toggleModal}
            className={ModalListCss["modal__overlay"]}
          ></div>
          <div className={ModalListCss["modal__content"]}>
            <ul className={ModalListCss["modal__list"]}>
              {items.map((element) => (
                <li
                  className={ModalListCss["modal__li"]}
                  key={element}
                  onClick={() => {
                    setVar(element);
                    toggleModal();
                  }}
                >
                  {element}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
