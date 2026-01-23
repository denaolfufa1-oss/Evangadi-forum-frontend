import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "../../Api/Axios.js";
import Layout from "../../components/Layout/Layout.jsx";
import styles from "./answer.module.css";
import { MdAccountCircle } from "react-icons/md";
import { FaClipboardQuestion } from "react-icons/fa6";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import moment from "moment";
import Swal from "sweetalert2";

function QuestionAndAnswer() {
  const { questionId } = useParams();

  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAnswers, setExpandedAnswers] = useState({});

  const answerInput = useRef();

  // --- HELPERS (Defined inside component so they are in scope) ---
  const truncateText = (text, limit = 40) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };

  const toggleExpandAnswer = (id) => {
    setExpandedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // --- DATA FETCHING ---
  const fetchAnswers = async () => {
    try {
      const res = await instance.get(`/answers/getAnswer/${questionId}`);
      // If server returns empty list, ensure we set an empty array
      setAnswers(res.data || []);
    } catch (err) {
      console.log("No answers found or error:", err);
      setAnswers([]);
    }
  };

  useEffect(() => {
    // Get Question
    instance
      .get(`/questions/getsinglequestion/${questionId}`)
      .then((res) => {
        setQuestion(res.data);
        setLoading(false);
      })
      .catch(() => {
        Swal.fire("Error", "Failed to load question", "error");
        setLoading(false);
      });

    // Get Answers
    fetchAnswers();
  }, [questionId]);

  // --- POST ANSWER ---
  const handlePostAnswer = async (e) => {
    e.preventDefault();
    const message = answerInput.current.value;

    if (!message.trim()) return;

    try {
      await instance.post("/answers/answerQuestion", {
        questionid: questionId,
        answer: message,
      });

      Swal.fire("Success", "Answer posted", "success");

      // 1. Clear the input box
      answerInput.current.value = "";

      // 2. Fetch the answers again to show the new one immediately
      fetchAnswers();
    } catch (err) {
      Swal.fire("Error", "Failed to post answer", "error");
    }
  };

  if (loading) {
    return (
      <Layout>
        <p className={styles.loading}>Loading question...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          {/* QUESTION SECTION */}
          <div className={styles.questionSection}>
            <FaClipboardQuestion size={32} />
            <div>
              <h1>{question.title}</h1>
              <p className={styles.questionDesc}>{question.description}</p>
              <p className={styles.meta}>
                Asked by <b>@{question.username}</b> •{" "}
                {moment(question.qtn_createdAt).format("MMM DD, YYYY h:mm A")}
              </p>
            </div>
          </div>

          {/* ANSWERS SECTION */}
          <h2 className={styles.answerHeader}>
            <MdOutlineQuestionAnswer /> Answers
          </h2>

          {answers.length > 0 ? (
            answers.map((a) => {
              const isLong = a.answer.split(" ").length > 40;
              const isExpanded = expandedAnswers[a.answerid];

              return (
                <div
                  key={a.answerid || Math.random()}
                  className={styles.answerCard}
                >
                  <MdAccountCircle size={40} />
                  <div className={styles.answerBody}>
                    <b>@{a.username}</b>
                    <p>
                      {isExpanded ? a.answer : truncateText(a.answer)}
                      {isLong && (
                        <span
                          className={styles.seeMore}
                          onClick={() => toggleExpandAnswer(a.answerid)}
                        >
                          {isExpanded ? " Show Less" : " See More"}
                        </span>
                      )}
                    </p>
                    {a.createdAt && (
                      <small>
                        {moment(a.createdAt).format("MMM DD, YYYY h:mm A")}
                      </small>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className={styles.noAnswer}>No answers yet</p>
          )}

          {/* POST ANSWER FORM */}
          <div className={styles.postAnswer}>
            <h3>Post Your Answer</h3>
            <form onSubmit={handlePostAnswer}>
              <textarea
                ref={answerInput}
                placeholder="Write your answer..."
                required
              />
              <button type="submit">Post Answer</button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default QuestionAndAnswer;
