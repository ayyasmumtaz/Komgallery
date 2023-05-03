import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import shareVideo from "../assets/share.mp4";
import logoNs from "../assets/logowhite.png";

import { client } from "../client";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const responseGoogle = (res) => {
    const decode = jwt_decode(res.credential);
    console.log(decode);
    try {
      localStorage.setItem("user", JSON.stringify(decode));

      const { name, picture, sub } = decode;
      console.log(decode);

      const doc = {
        _id: sub,
        _type: "user",
        userName: name,
        image: picture,
      };

      client
        .createIfNotExists(doc)
        .then(() => {
          navigate("/", { replace: true });
        })
        .catch((error) => console.log(error));
    } catch (e) {
      localStorage.clear();
      console.log(e);
      // End try
    }
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-black/50">
        <div className="flex flex-col justify-center items-center co">
          <div className="p-5">
            <img src={logoNs} width="160px" alt="logo" />
          </div>

          <div className="shadow-2x1">
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
              onSuccess={responseGoogle}
              onError={responseGoogle}
              cookiePolicy="single_host_origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;