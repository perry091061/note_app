// React Note App

import React, { useState, useEffect } from 'react';
import './App.css'; // Add CSS for styling
import { saveAs } from 'file-saver';

function App() {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [images, setImages] = useState([]);

    // Load saved notes and images from localStorage
    useEffect(() => {
        const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
        const savedImages = JSON.parse(localStorage.getItem("images")) || [];
        setNotes(savedNotes);
        setImages(savedImages);
    }, []);

    // Save notes and images to localStorage
    useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes));
        localStorage.setItem("images", JSON.stringify(images));
    }, [notes, images]);

    const handleAddNote = () => {
        if (newNote.trim() === "") return;
        setNotes([...notes, newNote]);
        setNewNote("");
    };

    const handleDeleteNote = (index) => {
        setNotes(notes.filter((_, i) => i !== index));
    };

    const handlePaste = (event) => {
        const items = event.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith("image/")) {
                const file = items[i].getAsFile();
                const reader = new FileReader();

                reader.onload = (e) => {
                    setImages((prevImages) => [...prevImages, e.target.result]);
                };

                reader.readAsDataURL(file);
            }
        }
    };

    const handleSaveToFile = () => {
        // Save notes as a text file
        const notesBlob = new Blob([notes.join("\n")], { type: "text/plain;charset=utf-8" });
        saveAs(notesBlob, "notes.txt");

        // Save images
        images.forEach((image, index) => {
            const imageBlob = dataURLToBlob(image);
            saveAs(imageBlob, `image_${index + 1}.png`);
        });
    };

    const dataURLToBlob = (dataURL) => {
        const byteString = atob(dataURL.split(",")[1]);
        const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            uintArray[i] = byteString.charCodeAt(i);
        }

        return new Blob([arrayBuffer], { type: mimeString });
    };

    useEffect(() => {
        window.addEventListener("paste", handlePaste);
        return () => {
            window.removeEventListener("paste", handlePaste);
        };
    }, []);

    return (
        <div className="app">
            <h1>React Note App</h1>

            <div className="note-input">
        <textarea
            placeholder="Write your note here..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
        />
                <div className="buttons">
                    <button onClick={handleAddNote}>Add Note</button>
                    <button onClick={handleSaveToFile}>Save Notes</button>
                </div>
            </div>

            <div className="notes-list">
                {notes.length === 0 ? (
                    <p>No notes yet. Start adding some!</p>
                ) : (
                    notes.map((note, index) => (
                        <div key={index} className="note-item">
                            <p>{note}</p>
                            <button onClick={() => handleDeleteNote(index)}>Delete</button>
                        </div>
                    ))
                )}
            </div>

            <div className="images-list">
                <h2>Pasted Images</h2>
                {images.length === 0 ? (
                    <p>No images yet. Paste some images here!</p>
                ) : (
                    images.map((image, index) => (
                        <div key={index} className="image-item">
                            <img
                                src={image}
                                alt={`Pasted ${index + 1}`}
                                style={{ maxWidth: "100%", maxHeight: "200px" }}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default App;
 