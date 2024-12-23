import { useState, SetStateAction, Dispatch, useRef } from "react";
import ModalListCss from "../styles/ModalList.module.css";
import { useTranslation } from "react-i18next";

interface ModalProps {
  title: string;
  items: string[];
  setVar: Dispatch<SetStateAction<string>>;
  image: string;
  uniqueId: string;
  changeLanguage?: boolean;
}

export default function ModalList({
  title,
  items,
  setVar,
  image,
  uniqueId,
  changeLanguage,
}: ModalProps) {
  const [modal, setModal] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const toggleModal = () => {
    setModal(!modal);
  };

  const { i18n } = useTranslation();
  const changeLanguageFunc = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Se ha cambiado a un evento para que al hacer clic en la imagen también se abra el modal
  const handleImageClick = () => {
    toggleModal();
  };

  const handleDivClick = () => {
    if (buttonRef.current) {
      buttonRef.current.click();
    }
  };

  return (
    <>
      <div className={ModalListCss["container-btn"]} onClick={handleDivClick}>
        {/* Usar un evento en la imagen directamente */}
        <img
          style={{ width: "25px" }}
          src={image}
          alt=""
          onClick={handleImageClick} // Activar el modal al hacer clic en la imagen
        />
        <button
          translate="no"
          ref={buttonRef}
          id={`button-${uniqueId}`}
          onClick={toggleModal} // Se mantiene la funcionalidad de abrir modal al hacer clic en el botón
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
                  translate="no"
                  className={ModalListCss["modal__li"]}
                  key={element}
                  onClick={() => {
                    if (changeLanguage) {
                      changeLanguageFunc(element);
                    }
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
