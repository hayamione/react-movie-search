import React from "react";
import Modal from "react-bootstrap/Modal";

const Plotpopup = ({ show, onHide, plot, img }) => {
  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="md"
        className={`modal show plot-popup ${
          show === "Plot" ? "" : "img-modal"
        }`}
      >
        <Modal.Header closeButton>
          <Modal.Title>{show}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {show === "Plot" ? <p>{plot}</p> : <img src={img} alt="poster" />}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Plotpopup;
