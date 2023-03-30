import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  ButtonGroup,
  Form,
  Modal,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { faCashRegister } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
const ShoppingList = () => {
  const [items, setItems] = useState([]);

  const [total, setTotal] = useState(0);
  const [totalqty, setTotalQty] = useState(0);
  const [newProduct, setNewProduct] = useState({ name: "", price: 0, qty: 0 });
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const handleAddToCart = (index) => {
    const item = items[index];
    const sum = parseFloat(item.price) + parseFloat(total);
    const sumqty = parseFloat(item.qty) + parseFloat(totalqty);
    setTotal(sum);
  };

  const handleDeleteItem = (index) => {
    Swal.fire({
      text: "למחוק את הפריט מהרשימה" + " " + "?" + items[index].name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#3085d6",
      cancelButtonText: "לא",
      confirmButtonText: "כן",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        setItems(items.filter((item, i) => i !== index));
        setTotal(total - parseFloat(items[index].price));
        setTotalQty(totalqty - items[index].qty);
        msgdelete();
      }
    });
  };

  const checkhandleAddNewProduct = () => {
    if (
      newProduct.name === "" ||
      newProduct.price === 0 ||
      newProduct.price === "" ||
      newProduct.qty === 0 ||
      newProduct.qty === ""
    ) {
      toast.error("יש למלאות את כל השדות", {
        position: "top-center",
        autoClose: 800,
        hideProgressBar: true,
        closeButton: false,
        rtl: true,
      });
    } else {
      handleAddNewProduct();
    }
  };

  function msgdelete() {
    toast.info("הפריט נמחק בהצלחה", {
      position: "top-left",
      autoClose: 800,
      hideProgressBar: true,
      closeOnClick: false,
      rtl: true,
    });
  }

  function msgAddedSucceful() {
    toast.success("הפריט נשמר בהצלחה", {
      position: "top-center",
      autoClose: 800,
      hideProgressBar: true,
      closeOnClick: false,
      rtl: true,
    });
  }

  function handleResetCart() {
    setItems([]);
    setTotal(0);
    setTotalQty(0);
  }

  function handleresetfields() {
    setNewProduct({ name: "", price: 0, qty: 0 });
    setShowAddProductModal(false);
  }

  const handleAddNewProduct = () => {
    setItems([...items, newProduct]);
    setTotal(total + parseFloat(newProduct.price));
    setTotalQty(totalqty + 1);
    setNewProduct({ name: "", price: 0, qty: 0 });
    setShowAddProductModal(false);
    msgAddedSucceful();
  };

  return (
    <>
      <ToastContainer />
      <Container dir="rtl">
        <Row>
          <Col>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>שם הפריט</th>
                  <th>כמות</th>
                  <th>מחיר</th>
                  <th>פעולות</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>{item.price}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => handleAddToCart(index)}
                      >
                        <FontAwesomeIcon
                          icon={faCashRegister}
                          className="mr-5"
                        />
                        Add to Total
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteItem(index)}
                      >
                        Remove
                        <FontAwesomeIcon icon={faTrash} className="mr-2" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col>
            <ButtonGroup>
              <Button
                variant="danger"
                className="mr-2"
                onClick={handleResetCart}
              >
                Reset cart
              </Button>
              <Button
                variant="success"
                className="mr-2"
                onClick={() => setTotal(0)}
              >
                Reset amount total
              </Button>
            </ButtonGroup>
            <Button
              variant="info"
              className="ml-2"
              onClick={() => setShowAddProductModal(true)}
            >
              <FontAwesomeIcon icon={faAdd} className="mr-2" color="white" />
              Add New Product
            </Button>
            <h4>Total: ${total}</h4>
            <h5>Qty: {totalqty}</h5>
          </Col>
        </Row>
        <Modal
          show={showAddProductModal}
          onHide={() => setShowAddProductModal(false)}
          backdrop="static"
        >
          <Modal.Header
            style={{ textAlign: "center", backgroundColor: "green" }}
          >
            <Modal.Title
              style={{ textAlign: "center", color: "white", width: "100%" }}
            >
              הוספת פריט חדש
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form dir="rtl">
              <Form.Group controlId="formProductName">
                <Form.Label>שם הפריט</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="הקלד את שם הפריט"
                  autoFocus={true}
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formProductPrice">
                <Form.Label>מחיר</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="מחיר"
                  maxLength={10}
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  // onKeyDown={(e) => {
                  //   const regex = /^[0-9\b]+$/; // only allow numeric characters
                  //   if (!regex.test(e.key)) {
                  //     e.preventDefault(); // prevent non-numeric characters from being entered
                  //   }
                  // }}
                  onContextMenu={(e) => {
                    e.preventDefault(); // Prevent the right-click context menu from appearing
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formqty">
                <Form.Label>כמות</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter qty"
                  value={newProduct.qty}
                  maxLength={3}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, qty: e.target.value })
                  }
                  // onKeyDown={(e) => {
                  //   const regex = /^[0-9\b]+$/; // only allow numeric characters
                  //   if (!regex.test(e.key)) {
                  //     e.preventDefault(); // prevent non-numeric characters from being entered
                  //   }
                  // }}
                  onContextMenu={(e) => {
                    e.preventDefault(); // Prevent the right-click context menu from appearing
                  }}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleresetfields}>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faClose} />
                <span style={{ marginLeft: "10px" }}>סגור</span>
              </div>
            </Button>
            <Button variant="primary" onClick={checkhandleAddNewProduct}>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faAdd} />
                <span style={{ marginLeft: "10px" }}>Add Product</span>
              </div>
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default ShoppingList;
