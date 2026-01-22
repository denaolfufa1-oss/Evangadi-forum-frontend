import { useEffect, useState } from "react";
import styles from "./questions.module.css";
import instance from "../../Api/Axios.js";
import QuestionCard from "../../components/QuestionCard/QuestionCard.jsx";
import Loader from "../../components/Loader/Loader.jsx";

function Question() {
  const [questions, setQuestions] = useState([]); // Store all questions
  const [loading, setLoading] = useState(false); // Loader state
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const questionsPerPage = 3; // Number of questions per page

  // Fetch questions from API
  useEffect(() => {
    setLoading(true);
    instance.get("/questions/getallquestions").then((res) => {
      setQuestions(res.data); // Set questions from API response
      setLoading(false);
    });
  }, []);

  const filteredQuestions = Array.isArray(questions)
    ? questions.filter((question) => {
        const titleMatches = question.title
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

        const descriptionMatches = question.desc
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

        return titleMatches || descriptionMatches;
      })
    : [];

  // Pagination logic
  const indexOfLastQuestion = currentPage * questionsPerPage; // Index of the last question
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage; // Index of the first question
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  ); // Get the current page's questions

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage); // Total pages calculation

  // Handlers for "Previous" and "Next" buttons
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1); // Go to previous page
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1); // Go to next page
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.search_question}>
        <input
          type="text"
          placeholder="Search for a question"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query
        />
      </div>
      <hr />
      <h1 className={styles.title}>Questions</h1>

      {/* Display loader when loading */}
      {loading ? (
        <Loader />
      ) : filteredQuestions.length === 0 ? (
        <div
          style={{
            display: "flex",
            marginTop: "60px",
            fontSize: "25px",
            color: "var(--primary-color)",
            marginBottom: "200px",
            justifyContent: "center",
          }}
        >
          <p>No Questions Found</p>
        </div>
      ) : (
        <>
          {/* Display questions for the current page */}
          {currentQuestions.map((question) => (
            <QuestionCard
              key={question.questionid}
              id={question.questionid}
              userName={question.username}
              questionTitle={question.title}
              description={question.desc}
              question_date={question.createdAt}
            />
          ))}

          {/* Pagination controls */}
          <div className={styles.pagination}>
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1} // Disable if on first page
              style={{ marginRight: "10px", padding: "10px" }}
            >
              Previous
            </button>

            {/* Page information */}
            <span>
              Page {currentPage} of {totalPages}
            </span>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages} // Disable if on last page
              style={{ marginLeft: "10px", padding: "10px" }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Question;
