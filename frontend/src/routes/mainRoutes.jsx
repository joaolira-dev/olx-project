/* eslint-disable react-refresh/only-export-components */
import PrivateRoute from "../components/PrivateRoute";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import Signin from "../pages/Signin/Signin";
import Signup from "../pages/Signup/Signup";
import AdPage from "../pages/AdPage/AdPage";
import PostAd from "../pages/PostAd/PostAd"
import Ads from "../pages/Ads/Ads"
import MyAccount from "../pages/MyAccount/MyAccount"


export default () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<Signin/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="*" element={<NotFound/>}/>
      <Route path="/ad/:id" element={<AdPage/>}/>
      <Route element={<PrivateRoute/>}>
        <Route path="/post-an-ad" element={<PostAd/>}/>
      </Route>
      <Route path="/ads" element={<Ads/>} />
      <Route element={<PrivateRoute/>}>
        <Route path="/my-account" element={<MyAccount/>}/>
      </Route>
    </Routes>
  );
};
