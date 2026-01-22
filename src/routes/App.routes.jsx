import { Routes, Route } from "react-router-dom";
import Terms from "../components/Footer/Terms.jsx";
import QuestionAndAnswer from "../pages/QuestionAndAnswer/QuestionAndAnswer.jsx";
import AskQuestion from "../pages/Question/AskQuestion/AskQuestion.jsx";
import ForgotPassword from "../pages/ForgotPassword/Forgotpassword.jsx";
import PageNotFound from "../pages/PageNotFound/PageNotFound.jsx";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy.jsx";
import Home from "../pages/Home/Home.jsx";
import AuthLayout from "../pages/AuthLayout/AuthLayout.jsx";
import HowItWorks from "../pages/HowItWorks/HowItWorks.jsx";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ask" element={<AskQuestion />} />
      <Route path="/question/:questionId" element={<QuestionAndAnswer />} />
      <Route path="/howitworks" element={<HowItWorks />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
      <Route path="/auth" element={<AuthLayout />} />
      <Route path="/forgetPass" element={<ForgotPassword />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default AppRouter;
