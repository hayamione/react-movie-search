import React from "react";
import Modal from "react-bootstrap/Modal";

const Plotpopup = ({ show, onHide, plot }) => {
  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="modal show plot-popup"
      >
        <Modal.Header closeButton>
          <Modal.Title>Plot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{plot}</p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Plotpopup;
