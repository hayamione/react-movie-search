import Modal from 'react-bootstrap/Modal';

type PopupState = 'Plot' | 'Poster' | false;

interface PlotpopupProps {
  show: PopupState;
  onHide: () => void;
  plot?: string;
  img: string;
}

const Plotpopup = ({ show, onHide, plot, img }: PlotpopupProps) => {
  const isVisible = show !== false;

  return (
    <Modal
      show={isVisible}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal show plot-popup"
    >
      <Modal.Header closeButton>
        <Modal.Title>{show || ''}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {show === 'Plot' ? <p>{plot}</p> : <img src={img} alt="poster" />}
      </Modal.Body>
    </Modal>
  );
};

export default Plotpopup;
