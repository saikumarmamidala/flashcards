import React, { useState } from "react";
import { Button, Container, Form, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import OpenAI from "openai";
import { useAuth } from "../context/authContext";

const Home = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const { user } = useAuth();
  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleGenerateFlashcards = async () => {
    if (!pdfFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", pdfFile);
    try {
      const response = await axios.post(
        process.env.REACT_APP_FLASHCARDS_API,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const content = response.data.message;

      const flashcardResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Generate flashcards from the following content:\n\n${content}. Each flashcard should have a question and an answer. Format the response as JSON with "question" and "answer" keys for each flashcard.`,
          },
        ],
      });

      if (
        !flashcardResponse.choices ||
        !flashcardResponse.choices[0] ||
        !flashcardResponse.choices[0].message ||
        !flashcardResponse.choices[0].message.content
      ) {
        throw new Error("Invalid OpenAI API response: Missing content.");
      }

      let flashcardData;
      try {
        flashcardData = JSON.parse(
          flashcardResponse.choices[0].message.content
        );
      } catch (parseError) {
        throw new Error("Failed to parse OpenAI API response as JSON.");
      }
      console.log("Flashcard data:", flashcardData);

      if (!Array.isArray(flashcardData)) {
        throw new Error(
          "Invalid response format: Expected an array of flashcards."
        );
      }

      const generatedFlashcards = flashcardData.map((item, index) => ({
        id: index + 1,
        question: item.question,
        answer: item.answer,
        flipped: false,
      }));

      setFlashcards(generatedFlashcards);
      console.log("Generated flashcards:", generatedFlashcards);
    } catch (error) {
      console.error("Error generating flashcards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardFlip = (id) => {
    setFlashcards((prevFlashcards) =>
      prevFlashcards.map((card) =>
        card.id === id ? { ...card, flipped: !card.flipped } : card
      )
    );
  };

  const handleEmailFlashcards = async () => {
    setEmailLoading(true);
    try {
      const emailContent = flashcards
        .map(
          (card) =>
            `"question": "${card.question}", "answer": "${card.answer}",`
        )
        .join("\n\n");

      await axios.post(
        process.env.REACT_APP_SNS_API,
        {
          username: user,
          flashcards: flashcards.map(({ id, flipped, ...rest }) => rest),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Flashcards sent to your email!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again.");
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Flashcard Generator</h1>
      <Row className="justify-content-center">
        <Col md={6}>
          <Form>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload a PDF</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={handleGenerateFlashcards}
              disabled={!pdfFile || loading}
              className="w-100"
            >
              {loading ? "Generating..." : "Create Flashcards"}
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
          <Row className="mt-4">
            <Col className="text-center">
              <Button
                variant="success"
                onClick={handleEmailFlashcards}
                disabled={emailLoading}
              >
                {emailLoading ? "Sending..." : "Email Me"}
              </Button>
            </Col>
          </Row>
        </Row>
      )}
    </Container>
  );
};

export default Home;
