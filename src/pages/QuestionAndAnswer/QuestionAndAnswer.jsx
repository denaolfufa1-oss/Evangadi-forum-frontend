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

  // ================= GET QUESTION =================
  useEffect(() => {
    instance
      .get(`/questions/getsinglequestion/${questionId}`)
      .then((res) => {
        setQuestion(res.data);
        setLoading(false);
      })
      .catch(() => {
        Swal.fire("Error", "Failed to load question", "error");
      });
  }, [questionId]);

  // ================= GET ANSWERS =================
  useEffect(() => {
    instance
      .get(`/answers/getAnswer/${questionId}`)
      .then((res) => setAnswers(res.data))
      .catch(() => setAnswers([]));
  }, [questionId]);

  // ================= POST ANSWER =================
  const handlePostAnswer = async (e) => {
    e.preventDefault();
    try {
      await instance.post("/answers/answerQuestion", {
        questionid: questionId,
        answer: answerInput.current.value,
      });

      Swal.fire("Success", "Answer posted", "success").then(() =>
        window.location.reload()
      );
    } catch {
      Swal.fire("Error", "Failed to post answer", "error");
    }
  };

  // ================= HELPERS =================
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

  if (loading) {
    return (
      <Layout>
        <p className={styles.loading}>Loading question...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page wrapper ensures footer stays at bottom */}
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          {/* ================= QUESTION ================= */}
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

          {/* ================= ANSWERS ================= */}
          <h2 className={styles.answerHeader}>
            <MdOutlineQuestionAnswer /> Answers
          </h2>

          {answers.length ? (
            answers.map((a) => {
              const expanded = expandedAnswers[a.answerid];
              return (
                <div key={a.answerid} className={styles.answerCard}>
                  <MdAccountCircle size={40} />
                  <div className={styles.answerBody}>
                    <b>@{a.username}</b>
                    <p>
                      {expanded ? a.answer : truncateText(a.answer)}
                      {a.answer.split(" ").length > 40 && (
                        <span
                          className={styles.seeMore}
                          onClick={() => toggleExpandAnswer(a.answerid)}
                        >
                          {expanded ? " Show Less" : " See More"}
                        </span>
                      )}
                    </p>
                    <small>
                      {moment(a.createdAt).format("MMM DD, YYYY h:mm A")}
                    </small>
                  </div>
                </div>
              );
            })
          ) : (
            <p className={styles.noAnswer}>No answers yet</p>
          )}

          {/* ================= POST ANSWER ================= */}
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
