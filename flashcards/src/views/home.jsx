import React, { useState } from "react";
import { Button, Container, Form, Row, Col, Card } from "react-bootstrap";

const Home = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [flashcards, setFlashcards] = useState([]);

    const handleFileChange = (e) => {
        setPdfFile(e.target.files[0]);
    };

    const handleGenerateFlashcards = () => {
        // Placeholder logic for generating flashcards
        setFlashcards([
            { id: 1, question: "What is React?", answer: "A JavaScript library for building user interfaces.", flipped: false },
            { id: 2, question: "What is Bootstrap?", answer: "A CSS framework for building responsive websites.", flipped: false },
        ]);
    };

    const handleCardFlip = (id) => {
        setFlashcards((prevFlashcards) =>
            prevFlashcards.map((card) =>
                card.id === id ? { ...card, flipped: !card.flipped } : card
            )
        );
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Flashcard Generator</h1>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Upload a PDF</Form.Label>
                            <Form.Control type="file" accept=".pdf" onChange={handleFileChange} />
                        </Form.Group>
                        <Button
                            variant="primary"
                            onClick={handleGenerateFlashcards}
                            disabled={!pdfFile}
                            className="w-100"
                        >
                            Create Flashcards
                        </Button>
                    </Form>
                </Col>
            </Row>
            {flashcards.length > 0 && (
                <Row className="mt-5">
                    <h2 className="text-center mb-4">Generated Flashcards</h2>
                    <Row className="d-flex justify-content-center">
                        {flashcards.map((card) => (
                            <Col md={4} key={card.id} className="mb-3">
                                <Card
                                    onClick={() => handleCardFlip(card.id)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <Card.Body>
                                        {card.flipped ? (
                                            <>
                                                <Card.Title>Answer</Card.Title>
                                                <Card.Text>{card.answer}</Card.Text>
                                            </>
                                        ) : (
                                            <>
                                                <Card.Title>Question</Card.Title>
                                                <Card.Text>{card.question}</Card.Text>
                                            </>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Row>
            )}
        </Container>
    );
};

export default Home;