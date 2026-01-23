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

// 
// ... (imports remain the same)

function QuestionAndAnswer() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const answerInput = useRef();

  const fetchAnswers = async () => {
    try {
      const res = await instance.get(`/answers/getAnswer/${questionId}`);
      setAnswers(res.data);
    } catch (err) {
      setAnswers([]);
    }
  };

  useEffect(() => {
    // Fetch Question
    instance.get(`/questions/getsinglequestion/${questionId}`)
      .then((res) => {
        setQuestion(res.data);
        setLoading(false);
      })
      .catch(() => Swal.fire("Error", "Failed to load question", "error"));

    // Fetch Answers
    fetchAnswers();
  }, [questionId]);

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    if (!answerInput.current.value.trim()) return;

    try {
      await instance.post("/answers/answerQuestion", {
        questionid: questionId,
        answer: answerInput.current.value,
      });

      Swal.fire("Success", "Answer posted", "success");
      answerInput.current.value = ""; // Reset input
      fetchAnswers(); // Refresh list without reload
    } catch (err) {
      Swal.fire("Error", "Failed to post answer", "error");
    }
  };

  // ... (truncateText and toggleExpandAnswer helpers remain same)

  if (loading) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <div className={styles.container}>
        {/* Question Section */}
        <div className={styles.questionSection}>
          <FaClipboardQuestion size={32} />
          <div>
            <h1>{question.title}</h1>
            <p>{question.description}</p>
          </div>
        </div>

        {/* Answers List */}
        <h2 className={styles.answerHeader}><MdOutlineQuestionAnswer /> Answers</h2>
        {answers.map((a) => (
          <div key={a.answerid} className={styles.answerCard}>
            <MdAccountCircle size={40} />
            <div className={styles.answerBody}>
              <b>@{a.username}</b>
              <p>
                {expandedAnswers[a.answerid] ? a.answer : truncateText(a.answer)}
                {a.answer?.length > 200 && (
                  <span className={styles.seeMore} onClick={() => toggleExpandAnswer(a.answerid)}>
                    {expandedAnswers[a.answerid] ? " Show Less" : " See More"}
                  </span>
                )}
              </p>
              {/* Fallback for missing createdAt */}
              {a.createdAt && <small>{moment(a.createdAt).fromNow()}</small>}
            </div>
          </div>
        ))}

        {/* Post Form */}
        <form onSubmit={handlePostAnswer} className={styles.postAnswer}>
          <textarea ref={answerInput} placeholder="Your answer..." required />
          <button type="submit">Post Answer</button>
        </form>
      </div>
    </Layout>
  );
}
export default QuestionAndAnswer;