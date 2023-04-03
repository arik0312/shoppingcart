import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  ButtonGroup,
  Form,
  Modal,
  InputGroup,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faMinus,
  faPlus,
  faTrash,
  faAdd,
  faClose,
  faEdit,
  faSave,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

import ManIcon from "../icons/man.png";
import trolley from "../icons/trolley.png";

const ShoppingList = () => {
  const [items, setItems] = useState([]);

  const [total, setTotal] = useState(0);
  const [totalqty, setTotalQty] = useState(0);
  const [newProduct, setNewProduct] = useState({
    itemname: "",
    price: 0,
    qty: 0,
  });
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/getshoppinitems")
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
      })
      .catch((error) => {
        msgerror();
      });
  }, []);

  function msgerror() {
    toast.error("שגיאה", {
      position: "top-center",
      autoClose: 800,
      hideProgressBar: true,
      closeOnClick: false,
      rtl: true,
    });
  }

  const handleedit = (index) => {
    const item = items[index];
    const id = item.id;
    const itemname = item.itemname;
    const price = item.price;
    const qty = item.qty;
    setNewProduct({ id, itemname, price, qty });
    setShowAddProductModal(true);
  };

  const handleDeleteItem = (index) => {
    Swal.fire({
      text: "למחוק את הפריט מהרשימה" + " " + "?" + items[index].itemname,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#3085d6",
      cancelButtonText: "לא",
      confirmButtonText: "כן",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const itemname = items[index].itemname;
        fetch(`http://localhost:3001/DeleteShoppingListItem/${itemname}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              setItems(items.filter((item, i) => i !== index));
              setTotal(total - parseFloat(items[index].price));
              setTotalQty(totalqty - items[index].qty);
              msgdelete();
            } else {
              throw new Error("Failed to delete item");
            }
          })
          .catch((error) => {
            console.error(error);
            console.log(error);
          });
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

  function msgupitemexsits() {
    toast.info("הפריט כבר נמצא במערכת", {
      position: "top-center",
      autoClose: 800,
      hideProgressBar: true,
      closeOnClick: false,
      rtl: true,
    });
  }

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
    handleresetfields();
  }

  function msgupdatedSucceful() {
    toast.success("הפריט עודכן בהצלחה", {
      position: "top-center",
      autoClose: 800,
      hideProgressBar: true,
      closeOnClick: false,
      rtl: true,
    });
    handleresetfields();
  }
  function handleResetCart() {
    setItems([]);
    setTotal(0);
    setTotalQty(0);
  }

  function handleresetfields() {
    setNewProduct({ itemname: "", price: 0, qty: 0 });
    setShowAddProductModal(false);
  }

  // const handleAddNewProduct = () => {
  //   // Check if item already exists
  //   fetch(`http://localhost:3001/CheckItem/${newProduct.itemname}`)
  //     .then((response) => {
  //       if (response.ok) {
  //         return response.json();
  //       } else {
  //         throw new Error("Failed to check item");
  //       }
  //     })
  //     .then((data) => {
  //       if (data.length > 0) {
  //         // Item already exists, show error message
  //         msgAddedFail("Item already exists");
  //       } else {
  //         // Item does not exist, add to shopping list
  //         if (!newProduct.id) {
  //           // Adding new item
  //         } else {
  //           // Updating existing item
  //           fetch(
  //             `http://localhost:3001/UpdateShoppingListItem/${newProduct.id}`,
  //             {
  //               method: "PUT",
  //               headers: {
  //                 "Content-Type": "application/json",
  //               },
  //               body: JSON.stringify(newProduct),
  //             }
  //           )
  //             .then((response) => {
  //               if (response.ok) {
  //                 setItems(
  //                   items.map((item) =>
  //                     item.id === newProduct.id ? newProduct : item
  //                   )
  //                 );
  //                 setShowAddProductModal(false);
  //                 msgupdatedSucceful();
  //               } else {
  //                 throw new Error("Failed to update product");
  //               }
  //             })
  //             .catch((error) => {
  //               console.error(error);
  //               msgAddedFail();
  //             });
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       msgAddedFail();
  //     });
  // };

  const handleAddNewProduct = () => {
    // Check if item already exists
    fetch(`http://localhost:3001/CheckItem/${newProduct.itemname}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to check item");
        }
      })
      .then((data) => {
        if (data.length > 0) {
          // Item already exists, show error message
          msgupitemexsits();
        } else {
          // Item does not exist, add to shopping list
          fetch("http://localhost:3001/AddNewShoppingList", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newProduct),
          })
            .then((response) => {
              if (response.ok) {
                msgAddedSucceful();
                setItems([...items, newProduct]);
              } else {
                throw new Error("Failed to add product");
              }
            })
            .catch((error) => {
              console.error(error);
              msgAddedFail();
            });
        }
      })
      .catch((error) => {
        console.error(error);
        msgAddedFail();
      });
  };

  const msgAddedFail = () => {
    alert("Failed to add product. Please try again later.");
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
                    <td>{item.itemname}</td>
                    <td>{item.qty}</td>
                    <td>{item.price}</td>
                    <td>
                      <div>
                        <span
                          style={{ width: "10px", display: "inline-block" }}
                        ></span>
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteItem(index)}
                        >
                          Remove
                          <FontAwesomeIcon icon={faTrash} className="mr-2" />
                        </Button>
                        <span
                          style={{ width: "10px", display: "inline-block" }}
                        ></span>
                        <Button
                          variant="success"
                          onClick={() => handleedit(index)}
                        >
                          <span
                            style={{ width: "10px", display: "inline-block" }}
                          ></span>
                          edit
                          <FontAwesomeIcon icon={faEdit} className="mr-2" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col>
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
            style={{ textAlign: "center", backgroundColor: "dodgerblue" }}
          >
            <Modal.Title
              style={{ textAlign: "center", color: "white", width: "100%" }}
            >
              <img src={trolley} style={{ marginRight: "10px" }} />
              <span style={{ marginLeft: "10px" }}>
                {newProduct.id
                  ? `עדכן פריט ${newProduct.itemname}`
                  : "הוספת פריט חדש"}
              </span>
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
                  value={newProduct.itemname}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, itemname: e.target.value })
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
                  onContextMenu={(e) => {
                    e.preventDefault();
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formqty">
                <Form.Label>כמות</Form.Label>
                <InputGroup>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setNewProduct({
                        ...newProduct,
                        qty: parseInt(newProduct.qty) - 1,
                      })
                    }
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </Button>
                  <Form.Control
                    type="text"
                    placeholder="Enter qty"
                    value={newProduct.qty}
                    maxLength={3}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, qty: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (isNaN(parseInt(e.key))) {
                        e.preventDefault();
                      }
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                    }}
                  />
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setNewProduct({
                        ...newProduct,
                        qty: parseInt(newProduct.qty) + 1,
                      })
                    }
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </InputGroup>
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
                <FontAwesomeIcon icon={faSave} />
                <span style={{ marginLeft: "10px" }}>
                  {newProduct.id
                    ? `Update Product ${newProduct.id}`
                    : "Add Product"}
                </span>
              </div>
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default ShoppingList;
