import React, { useState, useEffect,useCallback } from 'react';
import axios from 'axios';
import { TextField, Button, Table, TableHead, TableBody, TableRow, TableCell, Typography } from '@mui/material';

const ShortNotesTable = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ product: '', quantity: '', customer_details: '' });
  const [editingNoteProduct, setEditingNoteProduct] = useState(null);
  const [editedNote, setEditedNote] = useState({ product: '', quantity: '', customer_details: '' });
  const [productError, setProductError] = useState(false); // State to track if product field is empty
  const apiurl=process.env.React_App_API_URL;

  const fetchNotes = useCallback(async () => {
    try {
      const response = await axios.get(`${apiurl}/api/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }, [apiurl]);

  useEffect(() => {
    fetchNotes();
    // Set up polling to automatically update the notes every 10 seconds
    const intervalId = setInterval(fetchNotes, 10000);
    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, [fetchNotes]);

 

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewNote({ ...newNote, [name]: value });
    // Check if the product field is empty and set error state accordingly
    if (name === 'product') {
      setProductError(value.trim() === '');
    }
  };

  const handleAddNote = async () => {
    if (newNote.product.trim() === '') {
      // If product field is empty, do not add the note
      setProductError(true);
      return;
    }
    try {
      const response = await axios.post(`${apiurl}/api/notes`, newNote);
      setNotes([...notes, response.data]);
      setNewNote({ product: '', quantity: '', customer_details: '' });
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleEdit = (product, quantity, customer_name) => {
    // Set the editing note product and initialize the edited note with the current values
    setEditingNoteProduct(product);
    setEditedNote({ product, quantity, customer_name });
  };
  
  
  const handleSave = async () => {

    try {
      const { product, quantity, customer_name } = editedNote;
      console.log('editednotes============',editedNote)
      const response = await axios.put(`${apiurl}/api/notes/`, { product,quantity, customer_name });
      const updatedNote = response.data;
  
      // Update the notes state with the updated note
      const updatedNotes = notes.map((note) => {
        if (note.sn_product === updatedNote.sn_product) {
          return updatedNote;
        }
        return note;
      });
      setNotes(updatedNotes);
  
      // Reset editing state
      setEditingNoteProduct(null);
      setEditedNote({ product: '', quantity: '', customer_details: '' });
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };
  
  

  const handleRemove = async (product) => {
    try {
      await axios.delete(`${apiurl}/api/notes/${product}`);
      const updatedNotes = notes.filter((note) => note.sn_product !== product);
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };
  const handleEditChange = (e, fieldName) => {
    setEditedNote({
      ...editedNote,
      [fieldName]: e.target.value
    });
  };
  
  

  return (
    <div>
      <Table>
  <TableHead>
    <TableRow>
      <TableCell>Product</TableCell>
      <TableCell>Quantity</TableCell>
      <TableCell>Customer Details</TableCell>
      <TableCell>Action</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {notes.map((note) => (
      <TableRow key={note.sn_id}>
        <TableCell>{note.sn_product}</TableCell>
        <TableCell>{note.quantity}</TableCell>
        <TableCell>{note.customer_name}</TableCell>
        <TableCell>
          {editingNoteProduct === note.sn_product ? (
            <>
              <>
  <TextField
    type="text"
    name="editedProduct"
    placeholder="Edit product"
    value={editedNote.product}
    onChange={(e) => handleEditChange(e, 'product')}
  />
  <TextField
    type="text"
    name="editedQuantity"
    placeholder="Edit quantity"
    value={editedNote.quantity}
    onChange={(e) => handleEditChange(e, 'quantity')}
  />
  <TextField
    type="text"
    name="editedCustomerDetails"
    placeholder="Edit customer details"
    value={editedNote.customer_details}
    onChange={(e) => handleEditChange(e, 'customer_name')}
  />
  <Button onClick={() => handleSave(editedNote)}>Save</Button>
</>
</>
          ) : (
            <>
              <Button onClick={() => handleEdit(note.sn_product)}>Edit</Button>
              <Button onClick={() => handleRemove(note.sn_product)}>Remove</Button>
            </>
          )}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
<div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
  <TextField
    type="text"
    name="product"
    style={{ marginLeft: '10px', marginRight: '10px' }}
    placeholder="Enter product"
    value={newNote.product}
    onChange={handleChange}
  />
  {productError && <Typography color="error">Product cannot be empty</Typography>}
  <TextField
    type="text"
    name="quantity"
    style={{ marginLeft: '10px', marginRight: '10px' }}
    placeholder="Enter quantity"
    value={newNote.quantity}
    onChange={handleChange}
  />
  <TextField
    name="customer_details"
    style={{ marginLeft: '10px', marginRight: '10px' }}
    placeholder="Enter customer details"
    value={newNote.customer_details}
    onChange={handleChange}
  />
  <Button onClick={handleAddNote}>Add Note</Button>
</div>

    </div>
  );
};

export default ShortNotesTable;
